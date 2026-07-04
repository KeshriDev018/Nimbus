import { Worker } from "../types/worker.types.js";
import deploymentStore from "./deployment.store.js";
import recoveryService from "./recovery.service.js";

class WorkerService {
  private workers = new Map<string, Worker>();

  registerWorker(worker: Worker): Worker {
    this.workers.set(worker.workerId, worker);
    return worker;
  }

  getAllWorkers(): Worker[] {
    return Array.from(this.workers.values());
  }

  getWorkerById(workerId: string): Worker | undefined {
    return this.workers.get(workerId);
  }

  updateHeartbeat(
    workerId: string,
    cpuUsage: number,
    memoryUsage: number,
  ): Worker | null {
    const worker = this.workers.get(workerId);

    if (!worker) {
      return null;
    }

    worker.cpuUsage = cpuUsage;
    worker.memoryUsage = memoryUsage;
    worker.lastHeartbeat = new Date();
    worker.status = "ONLINE";

    return worker;
  }

  startHealthCheck() {
    setInterval(() => {
      const now = Date.now();

      this.workers.forEach((worker) => {
        const diff = now - new Date(worker.lastHeartbeat).getTime();

        if (diff > 10000) {
          worker.status = "OFFLINE";
        }
      });
    }, 5000);
  }

  getClusterStats() {
    const workers = Array.from(this.workers.values());

    return {
      total: workers.length,

      online: workers.filter((w) => w.status === "ONLINE").length,

      offline: workers.filter((w) => w.status === "OFFLINE").length,
    };
  }

  markFailure(workerId: string) {
    const worker = this.workers.get(workerId);

    if (!worker) return;

    worker.failureCount = (worker.failureCount || 0) + 1;
  }

  markHeartbeat(workerId: string, cpu: number, memory: number) {
    const worker = this.workers.get(workerId);

    if (!worker) return;

    worker.cpuUsage = cpu;
    worker.memoryUsage = memory;
    worker.lastHeartbeat = new Date();
    worker.status = "ONLINE";
  }

  startFailureDetector() {
    setInterval(() => {
      const now = Date.now();

      this.workers.forEach((worker) => {
        const diff = now - new Date(worker.lastHeartbeat).getTime();

        if (diff > 15000) {
          worker.status = "OFFLINE";

          deploymentStore.markWorkerDown(worker.workerId);

          console.log(
            `⚠️ Worker ${worker.workerId} OFFLINE + deployments marked FAILED`,
          );
          recoveryService.recoverWorkerFailure(worker.workerId);
        }
      });
    }, 5000);
  }
//   Check all workers
//    ↓
// No heartbeat for 15 sec?
//    ↓
// Mark OFFLINE
}

export default new WorkerService();
