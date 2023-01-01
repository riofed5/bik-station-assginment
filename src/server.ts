const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const connection = require("./database/db");

const filterRow = (row: any) => {
  return (
    parseInt(row["Covered distance (m)"]) > 10 &&
    parseInt(row["Duration (sec.)"]) > 10
  );
};

const records: any[] = [];
const notRecords: any[] = [];

// Read the .csv file
fs.createReadStream(__dirname + "/data2.csv")
  .pipe(csv())
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
  });

const app = express();

app.listen(3000, () => {
  console.log("==============================");
  console.log("Server listening on port 3000");
  console.log("==============================");
});
