export interface Deployment {
  deploymentId: string;
  workerId: string;
  containerId: string;

  image: string;
  name: string;

  status: "RUNNING" | "FAILED" | "STOPPED";

  createdAt: Date;
}
