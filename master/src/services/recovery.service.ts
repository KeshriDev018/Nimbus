import schedulerService from "./scheduler.service.js";
import axios from "axios";
import { DeploymentModel } from "../models/deployment.model.js";

class RecoveryService {
  async recoverWorkerFailure(workerId: string) {
    // 🟢 GET FAILED DEPLOYMENTS FROM MONGODB
    const failedDeployments = await DeploymentModel.find({
      workerId,
      status: "FAILED",
    });

    if (failedDeployments.length === 0) return;

    console.log(`♻️ Recovering ${failedDeployments.length} deployments...`);

    for (const dep of failedDeployments) {
      try {
        // 🟢 FIX: scheduler is async now
        const newWorker = await schedulerService.pickBestWorker();

        const response = await axios.post(
          `http://${newWorker.ip}:${newWorker.port}/api/docker/deploy`,
          {
            image: dep.image,
            name: dep.name,
          },
        );

        // 🟢 UPDATE DEPLOYMENT IN DB
        await DeploymentModel.updateOne(
          { deploymentId: dep.deploymentId },
          {
            workerId: newWorker.workerId,
            containerId: response.data.data.containerId,
            status: "RUNNING",
          },
        );

        console.log(`✅ Recovered deployment ${dep.deploymentId}`);
      } catch (err) {
        console.log(`❌ Recovery failed for ${dep.deploymentId}`);
      }
    }
  }
}

export default new RecoveryService();
