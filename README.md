# EventHub — Event Ticket Booking System

## Project Overview

EventHub is a complete, full-stack web application for booking event tickets. This project is submitted for the examination **ITUE301 — Advanced Web Development Frameworks** (Semester 5) at Chandubhai S. Patel Institute of Technology (CSPIT), Charotar University of Science and Technology (CHARUSAT).

**Examination Set:** F

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Router:** React Router DOM
- **State Management:** React Context API
- **Styling:** CSS3
- **Language:** JavaScript (ES6+)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Language:** JavaScript (ES Modules)

## Folder Structure

```
eventhub-ticket-booking/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── EventsPage.jsx
│   │   │   ├── MyTicketsPage.jsx
│   │   │   └── OrganizerPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Attendee.js
│   │   ├── Event.js
│   │   └── Ticket.js
│   ├── middleware/
│   │   ├── requestLogger.js
│   │   ├── authGuard.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── ticketRoutes.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── ticketController.js
│   ├── utils/
│   │   └── token.js
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── .gitignore
├── README.md
└── VIVA_NOTES.md
```

## Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **npm** or **yarn** (comes with Node.js)
3. **MongoDB** (v4.4 or higher)
   - Local installation, or
   - MongoDB Atlas account (cloud database)

## MongoDB Setup

### Option 1: Local MongoDB (Recommended for Development)

1. **Install MongoDB Community Server**
   - Windows: [Download MSI Installer](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - macOS: Use Homebrew: `brew install mongodb-community`
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB Service**
   - Windows: MongoDB runs as a service by default
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Verify Connection**
   ```bash
   mongosh
   ```
   You should see a MongoDB shell prompt.

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project and cluster
4. Get your connection string in format: `mongodb+srv://username:password@cluster.mongodb.net/eventhub`
5. Update `MONGO_URI` in `.env` with this connection string

## Environment Configuration

### Backend Configuration

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the environment example:
   ```bash
   copy .env.example .env
   ```

3. Edit `.env` with your configuration:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/eventhub
   JWT_SECRET=your_long_random_secret_key_here_min_32_characters
   ```

### Frontend Configuration

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Copy the environment example:
   ```bash
   copy .env.example .env.local
   ```

3. Edit `.env.local`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

## Installation and Startup

### Backend Installation and Startup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run the seed script to populate demo data
npm run seed

# Start the server
npm start
```

The backend will run on `http://localhost:5000` and automatically connect to MongoDB.

**Seed Data Created:**
- 5 sample events with realistic titles, dates, venues, and available tickets
- 2 demo attendee accounts
- 1 sample ticket booking

### Frontend Installation and Startup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will automatically open in your browser at `http://localhost:3000`.

## Demo Login Credentials

### Attendee Account
- **Email:** `john@eventhub.com`
- **Role:** Attendee
- **Access:** Can view events, book tickets, and manage personal tickets

### Organizer Account
- **Email:** `demo@eventhub.com`
- **Role:** Organizer
- **Access:** Can access the organizer panel to create new events

**Note:** No password is required in development mode. Simply enter the email address to login.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### Authentication (Public)

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request:**
```json
{
  "email": "john@eventhub.com"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "attendee": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@eventhub.com",
    "role": "attendee"
  }
}
```

### Events (Public)

#### GET /events
Retrieve all available events.

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "events": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Tech Conference 2026",
      "category": "Technology",
      "date": "2026-11-21T10:00:00.000Z",
      "venue": "Grand Convention Center, Mumbai",
      "ticketsAvailable": 95,
      "createdAt": "2026-10-22T10:00:00.000Z",
      "updatedAt": "2026-10-22T10:00:00.000Z"
    }
  ]
}
```

### Tickets (Protected - Requires Authentication)

#### POST /tickets
Create a new ticket booking.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "eventId": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Ticket booked successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439013",
    "attendeeId": "507f1f77bcf86cd799439011",
    "eventId": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "status": "booked",
    "bookingDate": "2026-10-22T10:00:00.000Z"
  }
}
```

**Error Response (Insufficient Tickets - 400):**
```json
{
  "success": false,
  "message": "Only 5 tickets are available"
}
```

