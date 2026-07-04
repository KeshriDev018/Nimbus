import deploymentStore from "./deployment.store.js";
import schedulerService from "./scheduler.service.js";
import axios from "axios";

class RecoveryService {
  async recoverWorkerFailure(workerId: string) {
    const failedDeployments =
      deploymentStore.getFailedDeploymentsByWorker(workerId);

    if (failedDeployments.length === 0) return;

    console.log(`♻️ Recovering ${failedDeployments.length} deployments...`);

    for (const dep of failedDeployments) {
      try {
        const newWorker = schedulerService.pickBestWorker();

        const response = await axios.post(
          `http://${newWorker.ip}:${newWorker.port}/api/docker/deploy`,
          {
            image: dep.image,
            name: dep.name,
          },
        );

        // update deployment
        dep.workerId = newWorker.workerId;
        dep.containerId = response.data.data.containerId;
        dep.status = "RUNNING";

        console.log(`✅ Recovered deployment ${dep.deploymentId}`);
      } catch (err) {
        console.log(`❌ Recovery failed for ${dep.deploymentId}`);
      }
    }
  }
}

export default new RecoveryService();
