# Class Presentation Application

A full-stack TypeScript application for managing class presentations with real-time features.

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite for fast development
- Modern ES modules

**Backend:**
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- CORS enabled for cross-origin requests

**DevOps:**
- Docker & Docker Compose
- Concurrent development servers
- Hot reload for both frontend and backend

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or use Docker)

### Installation
```bash
npm run install:all
```

### Development
```bash
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3001) simultaneously.

### Docker Development
```bash
docker-compose up
```

## Project Structure
```
classpresentation/
├── frontend/          # React TypeScript app
├── backend/           # Express TypeScript API
├── docker-compose.yml # Multi-service setup
└── package.json       # Root scripts
```

## API Endpoints
- `GET /api/health` - Health check

## Environment Variables
Backend uses `.env` file:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/classpresentation
NODE_ENV=development
```