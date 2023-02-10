import pool from "../config/db";

const createDatabase = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "CREATE DATABASE IF NOT EXISTS solita",
      (error: any, result: any) => {
        if (error) {
          reject(error); // Reject the Promise if there was an error
          return;
        }
        resolve(false);
      }
    );
  });
};

export { createDatabase };
