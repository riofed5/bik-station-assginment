import express, { Request, Response } from "express";
import cors from "cors";
import { router as journeyRouter } from "./routes/journey";
import { router as stationRouter } from "./routes/station";

const app = express();

app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

// Endpoint for Station
app.use("/api", journeyRouter);

// Endpoint for Journey
app.use("/api", stationRouter);

const PORT = 7000 || process.env.PORT;

app.listen(PORT, () => {
  console.log("==============================");
  console.log("Server listening on port ", PORT);
  console.log("==============================");
});
