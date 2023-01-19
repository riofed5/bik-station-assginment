import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import pool from "./database/db";
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
    pool.query(
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
          pool.query(
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

const getJourneyList = (params: string[]) => {
  const page = parseInt(params[0]);
  // page= 1 then from =1 and to = 50; page= 2 then from =51 and to = 100
  const limit = 50;
  const from = (+page - 1) * limit + 1;
  const to = +page * limit;

  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `SELECT id, departure_station_name, return_station_name, covered_distance, duration FROM data WHERE id >=${from} and id <=${to}`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getStationList = (params: string[]) => {
  const page = parseInt(params[0]);
  const limit = 50;

  const offsetValue = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      ` WITH cte as (
        SELECT DISTINCT departure_station_name as station_name FROM data
        UNION
        SELECT DISTINCT return_station_name as station_name FROM data
    )
    SELECT ROW_NUMBER() OVER(ORDER BY station_name) as id, station_name FROM cte LIMIT 50 OFFSET ${offsetValue}`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getTop5Return = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `  SELECT return_station_name 
      FROM data
      WHERE departure_station_name = '${station}'
      GROUP BY return_station_name
      ORDER BY COUNT(*) DESC
      LIMIT 5;`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getTop5Depart = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `  SELECT departure_station_name
      FROM data
      WHERE return_station_name = '${station}'
      GROUP BY departure_station_name
      ORDER BY COUNT(*) DESC
      LIMIT 5;`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getTotalJourney = () => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      "SELECT COUNT(*) AS totalRow FROM data;",
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getDetailStartingFromTheStation = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `SELECT departure_station_name, COUNT(*) as count, SUM(covered_distance) as total_distance
      FROM data
      WHERE departure_station_name = '${station}'
      GROUP BY departure_station_name;`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getDetailEndingAtTheStation = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `SELECT return_station_name, COUNT(*) as count, SUM(covered_distance) as total_distance
      FROM data
      WHERE return_station_name = '${station}'
      GROUP BY return_station_name;`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results); // Resolve the Promise if the operation was successful
      }
    );
  });
};

// const addNewJourney= (params:any[])=>{
//   return new Promise((resolve, reject) => {
//     // Create the table named data
//     pool.query(
//       `SELECT return_station_name, COUNT(*) as count, SUM(covered_distance) as total_distance
//       FROM data
//       WHERE return_station_name = '${station}'
//       GROUP BY return_station_name;`,
//       (error: any, results: any) => {
//         if (error) {
//           reject(error); // Reject the Promise if there was an error
//           return;
//         }
//         resolve(results); // Resolve the Promise if the operation was successful
//       }
//     );
//   });
// }

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
          res.status(400).send("Imported data has been failed");
        }
      } else {
        throw new Error("Missing file in request");
      }
    } catch (err) {
      throw err;
    }
  });
};

const getJourney = async (req: Request, res: Response) => {
  const params = req.query.page ? ([req.query.page] as string[]) : ["1"];

  try {
    const result = await getJourneyList(params);
    res.json(result);
  } catch (err) {
    console.error("get Journey data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTotalRowsOfJourney = async (req: Request, res: Response) => {
  try {
    const result = await getTotalJourney();
    res.json(result);
  } catch (err) {
    console.error("get Total Rows Of Journey data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getStation = async (req: Request, res: Response) => {
  const params = req.query.page ? ([req.query.page] as string[]) : ["1"];

  try {
    const result = await getStationList(params);
    res.json(result);
  } catch (err) {
    console.error("get Station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTop5DepartStationEndingAtStation = async (
  req: Request,
  res: Response
) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
  }
  params = req.query.station as string;

  try {
    const result = await getTop5Depart(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 departure station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTop5ReturnStationStartFromStation = async (
  req: Request,
  res: Response
) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
  }
  params = req.query.station as string;

  try {
    const result = await getTop5Return(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getDetailOfDepartStation = async (req: Request, res: Response) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
  }
  params = req.query.station as string;

  try {
    const result = await getDetailStartingFromTheStation(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getDetailOfReturnStation = async (req: Request, res: Response) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
  }
  params = req.query.station as string;

  try {
    const result = await getDetailEndingAtTheStation(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
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

// Data of the journey
app.get("/api/getJourney", getJourney);
app.get("/api/getTotalJourney", getTotalRowsOfJourney);

// Data of the station
app.get("/api/getStation", getStation);
app.get(
  "/api/getTop5DepartStationEndingAtStation",
  getTop5DepartStationEndingAtStation
);
app.get(
  "/api/getTop5ReturnStationStartFromStation",
  getTop5ReturnStationStartFromStation
);
app.get("/api/getDetailOfDepartStation", getDetailOfDepartStation);
app.get("/api/getDetailOfReturnStation", getDetailOfReturnStation);

const PORT = 7000 || process.env.PORT;
app.listen(PORT, () => {
  console.log("==============================");
  console.log("Server listening on port ", PORT);
  console.log("==============================");
});
