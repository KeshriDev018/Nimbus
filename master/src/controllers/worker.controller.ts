import { Request, Response } from "express";
import workerService from "../services/worker.service.js";
import { Worker } from "../types/worker.types.js";

export const registerWorker = (req: Request, res: Response) => {
  if (
    !req.body.workerId ||
    !req.body.hostname ||
    !req.body.ip ||
    !req.body.port
  ) {
    return res.status(400).json({
      success: false,

      message: "Invalid Worker Data",
    });
  }
  const worker: Worker = {
    workerId: req.body.workerId,
    hostname: req.body.hostname,
    ip: req.body.ip,
    port: req.body.port,

    status: "ONLINE",

    cpuUsage: 0,
    memoryUsage: 0,

    lastHeartbeat: new Date(),
  };

  workerService.registerWorker(worker);

  res.status(201).json({
    success: true,
    worker,
  });
};

export const heartbeat = (req: Request, res: Response) => {
  const { workerId, cpuUsage, memoryUsage } = req.body;

  const worker = workerService.updateHeartbeat(workerId, cpuUsage, memoryUsage);

  if (!worker) {
    return res.status(404).json({
      success: false,
      message: "Worker not found",
    });
  }

  return res.json({
    success: true,
    worker,
  });
};

export const getWorkers = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    workers: workerService.getAllWorkers(),
  });
};

export const getClusterStats = (
  req: Request,

  res: Response,
) => {
  res.json(workerService.getClusterStats());
};
