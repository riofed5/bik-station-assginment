import multer from "multer";
import fs from "fs";
import path from "path";
import { write, parse } from "fast-csv";
import { isProd } from "../utility/utility";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "upload";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("file");

const destructJourneyRow = (row: any) => {
  return {
    departure_time: row["Departure"],
    return_time: row["Return"],
    departure_station_id: +row["Departure station id"],
    departure_station: row["Departure station name"],
    return_station_id: +row["Return station id"],
    return_station: row["Return station name"],
    distance: +row["Covered distance (m)"],
    duration: +row["Duration (sec.)"],
  };
};

const journeyValidation = (
  departure_time: string,
  return_time: string,
  departure_station_id: number,
  departure_station: string,
  return_station_id: number,
  return_station: string,
  distance: number,
  duration: number
) => {
  const isDepartureValid = Date.parse(departure_time) !== null;
  const isReturnValid =
    Date.parse(return_time) !== null &&
    Date.parse(return_time) > Date.parse(departure_time);
  const isIdValid = departure_station_id > 0 && return_station_id > 0;
  const isDurationDistanceValid = distance >= 10 && duration >= 10;
  const isStationsValid = departure_station != "" && return_station != "";
  return (
    isDepartureValid &&
    isIdValid &&
    isReturnValid &&
    isDurationDistanceValid &&
    isStationsValid
  );
};

const readDataJourney = (
  pathToSelectedFile: string,
  records: any[],
  notRecords: any[]
) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathToSelectedFile)
      .pipe(parse({ headers: true }))
      .on("data", (row: any) => {
        const {
          departure_time,
          return_time,
          departure_station_id,
          departure_station,
          return_station_id,
          return_station,
          distance,
          duration,
        } = destructJourneyRow(row);

        const isValidRow = journeyValidation(
          departure_time,
          return_time,
          departure_station_id,
          departure_station,
          return_station_id,
          return_station,
          distance,
          duration
        );

        if (isValidRow) {
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

const destructStationRow = (row: any) => {
  return {
    id: +row["ID"],
    name: row["Name"],
    address: row["Adress"],
    x: +row["x"],
    y: +row["y"],
  };
};

const stationValidation = (
  id: number,
  name: string,
  address: string,
  x: number,
  y: number
) => {
  const isLatLongValid = !(21.37 > x || x > 30.94 || 59.83 > y || y > 68.91);
  return (
    Number.isInteger(id) &&
    id > 0 &&
    name != "" &&
    address != "" &&
    isLatLongValid
  );
};

const readDataStation = (pathToSelectedFile: string, records: any[]) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathToSelectedFile)
      .pipe(parse({ headers: true }))
      .on("data", (row: any) => {
        const { id, name, address, x, y } = destructStationRow(row);
        const isValidRow = stationValidation(id, name, address, x, y);
        if (isValidRow) {
          records.push(row);
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

export {
  upload,
  readDataJourney,
  readDataStation,
  stationValidation,
  journeyValidation,
};
