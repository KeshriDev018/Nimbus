import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import workerService from "./services/worker.service.js";

const PORT = process.env.PORT || 5000;
workerService.startHealthCheck();

app.listen(PORT, () => {
  console.log(`🚀 Nimbus Master Server running on port ${PORT}`);
});
