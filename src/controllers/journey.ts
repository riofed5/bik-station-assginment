import { upload } from "./helper";
import multer from "multer";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { validateDataJourney, writeDataToFile } from "../utility/utility";
import {
  getJourneyByKeywords,
  getJourneyList,
  getTotalJourney,
  insertJourneyToDb,
} from "../models/journey";

// Journey array data
const validJourneyArr: any[] = [];
const notValidJourneyArr: any[] = [];

const uploadJourney = (req: Request, res: Response) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    try {
      if (req.file) {
        const pathOfFile = path.join(__dirname, `../${req.file?.path}`);

        try {
          // validate data
          const validateResult = await validateDataJourney(
            pathOfFile,
            validJourneyArr,
            notValidJourneyArr
          );
          console.log("validateResult: ", validateResult);
          if (validateResult) {
            // Write not valid data to file
            const writeDataToFileResult = await writeDataToFile(
              notValidJourneyArr
            );

            // Insert read data to database
            const insertDataToDbResult = await insertJourneyToDb(
              validJourneyArr
            );
            console.log("writeDataToFileResult: ", writeDataToFileResult);
            console.log("insertDataToDbResult: ", insertDataToDbResult);

            if (writeDataToFileResult && insertDataToDbResult) {
              fs.access(
                path.join(__dirname, "../download/NotValidData.csv"),
                fs.constants.F_OK,
                (error) => {
                  if (error) {
                    console.log("File does not exist");
                    res.status(200).send({ status: false });
                  } else {
                    console.log("File exists");
                    res
                      .status(200)
                      .send({ status: true, fileName: "NotValidData.csv" });
                  }
                }
              );
            }
          }
        } catch (err) {
          console.log(err);
          res.status(400).send("Imported data has been failed");
        }
      } else {
        console.log(new Error("Missing file in request"));
      }
    } catch (err) {
      console.log("Upload file Journey failed: ", err);
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
  res.sendFile(path.join(__dirname, "../download/NotValidData.csv"));
};

export {
  searchJourneyByKeywords,
  getTotalRowsOfJourney,
  getJourney,
  uploadJourney,
  downloadFileJourney,
};
