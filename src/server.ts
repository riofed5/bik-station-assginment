import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import connection from "./database/db";
import { write, parse } from "fast-csv";
import multer from "multer";
import cors from "cors";

const writeDataToFile = (data: any) => {
  const stream = fs.createWriteStream(
    path.join(__dirname, "../download/NotValidData.csv")
  );

  write(data, { headers: true }).pipe(stream);
};

const filterRow = (row: any) => {
  return (
    parseInt(row["Covered distance (m)"]) > 10 &&
    parseInt(row["Duration (sec.)"]) > 10
  );
};

const insertDataToDb = (pathToSelectedFile: string) => {
  const records: any[] = [];
  const notRecords: any[] = [];

  // Read the .csv file
  fs.createReadStream(pathToSelectedFile)
    .pipe(parse({ headers: true }))
    .on("data", (row: any) => {
      const validRow = filterRow(row);
      if (validRow) {
        records.push(row);
      } else {
        notRecords.push(row);
      }
    })
    .on("end", () => {
      // Create the table
      connection.query(
        `
      CREATE TABLE IF NOT EXISTS data (
        departure_time DATETIME,
        return_time DATETIME,
        departure_station_id INT,
        departure_station_name VARCHAR(255),
        return_station_id INT,
        return_station_name VARCHAR(255),
        covered_distance INT,
        duration INT
      );
    `,
        (error: any, results: any) => {
          if (error) throw error;

          const values = records.map((row) => Object.values(row));

          // Insert the data into the table using the bulk method
          connection.query(
            "INSERT INTO data (departure_time, return_time, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration) VALUES ?",
            [values],
            (error: any) => {
              if (error) throw error;
              console.log("Data imported successfully");
            }
          );
        }
      );

      // Write the not valid data to file
      writeDataToFile(notRecords);
    });
};

const app = express();

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }).single("file");

const uploadData = (req: Request, res: Response) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    try {
      if (req.file) {
        const pathOfFile = path.join(__dirname, `../${req.file?.path}`);
        insertDataToDb(pathOfFile);

        fs.access(
          path.join(__dirname, "../download/NotValidData.csv"),
          fs.constants.F_OK,
          (error) => {
            if (error) {
              console.log("File does not exist");
              res.status(200).send({ status: false });
            } else {
              console.log("File exists");
              res
                .status(200)
                .send({ status: true, fileName: "NotValidData.csv" });
            }
          }
        );
      } else {
        throw new Error("Missing file in request");
      }
    } catch (err) {
      throw err;
    }
  });
};

app.post("/api/upload", uploadData);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/api/download", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../download/NotValidData.csv"));
});

app.listen(7000, () => {
  console.log("==============================");
  console.log("Server listening on port 3000");
  console.log("==============================");
});
