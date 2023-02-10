import * as mysql from "mysql2";
require("dotenv").config();

// Replace with your MySQL connection details
const pool = mysql.createConnection({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "thieulamtu",
});

export default pool;
