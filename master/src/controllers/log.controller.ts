import { Request, Response } from "express";
import logStore from "../services/log.store.js";

import { broadcastLog } from "../realtime/log.ws.js";




export const getLogs = (req: Request, res: Response) => {
  const { containerId } = req.params;

  return res.json({
    success: true,
    containerId,
    logs: logStore.get(containerId as string),
  });
};

export const ingestLogs = (req:Request, res:Response) => {
  const { containerId, log } = req.body;

  logStore.add(containerId, log);

  // 🔥 REAL-TIME STREAM
  broadcastLog(containerId, log);

  return res.json({ success: true });
};
