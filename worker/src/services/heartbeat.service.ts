import axios from "axios";
import { config } from "../config/env.js";
import { getSystemInfo } from "../utils/system.util.js";

export function startHeartbeat() {
  setInterval(async () => {
    try {
        const system = await getSystemInfo();
      await axios.post(
        `${config.masterUrl}/api/v1/workers/heartbeat`,

        {
          workerId: config.workerId,

          cpuUsage: system.cpuUsage,

          memoryUsage: system.memoryUsage,
        },
      );

      console.log("💓 Heartbeat Sent");
    } catch (error) {
      console.log("Heartbeat Failed");
    }
  }, 5000);
}
