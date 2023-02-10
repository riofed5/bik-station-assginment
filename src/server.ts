import express, { Request, Response, Application } from "express";
import cors from "cors";
import { router as journeyRouter } from "./routes/journey";
import { router as stationRouter } from "./routes/station";
import { initializeSchemaAndTables } from "./controllers/database";

const app: Application = express();

app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Welcome to the server" });
});

// Endpoint for Station
app.use("/api", journeyRouter);

// Endpoint for Journey
app.use("/api", stationRouter);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  initializeSchemaAndTables();
  console.log("==============================");
  console.log("Server listening on port ", PORT);
  console.log("==============================");
});

export default app;
