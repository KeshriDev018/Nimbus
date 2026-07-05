import { Request, Response } from "express";
import { broadcastLog } from "../realtime/log.ws.js";
import { LogModel } from "../models/log.model.js";

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { containerId } = req.params;

    const logs = await LogModel.find({ containerId }).sort({
      timestamp: 1,
    });

    return res.json({
      success: true,
      containerId,
      logs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const ingestLogs = async (req: Request, res: Response) => {
  try {
    const { containerId, log } = req.body;

    await LogModel.create({
      containerId,
      log,
      timestamp: new Date(),
    });

    // 🔥 REAL-TIME STREAM
    broadcastLog(containerId, log);

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
