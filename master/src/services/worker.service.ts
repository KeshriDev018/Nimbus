import { WorkerModel } from "../models/worker.model.js";
import recoveryService from "./recovery.service.js";
import eventService from "./event.service.js";
import { DeploymentModel } from "../models/deployment.model.js";
import { MetricsModel } from "../models/metrics.model.js";

class WorkerService {
  // 🟢 REGISTER WORKER
  async registerWorker(worker: any) {
    const created = await WorkerModel.create({
      ...worker,
      status: "ONLINE",
      lastHeartbeat: new Date(),
      cpuUsage: 0,
      memoryUsage: 0,
      failureCount: 0,
    });

    eventService.emit(
      "WORKER_REGISTERED",
      `Worker ${worker.workerId} registered`,
      { workerId: worker.workerId },
    );

    return created;
  }

  // 🟢 GET ALL WORKERS
  async getAllWorkers() {
    return await WorkerModel.find();
  }

  // 🟢 GET SINGLE WORKER
  async getWorkerById(workerId: string) {
    return await WorkerModel.findOne({ workerId });
  }

  // 🟢 HEARTBEAT UPDATE
  async updateHeartbeat(workerId: string, cpu: number, memory: number) {
    const worker = await WorkerModel.findOneAndUpdate(
      { workerId },
      {
        cpuUsage: cpu,
        memoryUsage: memory,
        lastHeartbeat: new Date(),
        status: "ONLINE",
      },
      { new: true },
    );

    await MetricsModel.create({
      workerId,
      cpu,
      memory,
      timestamp: new Date(),
    });

    return worker;
  }

  // 🟢 MARK FAILURE
  async markFailure(workerId: string) {
    return await WorkerModel.findOneAndUpdate(
      { workerId },
      { $inc: { failureCount: 1 } },
      { new: true },
    );
  }

  // 🟢 HEARTBEAT WRAPPER
  markHeartbeat(workerId: string, cpu: number, memory: number) {
    this.updateHeartbeat(workerId, cpu, memory);
  }

  // 🟢 FAILURE DETECTOR (MAIN LOGIC)
  startFailureDetector() {
    setInterval(async () => {
      const workers = await WorkerModel.find();
      const now = Date.now();

      for (const worker of workers) {
        const diff = now - new Date(worker.lastHeartbeat).getTime();

        if (diff > 15000 && worker.status !== "OFFLINE") {
          // 1. mark worker offline
          await WorkerModel.updateOne(
            { workerId: worker.workerId },
            { status: "OFFLINE" },
          );

          // 2. emit event
          eventService.emit(
            "WORKER_OFFLINE",
            `Worker ${worker.workerId} marked OFFLINE`,
            { workerId: worker.workerId },
          );

          // 3. mark deployments failed (IMPORTANT FIX)
          await DeploymentModel.updateMany(
            { workerId: worker.workerId },
            { status: "FAILED" },
          );

          // 4. trigger recovery
          recoveryService.recoverWorkerFailure(worker.workerId);
        }
      }
    }, 5000);
  }

  // 🟢 CLUSTER STATS
  async getClusterStats() {
    const workers = await WorkerModel.find();

    return {
      total: workers.length,
      online: workers.filter((w) => w.status === "ONLINE").length,
      offline: workers.filter((w) => w.status === "OFFLINE").length,
    };
  }

  // 🟢 LIGHT HEALTH CHECK
  startHealthCheck() {
    setInterval(async () => {
      const workers = await WorkerModel.find();
      const now = Date.now();

      for (const worker of workers) {
        const diff = now - new Date(worker.lastHeartbeat).getTime();

        if (diff > 10000 && worker.status !== "OFFLINE") {
          await WorkerModel.updateOne(
            { workerId: worker.workerId },
            { status: "OFFLINE" },
          );
        }
      }
    }, 5000);
  }
}

export default new WorkerService();
