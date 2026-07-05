import { Request, Response } from "express";
import { MetricsModel } from "../models/metrics.model.js";

export const getWorkerMetrics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const metrics = await MetricsModel.find({ workerId: id }).sort({
      timestamp: -1,
    });

    return res.json({
      success: true,
      workerId: id,
      metrics,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getClusterMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await MetricsModel.find().sort({
      timestamp: -1,
    });

    return res.json({
      success: true,
      metrics,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
