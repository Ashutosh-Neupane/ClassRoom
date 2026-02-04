import { Router } from "express";
import { createSchedule, getCalendarSchedules } from "./schedule.controller";

const router = Router();

router.post("/", createSchedule);
router.get("/calendar", getCalendarSchedules);

export default router;