import { ClusterEvent } from "../types/event.types.js";

class EventStore {
  private events: ClusterEvent[] = [];

  add(event: ClusterEvent) {
    this.events.push(event);
  }

  getAll() {
    return this.events;
  }
}

export default new EventStore();
