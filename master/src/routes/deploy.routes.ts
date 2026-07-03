import { Router } from "express";
import { deploy } from "../controllers/deploy.controller.js";

const router = Router();

router.post("/", deploy);

export default router;
