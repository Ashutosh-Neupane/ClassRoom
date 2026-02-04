import { Router } from "express";
import { createSchedule, getCalendarSchedules, updateSchedule, deleteSchedule } from "./schedule.controller";

const router = Router();

router.post("/", createSchedule);
router.get("/calendar", getCalendarSchedules);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;