import axios from "axios";
import schedulerService from "./scheduler.service.js";
import workerService from "./worker.service.js";

class DeploymentService {
  async deploy(image: string, name: string) {
    const rankedWorkers = schedulerService.getRankedWorkers();

    let lastError: any;

    for (const entry of rankedWorkers) {
      const worker = entry.worker;

      try {
        const response = await axios.post(
          `http://${worker.ip}:${worker.port}/api/docker/deploy`,
          { image, name },
        );

        return {
          workerId: worker.workerId,
          score: entry.score,
          container: response.data,
        };
      } catch (err) {
        lastError = err;
        workerService.markFailure(worker.workerId);
      }
    }

    throw new Error("All workers failed: " + lastError?.message);
  }
}

export default new DeploymentService();
