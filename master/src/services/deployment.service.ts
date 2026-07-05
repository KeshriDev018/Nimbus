import axios from "axios";
import schedulerService from "./scheduler.service.js";
import workerService from "./worker.service.js";
import { v4 as uuidv4 } from "uuid";
import eventService from "./event.service.js";
import { DeploymentModel } from "../models/deployment.model.js";

export enum DeploymentStatus {
  RUNNING = "RUNNING",
  FAILED = "FAILED",
  STOPPED = "STOPPED",
}

class DeploymentService {
  async deploy(image: string, name: string) {
    const rankedWorkers = await schedulerService.getRankedWorkers();

    let lastError: any;

    for (const entry of rankedWorkers) {
      const worker = entry.worker;

      try {
        const response = await axios.post(
          `http://${worker.ip}:${worker.port}/api/docker/deploy`,
          { image, name },
        );

        const deploymentId = uuidv4();

        const deployment = await DeploymentModel.create({
          deploymentId,
          workerId: worker.workerId,
          containerId: response.data.data.containerId,
          image,
          name,
          status: DeploymentStatus.RUNNING,
          createdAt: new Date(),
        });

        eventService.emit(
          "DEPLOYMENT_STARTED",
          `Deploying ${image} on worker ${worker.workerId}`,
          { deploymentId, image },
        );

        return {
          success: true,
          deployment,
        };
      } catch (err) {
        lastError = err;

        await workerService.markFailure(worker.workerId);

        eventService.emit(
          "DEPLOYMENT_FAILED",
          `Deployment failed for ${image} on ${worker.workerId}`,
          { deploymentId: null },
        );
      }
    }

    throw new Error("All workers failed: " + lastError?.message);
  }
}

export default new DeploymentService();
