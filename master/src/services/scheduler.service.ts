// We compute score per worker:

// Formula:
// score =
//   (100 - cpuUsage) * 0.4 +
//   (100 - memoryUsage) * 0.4 + healthBonus + stabilityBonus

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

  getRankedWorkers() {
    const workers = workerService.getAllWorkers();

    const online = workers.filter((w) => w.status === "ONLINE");

    return online
      .map((worker) => ({
        worker,
        score: this.calculateScore(worker),
      }))
      .sort((a, b) => b.score - a.score); // 🔥 highest first
  }

  pickBestWorker() {
    const ranked = this.getRankedWorkers();

    if (ranked.length === 0) {
      throw new Error("No available workers");
    }

    return ranked[0].worker;
  }
}

export default new SchedulerService();

// Factor	Why it matters
// CPU	->avoid overload
// Memory	->avoid OOM
// Health	->avoid dead nodes
// Stability	->avoid flaky workers
// Freshness	->avoid stale nodes