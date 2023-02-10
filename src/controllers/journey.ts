import { readDataJourney, upload } from "./helper";
import multer from "multer";
import { Request, Response } from "express";
import path from "path";
import { isProd } from "../utility/utility";
import {
  getJourneyByKeywords,
  getJourneyList,
  getTotalJourney,
  insertJourneyToDb,
} from "../models/journey";

// Journey array data

const uploadJourney = (req: Request, res: Response) => {
  const validJourneyArr: any[] = [];

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    try {
      if (req.file) {
        const pathOfFile = isProd()
          ? req.file?.path
          : path.join(__dirname, `../../${req.file?.path}`);

        // validate data
        const validateJourney = await readDataJourney(
          pathOfFile,
          validJourneyArr
        );
        if (validateJourney) {
          console.log("Sucessfully validate journey data");

          // Insert read data to database
          const insertJourney = await insertJourneyToDb(validJourneyArr);

          if (insertJourney) {
            console.log("Sucessfully inserting journey data");
            res.status(200).send({ message: "Sucessfully!" });
          }
        }
      } else {
        console.log(new Error("Missing file in request"));
      }
    } catch (err) {
      console.log("Upload file Journey failed: ", err);
      res.status(400).send("Imported data has been failed");
    }
  });
};

const getJourney = async (req: Request, res: Response) => {
  const params = req.query.page ? ([req.query.page] as string[]) : ["1"];

  try {
    const result = await getJourneyList(params);
    res.json(result);
  } catch (err) {
    console.error("get Journey data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTotalRowsOfJourney = async (req: Request, res: Response) => {
  try {
    const result = await getTotalJourney();
    res.json(result);
  } catch (err) {
    console.error("get Total Rows Of Journey data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const searchJourneyByKeywords = async (req: Request, res: Response) => {
  if (!req.query.searchKey) {
    res.status(400).send("Missing SearchKeyword in query");
    return;
  }

  const params = (req.query.searchKey as string).split(" ");

  try {
    const result = await getJourneyByKeywords(params);
    res.json(result);
  } catch (err) {
    console.error("Search Journey data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const downloadFileJourney = (req: Request, res: Response) => {
  if (!req.query.fileName) {
    res.status(400).send("Missing file name in query");
    return;
  }
  const fileName = req.query.fileName;

  res.sendFile(path.join(__dirname, `../download/${fileName}`));
};

export {
  searchJourneyByKeywords,
  getTotalRowsOfJourney,
  getJourney,
  uploadJourney,
  downloadFileJourney,
};
