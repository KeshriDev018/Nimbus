import eventStore from "./event.store.js";
import { v4 as uuidv4 } from "uuid";

class EventService {
  emit(type: any, message: string, meta: any = {}) {
    eventStore.add({
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
      ...meta,
    });
  }
}

export default new EventService();
