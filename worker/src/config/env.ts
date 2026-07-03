import dotenv from "dotenv";

dotenv.config();

export const config = {
  workerId: process.env.WORKER_ID!,

  workerPort: Number(process.env.WORKER_PORT),

  masterUrl: process.env.MASTER_URL!,
};

// centralize the configuration