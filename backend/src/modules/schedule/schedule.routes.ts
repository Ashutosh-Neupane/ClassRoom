import { Router } from "express";
import { createSchedule } from "./schedule.controller";

const router = Router();

router.post("/", createSchedule);

export default router;