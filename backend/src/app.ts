import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
import { sendSuccess } from "./utils/apiResponse";

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

// Global error handler (must be last)
app.use(errorHandler);

export default app;