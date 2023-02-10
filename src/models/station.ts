import pool from "../config/db";

const batchSize = 100000;

const getAddressOfStation = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `select * from solita.station where Nimi='${station}'`,
      (error: any, results: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(results[0]); // Resolve the Promise if the operation was successful
      }
    );
  });
};

const checkStationTableExist = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_NAME = 'station';`,
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

const createStationTable = () => {
  // Create the table name `station`
  const listOfQuery = [
    `CREATE TABLE IF NOT EXISTS solita.station (
      FID INT PRIMARY KEY,
      ID INT,
      Nimi VARCHAR(255),
      Address VARCHAR(255),
      x FLOAT,
      y FLOAT
    );`,
    "ALTER TABLE solita.journey ADD UNIQUE INDEX (FID, ID, Nimi, Address,x,y);",
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

const insertStationToDb = (records: any[]) => {
  return new Promise((resolve, reject) => {
    const values = records.map((row) => Object.values(row));

    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);

      // Insert the data into the table using the bulk method
      pool.query(
        "INSERT IGNORE INTO solita.station (FID, ID, Nimi, Address, x, y) VALUES ?",
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

const getStationList = (params: string[]) => {
  const page = parseInt(params[0]);
  const limit = 50;

  const offsetValue = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `select * from solita.station LIMIT 50 OFFSET ${offsetValue}`,
      (error: any, results: any) => {
        if (error) {
          if (error.code === "ER_NO_SUCH_TABLE") {
            resolve([]);
            return;
          }
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
        FROM solita.journey
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
        FROM solita.journey
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

const getTotalStation = () => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      "SELECT COUNT(*) AS totalRow FROM solita.station",
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

const getDetailStartingFromTheStation = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `SELECT departure_station_name, COUNT(*) as count, SUM(covered_distance) as total_distance
        FROM solita.journey
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
        FROM solita.journey
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

const getStationByName = (keyword: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `select * from solita.station where Nimi like '%${keyword}%' LIMIT 50`,
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

export {
  insertStationToDb,
  getStationList,
  getTop5Depart,
  getTop5Return,
  getDetailStartingFromTheStation,
  getDetailEndingAtTheStation,
  getTotalStation,
  getAddressOfStation,
  getStationByName,
  checkStationTableExist,
  createStationTable,
};