#### GET /tickets/my
Retrieve all tickets for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Tickets retrieved successfully",
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "attendeeId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@eventhub.com"
      },
      "eventId": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Tech Conference 2026",
        "date": "2026-11-21T10:00:00.000Z",
        "venue": "Grand Convention Center, Mumbai"
      },
      "quantity": 2,
      "status": "booked",
      "bookingDate": "2026-10-22T10:00:00.000Z"
    }
  ]
}
```

#### PATCH /tickets/:id/status
Update the status of a ticket.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "status": "cancelled"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Ticket status updated successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "cancelled"
  }
}
```

**Error Response (Wrong Owner - 403):**
```json
{
  "success": false,
  "message": "You can only modify your own tickets"
}
```

## API Testing with Postman/Thunder Client

### 1. Import the Collection

Create a new collection and add the following requests:

### 2. Test Requests

**Test 1: Login**
- Method: POST
- URL: `http://localhost:5000/api/v1/auth/login`
- Body (JSON):
  ```json
  {
    "email": "john@eventhub.com"
  }
  ```

**Test 2: Get All Events**
- Method: GET
- URL: `http://localhost:5000/api/v1/events`
- Authorization: None

**Test 3: Book a Ticket (requires token from Test 1)**
- Method: POST
- URL: `http://localhost:5000/api/v1/tickets`
- Headers:
  ```
  Authorization: Bearer <token_from_login>
  ```
- Body (JSON):
  ```json
  {
    "eventId": "507f1f77bcf86cd799439012",
    "quantity": 2
  }
  ```

**Test 4: Get My Tickets**
- Method: GET
- URL: `http://localhost:5000/api/v1/tickets/my`
- Headers:
  ```
  Authorization: Bearer <token>
  ```

**Test 5: Update Ticket Status**
- Method: PATCH
- URL: `http://localhost:5000/api/v1/tickets/:id/status`
- Headers:
  ```
  Authorization: Bearer <token>
  ```
- Body (JSON):
  ```json
  {
    "status": "cancelled"
  }
  ```

## Example Workflows

### Successful Booking Workflow

1. **Login** → Get JWT token
2. **View Events** → See available events from `/api/v1/events`
3. **Book Tickets** → POST to `/api/v1/tickets` with eventId and quantity
4. **Verify Booking** → GET `/api/v1/tickets/my` to see the booked ticket
5. **Manage Tickets** → PATCH `/api/v1/tickets/:id/status` to cancel if needed

### Failed Booking Example

**Scenario:** User tries to book 100 tickets but only 50 are available

**Request:**
```json
POST /api/v1/tickets
{
  "eventId": "507f1f77bcf86cd799439012",
  "quantity": 100
}
```

**Response (HTTP 400):**
```json
{
  "success": false,
  "message": "Only 50 tickets are available"
}
```

The booking fails gracefully without creating a ticket or modifying event inventory.

## Known Limitations

1. **Authentication:** Development mode uses email-only login without passwords. In production, implement proper password hashing with bcryptjs.

2. **Session Persistence:** Authentication tokens are stored in localStorage. For production, consider using secure HTTP-only cookies.

3. **Concurrency:** While MongoDB transactions are used for atomic operations, high-concurrency scenarios may require additional optimization.

4. **File Uploads:** The application does not support event image uploads. This could be added with a file storage service like AWS S3.

5. **Email Notifications:** No email notifications are sent on booking. Could be added with services like SendGrid or Nodemailer.

6. **Payment Integration:** The application does not process actual payments. It can be extended with Stripe, Razorpay, or similar payment gateways.

## GitHub Submission Instructions

### Step 1: Initialize Git Repository

```bash
cd eventhub-ticket-booking
git init
```

### Step 2: Create .gitignore

The `.gitignore` files are already included in the project.

### Step 3: Commit Initial Code

```bash
git add .
git commit -m "Initial EventHub project commit"
```

### Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Sign in to your account
3. Click "New" to create a new repository
4. Name it: `itue301-exam-[YOUR_ROLL_NO]-[YOUR_BATCH]`
   - Example: `itue301-exam-12345-2024`
5. Set it to **Public**
6. Click "Create repository"

