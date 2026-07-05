import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "WORKER_REGISTERED",
        "WORKER_OFFLINE",
        "DEPLOYMENT_STARTED",
        "DEPLOYMENT_FAILED",
        "CONTAINER_STARTED",
        "CONTAINER_STOPPED",
      ],
    },

    workerId: { type: String, default: null },
    deploymentId: { type: String, default: null },

    message: { type: String, required: true },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

export const EventModel = mongoose.model("Event", EventSchema);
