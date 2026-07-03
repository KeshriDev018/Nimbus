export interface Worker {
  workerId: string;
  hostname: string;
  ip: string;
  port: number;

  status: "ONLINE" | "OFFLINE";

  lastHeartbeat: Date;

  cpuUsage: number;
  memoryUsage: number;

  failureCount?: number;
  uptime?: number;
}
