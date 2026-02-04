import { Router } from "express";
import multer from "multer";
import { createSchedule, getCalendarSchedules, updateSchedule, deleteSchedule, getAllSchedules, getInstructors, getRooms } from "./schedule.controller";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf' ||
        file.mimetype.includes('document') ||
        file.mimetype.includes('spreadsheet')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Schedule CRUD routes
router.post("/", upload.single('attachment'), createSchedule);
router.get("/", getAllSchedules);
router.get("/calendar", getCalendarSchedules);
router.put("/:id", upload.single('attachment'), updateSchedule);
router.delete("/:id", deleteSchedule);

// Helper routes for dropdowns
router.get("/instructors", getInstructors);
router.get("/rooms", getRooms);

export default router;