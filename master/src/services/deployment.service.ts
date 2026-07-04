import axios from "axios";
import schedulerService from "./scheduler.service.js";
import workerService from "./worker.service.js";
import { v4 as uuidv4 } from "uuid";
import deploymentStore from "./deployment.store.js";

export enum DeploymentStatus {
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  STOPPED = "STOPPED",
}

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

        const deploymentId = uuidv4();

        const deployment = {
          deploymentId,
          workerId: worker.workerId,
          containerId: response.data.data.containerId,
          image,
          name,
          status: DeploymentStatus.RUNNING,
          createdAt: new Date(),
        };

        deploymentStore.add(deployment);

        return {
          success: true,
          deployment,
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
