import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import connection from "./database/db";
import multer from "multer";
import cors from "cors";
import { validateData, writeDataToFile } from "./utility/utility";

const validDataArr: any[] = [];
const notValidDataArr: any[] = [];

const batchSize = 100000;

// Models
const insertDataToDb = (records: any[]) => {
  // Return a Promise that resolves if the operation was successful, or rejects if there was an error
  return new Promise((resolve, reject) => {
    // Create the table named data
    connection.query(
      `
    CREATE TABLE IF NOT EXISTS data (
      id INT PRIMARY KEY AUTO_INCREMENT,
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
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }

        const values = records.map((row) => Object.values(row));

        for (let i = 0; i < values.length; i += batchSize) {
          const batch = values.slice(i, i + batchSize);

          // Insert the data into the table using the bulk method
          connection.query(
            "INSERT INTO data (departure_time, return_time, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration) VALUES ?",
            [batch],
            (error: any) => {
              if (error) {
                reject(error); // Reject the Promise if there was an error
                return;
              }
            }
          );
        }
        resolve(true); // Resolve the Promise if the operation was successful
      }
    );
  });
};

// Controllers
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
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    try {
      if (req.file) {
        const pathOfFile = path.join(__dirname, `../${req.file?.path}`);

        try {
          // validate data
          const validateResult = await validateData(
            pathOfFile,
            validDataArr,
            notValidDataArr
          );
          console.log("validateResult: ", validateResult);
          if (validateResult) {
            // Write not valid data to file
            const writeDataToFileResult = await writeDataToFile(
              notValidDataArr
            );

            // Insert read data to database
            const insertDataToDbResult = await insertDataToDb(validDataArr);
            console.log("writeDataToFileResult: ", writeDataToFileResult);
            console.log("insertDataToDbResult: ", insertDataToDbResult);

            if (writeDataToFileResult && insertDataToDbResult) {
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
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        throw new Error("Missing file in request");
      }
    } catch (err) {
      throw err;
    }
  });
};

const app = express();

app.use(cors());

app.post("/api/upload", uploadData);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.get("/api/download", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../download/NotValidData.csv"));
});

const PORT = 7000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("==============================");
  console.log("Server listening on port ", PORT);
  console.log("==============================");
});
