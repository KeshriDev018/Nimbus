import { Request, Response } from "express";
import eventService from "../services/event.service.js";
import { EventModel } from "../models/event.model.js";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find().sort({ timestamp: -1 });

    return res.json({
      success: true,
      events,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
