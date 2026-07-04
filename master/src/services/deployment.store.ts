import { Deployment } from "../types/deployment.types.js";

class DeploymentStore {
  private deployments = new Map<string, Deployment>();

  add(deployment: Deployment) {
    this.deployments.set(deployment.deploymentId, deployment);
  }

  getAll() {
    return Array.from(this.deployments.values());
  }

  getById(id: string) {
    return this.deployments.get(id);
  }

  updateStatus(id: string, status: Deployment["status"]) {
    const dep = this.deployments.get(id);
    if (dep) {
      dep.status = status;
    }
  }

  markWorkerDown(workerId: string) {
    const deployments = Array.from(this.deployments.values());

    deployments.forEach((dep) => {
      if (dep.workerId === workerId) {
        dep.status = "FAILED";
      }
    });
  }

  getFailedDeploymentsByWorker(workerId: string) {
    return Array.from(this.deployments.values()).filter(
      (dep) => dep.workerId === workerId && dep.status === "FAILED",
    );
  }
}

export default new DeploymentStore();
