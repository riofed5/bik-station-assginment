import { checkStationTableExist, createStationTable } from "../models/station";
import { createDatabase } from "../models/database";
import { checkJourneyTableExist, createJourneyTable } from "../models/journey";

const initializeSchemaAndTables = async () => {
  // Create Schema Solita
  createDatabase();

  // Create table Journey
  const isTableJourneyExisted = await checkJourneyTableExist();

  if (!isTableJourneyExisted) {
    createJourneyTable();
  }

  const isTableStationExisted = await checkStationTableExist();
  if (!isTableStationExisted) {
    createStationTable();
  }
};

export { initializeSchemaAndTables };
