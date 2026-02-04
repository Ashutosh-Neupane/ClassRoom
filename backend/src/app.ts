import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { sendSuccess, sendError } from "./utils/apiResponse";
import { testModels } from "./controllers/test.controller";
import { testRecurrenceEngine } from "./controllers/recurrence.test.controller";
import { testConflictDetection } from "./controllers/conflict.test.controller";
import { debugConflictDetection } from "./controllers/debug.conflict.controller";

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

// Test models route (both GET and POST)
app.get('/api/test-models', testModels);
app.post('/api/test-models', testModels);

// Test recurrence engine
app.get('/api/test-recurrence', testRecurrenceEngine);

// Test conflict detection
app.get('/api/test-conflicts', testConflictDetection);

// Debug conflict detection
app.get('/api/debug-conflicts', debugConflictDetection);

// 404 handler for undefined routes
app.use((req, res, next) => {
  sendError(res, 404, {
    title: "Route Not Found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;