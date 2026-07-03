import axios from "axios";
import { config } from "../config/env.js";
import { getSystemInfo } from "../utils/system.util.js";

export async function registerWorker() {
  
    const system = await getSystemInfo();
    const response = await axios.post(
      `${config.masterUrl}/api/v1/workers/register`,
      {
        workerId: config.workerId,
        hostname: system.hostname,
        ip: system.ip,
        port: config.workerPort,
      },
    );

    console.log("✅ Worker Registered Successfully");
    return response.data;
  
}
