import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { sendSuccess, sendError } from "./utils/apiResponse";
import scheduleRoutes from "./modules/schedule/schedule.routes";

// Test controllers (organized in tests folder)
import { testModels } from "./tests/test.controller";
import { testConflictDetection } from "./tests/conflict.test.controller";
import { testScheduleAPI } from "./tests/schedule.test.controller";
import { testCalendarAPI } from "./tests/calendar.test.controller";

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  sendSuccess(res, 200, {
    title: "Health Check",
    message: "Backend server is running",
    data: { status: "OK", timestamp: new Date().toISOString() }
  });
});

// Schedule API routes (main feature)
app.use('/api/schedules', scheduleRoutes);

// Test routes (development only)
app.get('/api/test-models', testModels);
app.post('/api/test-models', testModels);
app.get('/api/test-conflicts', testConflictDetection);
app.get('/api/test-schedule-api', testScheduleAPI);
app.get('/api/test-calendar', testCalendarAPI);

// 404 handler for undefined routes
app.use((req, res) => {
  sendError(res, 404, {
    title: "Route Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;