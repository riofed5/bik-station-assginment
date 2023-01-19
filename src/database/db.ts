// const mysql = require("mysql2");
import * as mysql from "mysql2";
require("dotenv").config();

// Replace with your MySQL connection details
const pool = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

export default pool;
