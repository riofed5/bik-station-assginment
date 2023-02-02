import express from "express";
import {
  getAddressStation,
  getDetailOfDepartStation,
  getDetailOfReturnStation,
  getStation,
  getTop5DepartStationEndingAtStation,
  getTop5ReturnStationStartFromStation,
  getTotalRowsOfStation,
  searchStationByName,
  uploadStation,
} from "../controllers/station";

const router = express.Router();

router.post("/uploadStation", uploadStation);

router.get("/getTotalStation", getTotalRowsOfStation);

router.get("/getStation", getStation);
router.get("/getAddressStation", getAddressStation);
router.get("/searchStationByName", searchStationByName);

router.get(
  "/getTop5DepartStationEndingAtStation",
  getTop5DepartStationEndingAtStation
);

router.get(
  "/getTop5ReturnStationStartFromStation",
  getTop5ReturnStationStartFromStation
);
router.get("/getDetailOfDepartStation", getDetailOfDepartStation);
router.get("/getDetailOfReturnStation", getDetailOfReturnStation);

export { router };
