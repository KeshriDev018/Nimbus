import { Router } from "express";
import { deploy } from "../controllers/deploy.controller.js";
import { getDeployments } from "../controllers/deploy.controller.js";

const router = Router();

router.post("/", deploy);
router.get("/", getDeployments);

export default router;
