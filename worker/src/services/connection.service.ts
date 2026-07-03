// Responsibility of Connection Service. It has only one job.
//Connect Master. If successful-> return true.  If failed -> Retry Forever

import { registerWorker } from "./register.service.js";

export async function connectToMaster() {
  while (true) {
    try {
      await registerWorker();

      console.log("✅ Connected To Master");

      break;
    } catch {
      console.log("❌ Master unavailable. Retrying in 5 seconds...");

      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}