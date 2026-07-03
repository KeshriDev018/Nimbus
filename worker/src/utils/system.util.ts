// This file will contain all OS-related code.
import si from "systeminformation";
import os from "os";

export async function getSystemInfo() {
  const load = await si.currentLoad();

  const memory = await si.mem();

  return {
    hostname: os.hostname(),

    ip: getLocalIP(),

    cpuUsage: Number(load.currentLoad.toFixed(2)),

    memoryUsage: Number(
      (((memory.total - memory.available) / memory.total) * 100).toFixed(2),
    ),
  };
}

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();

  for (const name in interfaces) {
    const network = interfaces[name];

    if (!network) continue;

    for (const iface of network) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "127.0.0.1";
}