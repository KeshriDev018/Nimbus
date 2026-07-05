import mongoose from "mongoose";

const MetricsSchema = new mongoose.Schema({
  workerId: { type: String, required: true },
  cpu: Number,
  memory: Number,
  timestamp: { type: Date, default: Date.now },
});

export const MetricsModel = mongoose.model("Metrics", MetricsSchema);
