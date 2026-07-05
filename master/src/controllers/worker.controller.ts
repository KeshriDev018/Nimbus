import { Request, Response } from "express";
import workerService from "../services/worker.service.js";
import { Worker } from "../types/worker.types.js";

export const registerWorker = async (req: Request, res: Response) => {
  try {
    const { workerId, hostname, ip, port } = req.body;

    if (!workerId || !hostname || !ip || !port) {
      return res.status(400).json({
        success: false,
        message: "Invalid Worker Data",
      });
    }

    const worker: Worker = {
      workerId,
      hostname,
      ip,
      port,
      status: "ONLINE",
      cpuUsage: 0,
      memoryUsage: 0,
      lastHeartbeat: new Date(),
    };

    const created = await workerService.registerWorker(worker);

    return res.status(201).json({
      success: true,
      worker: created,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const heartbeat = async (req: Request, res: Response) => {
  try {
    const { workerId, cpuUsage, memoryUsage } = req.body;

    const worker = await workerService.updateHeartbeat(
      workerId,
      cpuUsage,
      memoryUsage,
    );

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
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await workerService.getAllWorkers();

    return res.status(200).json({
      success: true,
      workers,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getClusterStats = async (req: Request, res: Response) => {
  try {
    const stats = await workerService.getClusterStats();

    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
