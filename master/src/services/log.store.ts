class LogStore {
  private logs: Map<string, string[]> = new Map();

  add(containerId: string, log: string) {
    if (!this.logs.has(containerId)) {
      this.logs.set(containerId, []);
    }

    this.logs.get(containerId)!.push(log);
  }

  get(containerId: string) {
    return this.logs.get(containerId) || [];
  }
}

export default new LogStore();
