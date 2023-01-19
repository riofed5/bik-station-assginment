import fs from "fs";
import path from "path";
import { write, parse } from "fast-csv";

const writeDataToFile = (data: any) => {
  const stream = fs.createWriteStream(
    path.join(__dirname, "../../download/NotValidData.csv")
  );

  write(data, { headers: true }).pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on("finish", () => {
      resolve(true);
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

const filterRow = (row: any) => {
  return (
    parseInt(row["Covered distance (m)"]) >= 10 &&
    parseInt(row["Duration (sec.)"]) >= 10
  );
};

const validateData = (
  pathToSelectedFile: string,
  records: any[],
  notRecords: any[]
) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathToSelectedFile)
      .pipe(parse({ headers: true }))
      .on("data", (row: any) => {
        const validRow = filterRow(row);
        if (validRow) {
          records.push(row);
        } else {
          notRecords.push(row);
        }
      })
      .on("end", () => {
        resolve(true);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export { validateData, writeDataToFile };
