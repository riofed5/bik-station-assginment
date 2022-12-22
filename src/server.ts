import express from "express";
import * as fs from "fs";
import csv from "csv-parser";
import { Connection, createConnection } from "mysql2";

const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// Create a new connection to the MySQL database
// const connection: Connection = createConnection({
//   host: 'localhost',
//   user: 'your_username',
//   password: 'your_password',
//   database: 'your_database',
// });

// Open the .csv file and create a new csv parser instance
const fileStream = fs.createReadStream(`${__dirname}/data.csv`);
const csvParser = csv({
  headers: true,
});

// Store the records in an array
const records: any[] = [];
csvParser.on("data", (row: any) => {
  console.log(row);

  records.push(row);
});

// Insert the records into the database using a bulk insert method
csvParser.on("end", () => {
  const placeholders = records.map(() => "(?, ?)").join(",");
  const values = records.reduce(
    (acc: any[], row: any) => acc.concat([row.column1, row.column2]),
    []
  );
  console.log("placeholder::", placeholders);

  // const query = `INSERT INTO table_name (column1, column2) VALUES ${placeholders}`;
  // connection.query(query, values, (err: any, res: any) => {
  //   if (err) {
  //     console.error(err.stack);
  //   } else {
  //     console.log(res.affectedRows);
  //   }
  // });
  console.log("Finished parsing CSV file");
});

// Start the parsing process
fileStream.pipe(csvParser);
