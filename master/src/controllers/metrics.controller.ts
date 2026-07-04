import { Request, Response } from "express";
import metricsStore from "../services/metrics.store.js";

export const getWorkerMetrics = (req: Request, res: Response) => {
  const { id } = req.params;

  return res.json({
    success: true,
    workerId: id,
    metrics: metricsStore.get(id as string),
  });
};

export const getClusterMetrics = (req: Request, res: Response) => {
  return res.json({
    success: true,
    metrics: metricsStore.getAll(),
  });
};
