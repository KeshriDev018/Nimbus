class MetricsStore {
  private metrics: Map<string, any[]> = new Map();

  add(workerId: string, data: any) {
    if (!this.metrics.has(workerId)) {
      this.metrics.set(workerId, []);
    }

    this.metrics.get(workerId)!.push({
      ...data,
      timestamp: new Date(),
    });
  }

  get(workerId: string) {
    return this.metrics.get(workerId) || [];
  }

  getAll() {
    return Object.fromEntries(this.metrics);
  }
}

export default new MetricsStore();
