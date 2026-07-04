import express from "express";
import cors from "cors";
import workerRoutes from "./routes/worker.routes.js";
import deployRoutes from "./routes/deploy.routes.js";





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
 
 
 
});

export default app;
