import express from "express";
import cors from "cors";
import workerRoutes from "./routes/worker.routes.js";
import deployRoutes from "./routes/deploy.routes.js";
import eventRoutes from "./routes/event.routes.js"
import metricsRoutes from "./routes/metrics.routes.js"
import logRoutes from "./routes/log.routes.js"





const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Nimbus Master Server is healthy",
  });

 app.use("/api/deployments", deployRoutes);
 app.use("/api/v1/workers", workerRoutes);
 app.use("/api/events", eventRoutes);
 app.use("/api/metrics", metricsRoutes);
 app.use("/api/logs", logRoutes);
 
 
 
});

export default app;
