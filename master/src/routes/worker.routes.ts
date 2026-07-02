import { Router } from "express";
import {
  registerWorker,
  getWorkers,
  heartbeat,
  getClusterStats
} from "../controllers/worker.controller.js";

const router = Router();

router.post("/register", registerWorker);
router.post("/heartbeat", heartbeat);

router.get("/", getWorkers);
router.get("/stats", getClusterStats);

export default router;
