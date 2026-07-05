import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema(
  {
    workerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    hostname: { type: String, required: true },
    ip: { type: String, required: true },
    port: { type: Number, required: true },

    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE"],
      default: "ONLINE",
      index: true,
    },

    lastHeartbeat: {
      type: Date,
      required: true,
      default: Date.now,
    },

    cpuUsage: { type: Number, default: 0 },
    memoryUsage: { type: Number, default: 0 },

    failureCount: { type: Number, default: 0 },

    uptime: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const WorkerModel = mongoose.model("Worker", WorkerSchema);
