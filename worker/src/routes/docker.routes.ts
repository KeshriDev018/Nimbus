import { Router } from "express";
import {
  deployContainer,
  stopContainer,
  restartContainer,
  removeContainer,
  listContainers,
  inspectContainer,
} from "../controllers/docker.controller.js";

const router = Router();

router.post("/deploy", deployContainer);

router.post("/stop/:id", stopContainer);

router.post("/restart/:id", restartContainer);

router.delete("/:id", removeContainer);

router.get("/", listContainers);

router.get("/:id", inspectContainer);

export default router;
