import { Router } from "express";
import { getLogs } from "../controllers/log.controller.js";
import { ingestLogs } from "../controllers/log.controller.js";

const router = Router();

router.get("/:containerId", getLogs);
router.post("/ingest", ingestLogs);

export default router;
