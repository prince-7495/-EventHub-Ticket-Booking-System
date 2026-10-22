# EventHub - Quick Start Guide

Get the EventHub application running in 5 minutes.

## Prerequisites

- Node.js v16+ and npm
- MongoDB (local or Atlas)

## Step 1: MongoDB Setup (2 minutes)

### Local MongoDB (Recommended)

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer and follow prompts
3. MongoDB runs as a service automatically

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

**Verify:**
```bash
mongosh  # Should connect to MongoDB shell
```

### MongoDB Atlas (Cloud Alternative)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create cluster and database
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/eventhub`

## Step 2: Backend Setup (1 minute)

```bash
cd backend

# Copy environment file
copy .env.example .env

# Install dependencies
npm install

# Seed demo data
npm run seed

# Start server
npm start
```

**Expected output:**
```
MongoDB connected successfully
EventHub server running on http://localhost:5000
```

## Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
cd frontend

# Copy environment file
copy .env.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v5.0.8  ready in 234 ms
Local:   http://localhost:3000/
```

## Step 4: Login (1 minute)

Browser automatically opens at http://localhost:3000

**Login with demo credentials:**
- Email: `john@eventhub.com` (Attendee)
- Email: `demo@eventhub.com` (Organizer)

No password needed in development mode!

## What to Try

### 1. Browse Events
- Click "Events" in navbar
- See all available events with cards
- Search by event title

### 2. Book Tickets
- Click "Book" on any event
- Enter quantity (must be positive)
- Click "Confirm Booking"
- Success message appears

### 3. View My Tickets
- Click "My Tickets"
- See all your bookings
- Click "Cancel" to cancel a booking

### 4. Organizer Features (demo@eventhub.com)
- Click "Organizer Panel"
- Fill in event details
- Create new event
- See it appear in events list

## Testing API with Postman/Thunder Client

### Get Auth Token
```
POST http://localhost:5000/api/v1/auth/login
Body: { "email": "john@eventhub.com" }
```

### List Events
```
GET http://localhost:5000/api/v1/events
```

### Book Ticket
```
POST http://localhost:5000/api/v1/tickets
Header: Authorization: Bearer <token_from_above>
Body: { "eventId": "<event_id>", "quantity": 2 }
```

### Get My Tickets
```
GET http://localhost:5000/api/v1/tickets/my
Header: Authorization: Bearer <token>
```

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Fix:** Ensure MongoDB is running:
- Windows: Check Services (mongod should be running)
- macOS: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Another app is using port 5000
- Kill process: `netstat -ano | findstr :5000`
- Or change PORT in backend/.env

### CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Fix:** Ensure VITE_API_URL matches backend URL
- Frontend: `VITE_API_URL=http://localhost:5000`
- Backend running on port 5000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Fix:** Install dependencies in correct folder
```bash
cd backend
npm install
```

## File Locations

| What | Where |
|------|-------|
| Frontend app | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| API docs | See README.md |
| Environment setup | See .env.example files |
| Demo data | Created by `npm run seed` |

## Database

Demo data includes:
- 5 sample events
- 2 attendee accounts
- 1 sample ticket

View database:
```bash
mongosh
use eventhub
db.events.find()
db.attendees.find()
db.tickets.find()
```

## Next Steps

1. **Explore the code:**
   - Frontend components in `frontend/src/components`
   - Backend controllers in `backend/controllers`
   - Database models in `backend/models`

2. **Read documentation:**
   - Full details: `README.md`
   - Viva prep: `VIVA_NOTES.md`

3. **Modify and learn:**
   - Try adding a new field to Event model
   - Try creating a new API endpoint
   - Try adding a new page

## Commands Reference

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start server
npm run seed     # Seed demo data
```

## Time to Full Setup

| Task | Time |
|------|------|
| MongoDB setup | 1-2 min |
| Backend setup | 1 min |
| Frontend setup | 1 min |
| **Total** | **~3-4 min** |

## Support

Refer to `README.md` for detailed documentation and `VIVA_NOTES.md` for concept explanations.

---

**You're all set! Happy exploring!** 🚀
