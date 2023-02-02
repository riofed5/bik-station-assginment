import pool from "../database/db";

const batchSize = 100000;

const getAddressOfStation = (station: string) => {
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `select * from station where Nimi='${station}'`,
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

const insertStationToDb = (records: any[]) => {
  return new Promise((resolve, reject) => {
    // Create the table name station
    pool.query(
      `
        CREATE TABLE IF NOT EXISTS station (
          FID INT PRIMARY KEY,
          ID INT,
          Nimi VARCHAR(255),
          Namn VARCHAR(255),
          Name VARCHAR(255),
          Osoite VARCHAR(255),
          Adress VARCHAR(255),
          Kaupunki VARCHAR(255),
          Stad VARCHAR(255),
          Operaattor VARCHAR(255),
          Kapasiteet INT,
          x FLOAT,
          y FLOAT
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
            "INSERT INTO station (FID, ID, Nimi, Namn, Name, Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, x, y) VALUES ?",
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

const getStationList = (params: string[]) => {
  const page = parseInt(params[0]);
  const limit = 50;

  const offsetValue = (page - 1) * limit;
  return new Promise((resolve, reject) => {
    // Create the table named data
    pool.query(
      `select * from station LIMIT 50 OFFSET ${offsetValue}`,
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
        FROM journey
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
        FROM journey
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
      "SELECT COUNT(*) AS totalRow FROM station",
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
        FROM journey
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
        FROM journey
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
      `select * from station where Nimi like '%${keyword}%' LIMIT 50`,
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
};
