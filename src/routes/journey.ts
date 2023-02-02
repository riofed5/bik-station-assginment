import express from "express";
import {
  downloadFileJourney,
  getJourney,
  getTotalRowsOfJourney,
  searchJourneyByKeywords,
  uploadJourney,
} from "../controllers/journey";

const router = express.Router();

router.post("/uploadJourney", uploadJourney);

router.get("/download", downloadFileJourney);
router.get("/getJourney", getJourney);
router.get("/getTotalJourney", getTotalRowsOfJourney);
router.get("/searchJourneyByKeywords", searchJourneyByKeywords);

export { router };
