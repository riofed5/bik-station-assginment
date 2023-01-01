const mysql = require("mysql2");
require("dotenv").config();

// Replace with your MySQL connection details
const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

module.exports = dbConnection;
