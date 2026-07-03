
import express from "express";
import cors from "cors";
import { dockerService } from "./services/docker.service.js";

import { config } from "./config/env.js";
import { registerWorker } from "./services/register.service.js";
import { startHeartbeat } from "./services/heartbeat.service.js";
import { connectToMaster } from "./services/connection.service.js";
import dockerRoutes from "./routes/docker.routes.js";



export async function initializeWorker() {
  console.log("================================");

  console.log("🚀 Nimbus Worker Started");

  console.log(`Worker ID : ${config.workerId}`);

  console.log(`Port      : ${config.workerPort}`);

  console.log(`Master    : ${config.masterUrl}`);

  console.log("================================");

  await connectToMaster();
  startHeartbeat();
}

const app = express();

app.use(cors());
app.use(express.json());


app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});


app.use("/api/docker", dockerRoutes);

export default app;














