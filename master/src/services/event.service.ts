import { EventModel } from "../models/event.model.js";
import { v4 as uuidv4 } from "uuid";

class EventService {
  async emit(type: string, message: string, meta: any = {}) {
    try {
      await EventModel.create({
        id: uuidv4(),
        type,
        message,
        workerId: meta.workerId || null,
        deploymentId: meta.deploymentId || null,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Event emit failed:", err);
    }
  }

  async getAll() {
    return await EventModel.find().sort({ timestamp: -1 });
  }
}

export default new EventService();
