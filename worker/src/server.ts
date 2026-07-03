import { initializeWorker } from "./app.js";
import app from "./app.js";
import { config } from "./config/env.js";

initializeWorker();

app.listen(config.workerPort, () => {
  console.log(`🚀 Worker running on port ${config.workerPort}`);
});


