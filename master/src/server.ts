import dotenv from "dotenv";
import http from "http";
import { connectDB } from "./config/db.js";


dotenv.config();

import app from "./app.js";
import workerService from "./services/worker.service.js";
import { createLogWebSocket } from "./realtime/log.ws.js";

connectDB();

const server = http.createServer(app);
createLogWebSocket(server);

server.listen(5000, () => {
  console.log("Master running with WebSocket");
});


const PORT = process.env.PORT || 5000;
workerService.startHealthCheck();
workerService.startFailureDetector();

app.listen(PORT, () => {
  console.log(`🚀 Nimbus Master Server running on port ${PORT}`);
});
