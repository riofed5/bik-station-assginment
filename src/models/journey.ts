import pool from "../database/db";

const batchSize = 100000;

const checkJourneyTableExist = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = 'journey';`,
      (error: any, result: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        if (result.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

const createJourneyTable = () => {
  // Create the table name `journey`
  // Create unique index to avoid duplicated rows
  // Set index for retrieve data faster for columns return_station_name, departure_station_name, covered_distance
  const listOfQuery = [
    `CREATE TABLE IF NOT EXISTS journey (
      id INT PRIMARY KEY AUTO_INCREMENT,
      departure_time DATETIME,
      return_time DATETIME,
      departure_station_id INT,
      departure_station_name VARCHAR(255),
      return_station_id INT,
      return_station_name VARCHAR(255),
      covered_distance INT,
      duration INT
    );`,
    "ALTER TABLE journey ADD UNIQUE INDEX (departure_time, return_time, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration);",
    "CREATE INDEX return_station_name_index ON journey (return_station_name);",
    "CREATE INDEX departure_station_name_index ON journey (departure_station_name);",
    "CREATE INDEX covered_distance_index ON journey (covered_distance);",
  ];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < listOfQuery.length; i++) {
      pool.query(listOfQuery[i], (error: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
      });
    }

    resolve(true); // Resolve the Promise if the operation was successful
  });
};

const insertJourneyToDb = (records: any[]) => {
  // Return a Promise that resolves if the operation was successful, or rejects if there was an error
  return new Promise(async (resolve, reject) => {
    const isTableJourneyExisted = await checkJourneyTableExist();

    if (!isTableJourneyExisted) {
      createJourneyTable();
    }

    const values = records.map((row) => Object.values(row));

    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);

      // Insert the data into the table using the bulk method,
      pool.query(
        // avoid duplicated rows by INSERT IGNORE keyword
        "INSERT IGNORE INTO journey (departure_time, return_time, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration) VALUES ?",
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
      `SELECT id, departure_station_name, return_station_name, covered_distance, duration FROM journey WHERE id >=${from} and id <=${to}`,
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
      "SELECT COUNT(*) AS totalRow FROM journey;",
      (error: any, result: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(result[0]); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const getJourneyByKeywords = (keywords: string[]) => {
  let subQuery = "WHERE ";
  let condition = "";
  for (let i = 0; i < keywords.length; i++) {
    condition += `( departure_station_name like '%${keywords[i]}%' or return_station_name like '%${keywords[i]}%' or covered_distance like '%${keywords[i]}%' )`;
    if (i !== keywords.length - 1) {
      condition += " AND ";
    }
  }

  subQuery += condition;

  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `SELECT departure_station_name, return_station_name, covered_distance, duration FROM journey ${subQuery} LIMIT 50`,
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

export {
  insertJourneyToDb,
  getJourneyList,
  getTotalJourney,
  getJourneyByKeywords,
};