### Step 5: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/itue301-exam-[roll-no]-[batch].git
git branch -M main
git push -u origin main
```

### Step 6: Get Final Commit SHA

```bash
git log --format="%H" -n 1
```

Copy this commit SHA for your PDF report.

## PDF Report Instructions

The PDF report should be named: `[RollNo]_SetF_Report.pdf`

### Report Contents

1. **Project Title & Student Details**
   - Student Name
   - Roll Number
   - Batch Year
   - Subject: ITUE301 — Advanced Web Development Frameworks
   - Examination Set: F

2. **Application Overview**
   - Purpose and objectives
   - Technology stack
   - Key features

3. **Screenshots**
   - Login page
   - Events listing with EventCard
   - Booking process
   - My Tickets page
   - Organizer panel
   - Postman/Thunder Client request showing HTTP 201 response
   - MongoDB document showing saved ticket

4. **Five Tasks Summary**
   - Task 1: React Component Architecture
   - Task 2: Routing and State Management
   - Task 3: Express REST API and Middleware
   - Task 4: API Consumption in React
   - Task 5: Mongoose Models and Database

5. **API Endpoint Summary**
   - List all 5 endpoints with methods

6. **Conclusion**
   - What was learned
   - Challenges faced
   - Future improvements

## Testing Checklist

### Frontend Testing

- [ ] React application starts without errors
- [ ] All routes render correctly
- [ ] Protected routes redirect unauthenticated users to login
- [ ] EventCard displays all 5 props (title, category, date, venue, ticketsAvailable)
- [ ] "Sold Out" badge appears when ticketsAvailable === 0
- [ ] Book button is disabled for sold-out events
- [ ] Navbar navigation links work correctly
- [ ] Authentication state persists on page reload
- [ ] Role-based navigation (organizer link only for organizers)
- [ ] OrganizerPanel loads with lazy loading and Suspense
- [ ] Title search filters events client-side without API calls
- [ ] Booking form validates quantity input
- [ ] My Tickets page displays user's tickets correctly
- [ ] Cancel ticket functionality works
- [ ] Loading indicators appear during API calls
- [ ] Error messages display on API failures

### Backend Testing

- [ ] Server starts and connects to MongoDB
- [ ] Request logger outputs `[METHOD] [PATH] [TIMESTAMP]` format
- [ ] GET `/api/v1/events` returns all events (HTTP 200)
- [ ] POST `/api/v1/auth/login` returns token (HTTP 200)
- [ ] POST `/api/v1/tickets` requires valid Bearer token (HTTP 401 without token)
- [ ] POST `/api/v1/tickets` creates ticket and decrements inventory
- [ ] POST `/api/v1/tickets` returns HTTP 400 for insufficient tickets
- [ ] POST `/api/v1/tickets` returns HTTP 404 for non-existent event
- [ ] GET `/api/v1/tickets/my` returns only user's tickets
- [ ] GET `/api/v1/tickets/my` populates attendeeId and eventId correctly
- [ ] PATCH `/api/v1/tickets/:id/status` updates status (HTTP 200)
- [ ] PATCH `/api/v1/tickets/:id/status` returns HTTP 403 for wrong owner
- [ ] Cancelling a ticket restores inventory exactly once
- [ ] Double cancellation does not restore inventory twice
- [ ] Error handler returns structured JSON
- [ ] Invalid ObjectId returns HTTP 400
- [ ] Missing required fields return HTTP 400
- [ ] Duplicate email returns HTTP 400

## Viva Preparation

Refer to **VIVA_NOTES.md** for detailed explanations and sample answers for viva questions.

## Conclusion

This EventHub application demonstrates a complete full-stack web development workflow using modern technologies:

- **Frontend:** React with state management and routing
- **Backend:** Express.js with middleware and controller architecture
- **Database:** MongoDB with Mongoose for data persistence
- **Security:** JWT-based authentication with role-based access control
- **Best Practices:** RESTful API design, error handling, transaction safety

The project is ready for demonstration during the viva and meets all requirements of the ITUE301 examination (Set F).

---

**Last Updated:** October 22, 2026  
**Version:** 1.0.0  
**Status:** Complete and Ready for Submission
