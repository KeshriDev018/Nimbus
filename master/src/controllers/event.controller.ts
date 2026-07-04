import { Request, Response } from "express";
import eventStore from "../services/event.store.js";

export const getEvents = (req: Request, res: Response) => {
  res.json({
    success: true,
    events: eventStore.getAll()
  });
};