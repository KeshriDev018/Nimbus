import workerService from "./worker.service.js";

class SchedulerService {
  private calculateScore(worker: any): number {
    const cpuScore = (100 - worker.cpuUsage) * 0.4;
    const memoryScore = (100 - worker.memoryUsage) * 0.4;

    const healthBonus = worker.status === "ONLINE" ? 20 : -100;

    const stabilityBonus = worker.failureCount ? -worker.failureCount * 5 : 10;

    const freshnessBonus =
      Date.now() - new Date(worker.lastHeartbeat).getTime() < 10000 ? 10 : -20;

    return (
      cpuScore + memoryScore + healthBonus + stabilityBonus + freshnessBonus
    );
  }

  // 🟢 FIXED → NOW ASYNC
  async getRankedWorkers() {
    const workers = await workerService.getAllWorkers();

    const online = workers.filter((w: any) => w.status === "ONLINE");

    return online
      .map((worker: any) => ({
        worker,
        score: this.calculateScore(worker),
      }))
      .sort((a, b) => b.score - a.score);
  }

  // 🟢 FIXED → NOW ASYNC
  async pickBestWorker() {
    const ranked = await this.getRankedWorkers();

    if (ranked.length === 0) {
      throw new Error("No available workers");
    }

    return ranked[0].worker;
  }
}

export default new SchedulerService();
