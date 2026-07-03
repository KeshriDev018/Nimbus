import { config } from "./config/env.js";
import { registerWorker } from "./services/register.service.js";
import { startHeartbeat } from "./services/heartbeat.service.js";
import { connectToMaster } from "./services/connection.service.js";



export async function initializeWorker() {
  console.log("================================");

  console.log("🚀 Nimbus Worker Started");

  console.log(`Worker ID : ${config.workerId}`);

  console.log(`Port      : ${config.workerPort}`);

  console.log(`Master    : ${config.masterUrl}`);

  console.log("================================");

  await connectToMaster();
  startHeartbeat();
}

// What we learned

// This sprint introduced several real distributed-system concepts:

// Retry loops instead of giving up after one failure.
// Separation of responsibilities: registerWorker() only performs registration, while connectToMaster() decides what to do if registration fails.
// Resilience: the Worker can survive temporary Master outages without being restarted.