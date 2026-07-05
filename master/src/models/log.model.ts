import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  containerId: { type: String, required: true },
  log: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const LogModel = mongoose.model("Log", LogSchema);
