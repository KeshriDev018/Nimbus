export type EventType =
  | "WORKER_REGISTERED"
  | "WORKER_OFFLINE"
  | "DEPLOYMENT_STARTED"
  | "DEPLOYMENT_FAILED"
  | "CONTAINER_STARTED"
  | "CONTAINER_STOPPED";

export interface ClusterEvent {
  id: string;
  type: EventType;
  workerId?: string;
  deploymentId?: string;
  message: string;
  timestamp: Date;
}
