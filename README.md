# Class Presentation Application

A full-stack TypeScript application for managing class presentations with real-time calendar scheduling and advanced recurring patterns.

## 🚀 Features

### Calendar-Based Class Scheduling
- **Multi-View Calendar**: Daily, Weekly, and Monthly views
- **Advanced Recurring Patterns**: Daily, Weekly, Monthly, and Custom schedules
- **Real-time Event Management**: Create, update, and delete class schedules
- **Instructor & Room Management**: Comprehensive resource allocation
- **Time Slot Management**: Multiple time slots per recurring pattern
- **Conflict Detection**: Automatic scheduling conflict prevention

### Recurring Schedule Patterns
1. **Daily**: Repeat every N days with custom time slots
2. **Weekly**: Select specific days with individual time slots per day
3. **Monthly**: Choose specific dates (1-31) with time slots
4. **Custom**: Pick exact dates with flexible scheduling

### UI/UX Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive calendar interface
- **Real-time Updates**: React Query for efficient data fetching
- **Form Validation**: Comprehensive input validation
- **File Upload Support**: Attachment handling for class materials

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite for fast development
- React Query for state management
- Modern ES modules
- Responsive UI components

**Backend:**
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Advanced RecurrenceEngine for pattern generation
- Zod validation schemas
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

This starts both frontend (http://localhost:5173) and backend (http://localhost:5000) simultaneously.

### Docker Development
```bash
docker-compose up
```

## Project Structure
```
classpresentation/
├── frontend/                    # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   │   ├── schedule/        # Calendar components
│   │   │   │   ├── CalendarGrid.tsx
│   │   │   │   ├── ScheduleClassModal.tsx
│   │   │   │   └── RecurringSettingsModal.tsx
│   │   │   └── ui/              # Reusable UI components
│   │   ├── hooks/               # React Query hooks
│   │   ├── services/            # API service layer
│   │   └── pages/               # Main application pages
├── backend/                     # Express TypeScript API
│   ├── src/
│   │   ├── modules/
│   │   │   └── schedule/        # Schedule management
│   │   │       ├── schedule.model.ts
│   │   │       ├── schedule.service.ts
│   │   │       ├── schedule.controller.ts
│   │   │       ├── schedule.routes.ts
│   │   │       ├── recurrence.engine.ts  # Core recurring logic
│   │   │       └── conflict.engine.ts    # Conflict detection
│   │   ├── middlewares/         # Express middlewares
│   │   └── utils/               # Utility functions
├── docker-compose.yml           # Multi-service setup
└── package.json                 # Root scripts
```

## API Endpoints

### Schedule Management
- `POST /api/schedules` - Create new schedule rule
- `GET /api/schedules` - Get all schedule rules (paginated)
- `GET /api/schedules/:id` - Get single schedule rule
- `PUT /api/schedules/:id` - Update schedule rule
- `DELETE /api/schedules/:id` - Delete schedule rule

### Calendar Views
- `GET /api/schedules/calendar?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get calendar events for date range

### Resources
- `GET /api/schedules/instructors` - Get all instructors
- `GET /api/schedules/rooms` - Get all rooms

### Health Check
- `GET /api/health` - Backend health status

## How to Test the Application

### 1. Start the Application
```bash
npm run dev
```

### 2. Access the Frontend
Open http://localhost:5173 in your browser

### 3. Test Calendar Views
- **Daily View**: Click on any date to see daily events
- **Weekly View**: Default view showing week-based schedule
- **Monthly View**: Switch to see monthly overview

### 4. Create Recurring Schedules
1. Click "Schedule Class" button
2. Fill in class details (title, instructor, room, etc.)
3. Toggle "Recurring" switch
4. Choose recurring pattern:
   - **Daily**: Set time slots for daily repetition
   - **Weekly**: Select days and set time slots per day
   - **Monthly**: Pick dates (1-31) and set time slots
   - **Custom**: Choose specific dates with flexible scheduling

### 5. Test API Endpoints
```bash
# Get calendar events for a specific week
curl "http://localhost:5000/api/schedules/calendar?startDate=2026-02-03&endDate=2026-02-09"

# Get all schedule rules
curl "http://localhost:5000/api/schedules?page=1&limit=10"

# Health check
curl "http://localhost:5000/api/health"
```

### 6. Verify Recurring Logic
- Create a daily recurring class and verify it appears every day
- Create a weekly class for specific days and check weekly view
- Create a monthly class for specific dates and verify monthly view
- Test custom scheduling with specific dates

## Key Technical Achievements

### 1. Advanced RecurrenceEngine
- Generates occurrences for all 4 recurring patterns
- Handles timezone consistency with UTC normalization
- Supports complex scheduling scenarios

### 2. Frontend-Backend Integration
- Type-safe API communication
- React Query for efficient data management
- Real-time calendar updates

### 3. Robust Date Handling
- Fixed timezone issues in date comparisons
- Consistent UTC date processing
- Proper date normalization for calendar views

### 4. Comprehensive Validation
- Zod schemas for backend validation
- Frontend form validation
- Time slot and recurrence rule validation

## Environment Variables

Backend uses `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classpresentation
NODE_ENV=development
```

## Database Seeding

Populate with sample data:
```bash
cd backend && npm run seed
```

This creates:
- 50 instructors with specializations
- 25 diverse rooms with equipment
- 180+ schedule rules with various recurring patterns

## Recent Fixes

### Timezone Issue Resolution
- Fixed daily calendar view showing empty results
- Resolved UTC/local timezone conflicts in RecurrenceEngine
- Ensured consistent date comparison across all calendar views

### API Response Format
- Standardized `{title, message, data}` response format
- Updated frontend to handle proper API responses
- Added comprehensive error handling

## Contributing

1. Create feature branch from main
2. Make changes with proper TypeScript types
3. Test all calendar views and recurring patterns
4. Create pull request with descriptive title
5. Merge to main after review

## License

MIT License - feel free to use this project as a foundation for your own scheduling applications.