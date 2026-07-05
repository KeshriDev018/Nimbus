import mongoose from "mongoose";

const DeploymentSchema = new mongoose.Schema(
  {
    deploymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    workerId: {
      type: String,
      required: true,
      index: true,
    },

    containerId: {
      type: String,
      required: true,
      unique: true,
    },

    image: { type: String, required: true },
    name: { type: String, required: true },

    status: {
      type: String,
      enum: ["RUNNING", "FAILED", "STOPPED"],
      default: "RUNNING",
      index: true,
    },
  },
  { timestamps: true },
);

export const DeploymentModel = mongoose.model("Deployment", DeploymentSchema);
