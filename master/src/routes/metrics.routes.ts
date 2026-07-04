import { Router } from "express";
import {
  getWorkerMetrics,
  getClusterMetrics,
} from "../controllers/metrics.controller.js";

const router = Router();

router.get("/worker/:id", getWorkerMetrics);
router.get("/cluster", getClusterMetrics);

export default router;
