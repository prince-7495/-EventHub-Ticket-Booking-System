# EventHub — Viva Preparation Notes

This document provides simple explanations and sample viva answers for the EventHub Event Ticket Booking System project. These notes are designed for a 5th semester engineering student and explain concepts in practical, easy-to-understand language.

---

## TASK 1: React Component Architecture

### Q1: What is a React component? Why do we use them?

**Answer:**
A React component is a reusable piece of user interface (UI). It's like a building block that we can use multiple times throughout our application.

**Why use components?**
- **Reusability:** We can use the same component in many places without repeating code
- **Modularity:** Each component has its own job, making code easier to understand and maintain
- **Easy Updates:** If we need to change a component, we only change it in one place

**Example from EventHub:**
The `EventCard` component displays event information (title, date, venue, tickets). Instead of writing this code for every event, we create one `EventCard` component and reuse it for all events.

---

### Q2: Explain the EventCard component and its props

**Answer:**
The `EventCard` component is a reusable component that displays one event's information in a card format.

**Props it accepts:**
```javascript
<EventCard
  id={event._id}
  title={event.title}          // Event name
  category={event.category}    // Event type
  date={event.date}            // Event date/time
  venue={event.venue}          // Where the event is held
  ticketsAvailable={event.ticketsAvailable}  // Number of tickets left
  onBook={handleBookClick}     // Callback when book button clicked
/>
```

**What it displays:**
- Event title
- Category
- Date and time (formatted nicely)
- Venue/location
- Number of tickets available

**Conditional logic:**
- If `ticketsAvailable === 0`: Show "Sold Out" badge, disable Book button
- If `ticketsAvailable > 0`: Show "Book" button that is clickable

**Why props instead of hardcoding?**
Instead of writing the data inside the component, we pass it as props. This makes the component flexible and reusable for different events.

---

### Q3: What is conditional rendering? Give examples from EventCard

**Answer:**
Conditional rendering means showing or hiding parts of the UI based on certain conditions. In JavaScript, we use `if`, ternary operators (`? :`), or logical operators (`&&`, `||`).

**Examples in EventCard:**

```javascript
// Example 1: Using ternary operator
{isSoldOut ? (
  <span className="sold-out-badge">Sold Out</span>
) : (
  <button className="btn btn-primary" onClick={() => onBook(id)}>
    Book
  </button>
)}

// This means: If isSoldOut is true, show "Sold Out", otherwise show the Book button
```

```javascript
// Example 2: Using logical AND (&&)
{!isSoldOut && (
  <button className="btn btn-primary" onClick={() => onBook(id)}>
    Book
  </button>
)}

// This means: Only show the button if NOT sold out
```

---

### Q4: What's the difference between reusable components and page components?

**Answer:**

**Reusable Components** (in `/components`):
- Small, focused components
- Used in multiple places
- Examples: `EventCard`, `Navbar`, `ErrorMessage`, `Loading`
- Have props for flexibility

**Page Components** (in `/pages`):
- Larger components representing entire pages
- Usually used only once for a specific route
- Examples: `LoginPage`, `EventsPage`, `MyTicketsPage`, `OrganizerPanel`
- Manage page-level state and data fetching

**Example:**
- `EventCard` is reusable — we use it 5 times on `EventsPage` for 5 different events
- `EventsPage` is a page component — represents the whole "Events" page

---

## TASK 2: Routing and State Management

### Q5: What is React Router and why do we need it?

**Answer:**
React Router is a library that handles navigation between different pages in a single-page application (SPA). Instead of reloading the entire page, it changes what content is shown without a full page refresh.

**Why we need it:**
- **Single Page Application (SPA):** Our app loads once, then React changes the content based on the URL
- **Navigation without reload:** Clicking links doesn't reload the page
- **URL management:** Each "page" has its own URL
- **Better user experience:** Faster and smoother than traditional multi-page apps

**Our routes:**

| URL | Component | Access |
|-----|-----------|--------|
| `/` | LoginPage | Everyone |
| `/events` | EventsPage | Only logged-in users |
| `/my-tickets` | MyTicketsPage | Only logged-in users |
| `/organizer` | OrganizerPanel | Only organizers |

---

### Q6: Explain AuthContext and why we use it

**Answer:**
AuthContext is a way to share authentication data (login status, token, user role) across our entire application without passing props down through many components.

**What it stores:**
```javascript
{
  attendee,     // User information (name, email, role)
  token,        // JWT token for API requests
  role,         // "attendee" or "organizer"
  login,        // Function to login user
  logout,       // Function to logout user
  loading       // Whether auth is being checked
}
```

**Why we use it (instead of props):**
Imagine passing login data through 5 components just to use it in the 5th one. That's messy! Context lets us access the data directly from any component without passing it through intermediate components.

**How to use it:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { token, role, logout } = useAuth();
  
  // Now we can access token, role, logout directly!
}
```

**localStorage persistence:**
The token and user data are stored in `localStorage` so the login persists even if the browser is closed and reopened.

---

### Q7: Explain ProtectedRoute component

**Answer:**
ProtectedRoute is a special component that checks if a user is logged in before allowing them to access a page.

**How it works (3-step process):**

**Step 1: Check if token exists**
```javascript
if (!token) {
  return <Navigate to="/" replace />;  // Redirect to login
}
```
If no token, send them to the login page.

**Step 2: Check if specific role is required**
```javascript
if (requiredRole && role !== requiredRole) {
  return <Navigate to="/events" replace />;  // Redirect to events
}
```
If the page needs an organizer but user is attendee, redirect them to events page.

**Step 3: If all checks pass, show the page**
```javascript
return <Component />;  // Show the protected page
```

**Usage example:**
```javascript
<Route
  path="/organizer"
  element={<ProtectedRoute 
    component={OrganizerPanel} 
    requiredRole="organizer" 
  />}
/>
```

**Why it matters:**
- Attendees can't access `/organizer` page
- Users not logged in can't access `/events`
- Regular users see events page when they try accessing organizer

---

### Q8: What is React.lazy and Suspense? Why use them?

**Answer:**
React.lazy allows us to load a component only when it's needed (lazy loading). Suspense shows a fallback (like a loading spinner) while waiting for the component to load.

**Code:**
```javascript
const OrganizerPanel = React.lazy(() => import('./pages/OrganizerPanel'));

<Route
  path="/organizer"
  element={
    <Suspense fallback={<Loading />}>
      <OrganizerPanel />
    </Suspense>
  }
/>
```

**What happens:**
1. When app loads, `OrganizerPanel` is NOT downloaded yet
2. Only organizers visit `/organizer` page
3. When an organizer visits that page, the component downloads
4. While downloading, `<Loading />` spinner shows
5. Once downloaded, `<OrganizerPanel />` displays

**Benefits:**
- **Smaller initial app size:** Less code to download at startup
- **Faster initial load:** Organizer panel code isn't included for attendees
- **Better performance:** Code splitting

---

### Q9: Explain the booking form on EventsPage

**Answer:**
The booking form lets users select how many tickets they want to buy for an event.

**Form state (using useState):**
```javascript
const [selectedEventId, setSelectedEventId] = useState(null);
const [quantity, setQuantity] = useState(1);
const [bookingError, setBookingError] = useState('');
```

**How it works:**
1. User clicks "Book" button on an event card
2. Form appears with input field for quantity
3. User enters number of tickets
4. User clicks "Confirm Booking"
5. Form validates: quantity must be positive integer and not exceed availability
6. If valid, POST request sent to backend
7. Backend checks again if tickets available, creates booking
8. Success message shown

**Validation (Frontend):**
```javascript
if (quantity > event.ticketsAvailable) {
  setError('Only 5 tickets available');
}
```

**Important:** Backend also validates (never trust frontend validation alone):
```javascript
// Backend checks again
if (event.ticketsAvailable < quantity) {
  return 400 error
}
```

---

## TASK 3: Express REST API and Middleware

### Q10: What is a REST API and why do we use it?

**Answer:**
REST (Representational State Transfer) is a way for frontend and backend to communicate. The backend provides **endpoints** that frontend can call to get or send data.

**Our endpoints communicate using:**
- **HTTP Methods:** GET (fetch), POST (create), PATCH (update)
- **URLs:** `/api/v1/events`, `/api/v1/tickets`
- **JSON:** Data format for requests and responses

**Why REST:**
- **Standard approach:** Everyone uses the same pattern
- **Scalable:** Can handle many requests
- **Flexible:** Can add new endpoints easily
- **Testable:** Easy to test with tools like Postman

---

### Q11: What are middleware? Explain requestLogger

**Answer:**
Middleware are functions that process requests before they reach their destination. They're like security guards that check every visitor.

**Order of middleware:**
```
Request comes in
  ↓
Middleware 1 (requestLogger) → Logs request
  ↓
Middleware 2 (authGuard) → Checks authentication
  ↓
Route Handler (Controller) → Processes request
  ↓
Response sent back
```

**requestLogger middleware:**
```javascript
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;        // GET, POST, PATCH
  const path = req.originalUrl;     // /api/v1/events
  
  console.log(`[${method}] [${path}] [${timestamp}]`);
  
  next();  // Pass to next middleware
};
```

**Output example:**
```
[GET] [/api/v1/events] [2026-10-22T04:00:00.000Z]
[POST] [/api/v1/auth/login] [2026-10-22T04:00:01.000Z]
[POST] [/api/v1/tickets] [2026-10-22T04:00:05.000Z]
```

**Why log requests?**
- **Debugging:** See what requests come in
- **Monitoring:** Track usage patterns
- **Security:** Detect suspicious activity

---

### Q12: Explain authGuard middleware

**Answer:**
authGuard verifies that the user is logged in (has a valid JWT token) before allowing access to protected endpoints.

**How it works:**

**Step 1: Read Authorization header**
```javascript
const authHeader = req.headers.authorization;
// Should look like: "Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Step 2: Verify format**
```javascript
const parts = authHeader.split(' ');
if (parts[0] !== 'Bearer') {
  return 401 error;  // Invalid format
}
```

**Step 3: Extract and verify token**
```javascript
const token = parts[1];
const decoded = verifyToken(token);

if (!decoded) {
  return 401 error;  // Token invalid or expired
}
```

**Step 4: Attach user info to request**
```javascript
req.attendeeId = decoded.attendeeId;  // From JWT
req.role = decoded.role;              // From JWT

next();  // Pass to next middleware/controller
```

**Usage:**
```javascript
// Without authGuard - Public
router.get('/events', getEvents);

// With authGuard - Protected
router.post('/tickets', authGuard, createTicket);
```

---

### Q13: Explain the ticket booking process and stock validation

**Answer:**
Booking a ticket involves creating a record and ensuring we don't oversell. This is done safely using MongoDB transactions.

**Process:**

**Frontend sends:**
```json
{
  "eventId": "507f...",
  "quantity": 2
}
```

**Backend does (using transaction):**

```javascript
// 1. Validate input
if (quantity <= 0) return 400 error;

// 2. Find event
const event = await Event.findById(eventId);
if (!event) return 404 error;

// 3. Check stock
if (event.ticketsAvailable < quantity) {
  return 400 error;  // "Only 5 available"
}

// 4. Create ticket (in transaction)
await Ticket.create({ attendeeId, eventId, quantity });

// 5. Decrement stock (in transaction)
event.ticketsAvailable -= quantity;
await event.save();
```

**Why transactions?**
Imagine two users booking the last 2 tickets simultaneously:
- User A: Checks stock, sees 2 available ✓
- User B: Checks stock, sees 2 available ✓
- User A: Books 2 tickets, stock becomes 0
- User B: Also books 2 tickets ✗ (Overselling!)

**Transactions prevent this:**
- Both operations happen together or not at all
- If booking fails, stock doesn't change

---

### Q14: What is error handling middleware?

**Answer:**
Global error handling middleware catches all errors and returns structured JSON responses instead of raw error messages.

**Common errors it handles:**

```javascript
// 1. Invalid MongoDB ID
if (err.name === 'CastError') {
  return { success: false, message: 'Invalid ID format' }
}

// 2. Validation errors (required fields missing)
if (err.name === 'ValidationError') {
  return { success: false, message: 'Validation error', details: [...] }
}

// 3. Duplicate email
if (err.code === 11000) {
  return { success: false, message: 'Email already exists' }
}

// 4. Unknown errors
return { success: false, message: 'Internal server error' }
```

**Why centralized error handling?**
- **Consistency:** All errors return same format
- **Security:** Never expose stack traces or internal details
- **Easy debugging:** All error handling in one place

---

## TASK 4: API Consumption in React

### Q15: Explain EventsPage data fetching

**Answer:**
EventsPage fetches events from the backend API when it loads, displays them as cards, and handles loading/error states.

**Three state values:**
```javascript
const [events, setEvents] = useState([]);        // List of events
const [loading, setLoading] = useState(true);    // Is data loading?
const [error, setError] = useState('');          // Error message
```

**useEffect hook:**
```javascript
useEffect(() => {
  fetchEvents();
}, []);  // [] means run ONCE when component mounts
```

**What fetchEvents does:**
1. Set `loading = true`
2. Call API: `GET /api/v1/events`
3. If success: `setEvents(response.events)`
4. If error: `setError(error.message)`
5. Set `loading = false`

**Display logic:**
```javascript
if (loading) return <Loading />;           // Show spinner
if (error) return <ErrorMessage />;        // Show error
if (events.length === 0) return <EmptyState />;  // No events
return <display events as cards>;         // Show events
```

**Never hardcode events:**
```javascript
// ❌ WRONG
const events = [{title: "Event 1"}, ...];

// ✅ CORRECT
const [events, setEvents] = useState([]);
useEffect(() => {
  fetchEvents();  // Get from backend
}, []);
```

---

### Q16: Explain client-side title search

**Answer:**
Client-side search filters events WITHOUT making new API calls. The original event list stays unchanged.

**Implementation:**
```javascript
const [searchQuery, setSearchQuery] = useState('');

// Keep original events
const [events, setEvents] = useState([]);

// Filter during render (NOT in a state change)
const filteredEvents = events.filter((event) =>
  event.title.toLowerCase().includes(searchQuery.toLowerCase())
);

// Display filtered events
{filteredEvents.map(event => <EventCard key={event._id} ... />)}
```

**Why client-side?**
- **No API calls:** Saves bandwidth
- **Fast:** No network delay
- **Simple:** Filter locally with JavaScript

**Example:**
- Events: ["Tech Conference", "Web Workshop", "AI Summit"]
- User types: "tech"
- Filtered: ["Tech Conference"]
- User types: "work"
- Filtered: ["Web Workshop"]

---

### Q17: What is VITE_API_URL and why use environment variables?

**Answer:**
VITE_API_URL is an environment variable that stores the backend API address. It changes based on environment.

**Why use environment variables?**

**Development:**
```env
VITE_API_URL=http://localhost:5000
```

**Production:**
```env
VITE_API_URL=https://api.eventhub.com
```

**Without environment variables:**
```javascript
// ❌ BAD - hardcoded
const API_URL = 'http://localhost:5000';
```
If we deploy, we have to change code!

**With environment variables:**
```javascript
// ✅ GOOD - uses .env file
const API_URL = import.meta.env.VITE_API_URL;
```
Different URLs for different environments, no code change!

---

## TASK 5: Mongoose Models and Database

### Q18: What is MongoDB and why use it?

**Answer:**
MongoDB is a NoSQL (not SQL) database that stores data as JSON-like documents instead of tables and rows.

**Traditional Database (SQL):**
```
TABLE: events
|  id  |  title        |  date       |
|  1   |  Tech Conf    |  2026-11-21 |
|  2   |  Workshop     |  2026-11-15 |
```

**MongoDB (NoSQL):**
```javascript
// Document 1
{
  _id: ObjectId(...),
  title: "Tech Conference",
  date: "2026-11-21"
}

// Document 2
{
  _id: ObjectId(...),
  title: "Workshop",
  date: "2026-11-15"
}
```

**Why MongoDB for this project?**
- **Flexible:** Can add new fields without changing structure
- **JSON-like:** Easy to work with JavaScript
- **Scalable:** Handles lots of data
- **Fast:** Good for read operations

---

### Q19: Explain Mongoose schemas and models

**Answer:**
Mongoose is a library that helps us work with MongoDB from Node.js.

**Schema:** Defines the structure (fields and rules)
```javascript
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  date: {
    type: Date,
    required: true
  },
  ticketsAvailable: {
    type: Number,
    min: [0, 'Cannot be negative']
  }
});
```

**Model:** Uses the schema to interact with database
```javascript
const Event = mongoose.model('Event', eventSchema);

// Now we can:
const events = await Event.find();           // Get all
const event = await Event.findById(id);      // Get one
await Event.create({ title: 'New Event' }); // Create
await event.save();                          // Update
```

---

### Q20: Explain Attendee, Event, and Ticket models

**Answer:**

**Attendee Model:**
```javascript
{
  name: String,
  email: String (unique),  // No two attendees with same email
  phone: String,
  role: "attendee" or "organizer",
  timestamps...
}
```

**Event Model:**
```javascript
{
  title: String,
  category: String,
  date: Date,
  venue: String,
  ticketsAvailable: Number (min 0),
  timestamps...
}
```

**Ticket Model:**
```javascript
{
  attendeeId: Reference to Attendee,
  eventId: Reference to Event,
  quantity: Number (min 1),
  bookingDate: Date,
  status: "booked" | "cancelled" | "used",
  timestamps...
}
```

**Relationships:**
```
Attendee ---- (many) ---- Ticket
  (one)                     (many)
   
Event -------- (many) ---- Ticket
  (one)                     (many)
```

---

### Q21: What is populate() in Mongoose?

**Answer:**
populate() replaces a reference ID with the actual data from another collection.

**Without populate:**
```javascript
const ticket = await Ticket.findById(ticketId);
console.log(ticket);
// {
//   _id: "123",
//   attendeeId: "456",      // Just the ID!
//   eventId: "789",
//   quantity: 2
// }
```

**With populate:**
```javascript
const ticket = await Ticket.findById(ticketId)
  .populate('attendeeId', 'name email')  // Get attendee data
  .populate('eventId', 'title date');    // Get event data

console.log(ticket);
// {
//   _id: "123",
//   attendeeId: { _id: "456", name: "John", email: "john@..." },
//   eventId: { _id: "789", title: "Tech Conf", date: "2026-11..." },
//   quantity: 2
// }
```

**In GET /tickets/my:**
```javascript
const tickets = await Ticket.find({ attendeeId })
  .populate('attendeeId', 'name email')
  .populate('eventId', 'title date venue');
```

Frontend gets complete event and attendee details without extra API calls!

---

### Q22: Explain email uniqueness constraint

**Answer:**
Email must be unique — no two attendees can have the same email.

**In MongoDB (Index):**
```javascript
attendeeSchema.index({ email: 1 }, { unique: true });
```

**In Mongoose Schema:**
```javascript
email: {
  type: String,
  unique: [true, 'Email already exists']
}
```

**What happens:**
```javascript
// First user
await Attendee.create({ email: 'john@eventhub.com' });  // ✓ Success

// Second user with same email
await Attendee.create({ email: 'john@eventhub.com' });  // ✗ Error!
```

**Error response:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Why unique?**
- **Identification:** Email uniquely identifies each user
- **Security:** Prevents duplicate accounts
- **Data integrity:** One email = one attendee

---

## General Concepts

### Q23: What is JWT and how does it work?

**Answer:**
JWT (JSON Web Token) is a token that proves you're logged in. The backend creates it, the frontend stores it, and sends it back for protected requests.

**Three parts (separated by dots):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJhdHRlbmRlZUlkIjoiMTIzIiwicm9sZSI6ImF0dGVuZGVlIn0.
abcd123EFGH456...
```

**Process:**
1. **Login:** User sends email → Backend creates JWT with userID inside
2. **Token returned:** Frontend stores token in localStorage
3. **Protected request:** Frontend sends token in header: `Authorization: Bearer <token>`
4. **Verification:** Backend decodes token, checks signature, extracts userID
5. **Success:** Backend knows who the user is without checking password again

**JWT contains:**
```javascript
{
  attendeeId: "507f1f77bcf86cd799439011",
  role: "attendee",
  iat: 1629873600,  // Issued at
  exp: 1629960000   // Expiration
}
```

---

### Q24: Explain frontend validation vs backend validation

**Answer:**

**Frontend Validation (UX):**
```javascript
if (quantity <= 0) {
  setError('Quantity must be positive');
  return;
}
```
- **Purpose:** Better user experience
- **Speed:** Instant feedback without API call
- **Trust:** Don't trust it for security!

**Backend Validation (Security):**
```javascript
if (!Number.isInteger(quantity) || quantity <= 0) {
  return 400 error;
}
```
- **Purpose:** Ensure data integrity and security
- **Trust:** Always trust backend validation
- **Protection:** User can't bypass frontend, but could bypass backend if not there

**Why both?**
- **Frontend:** Makes app feel responsive
- **Backend:** Ensures security (user could modify frontend code or use API directly)

**Example attack:**
```javascript
// User modifies browser code to skip frontend validation
fetch('/api/v1/tickets', {
  body: JSON.stringify({
    eventId: "...",
    quantity: -100  // Invalid!
  })
});
```

Backend must catch this!

---

### Q25: What are the 5 examination tasks and how do they relate?

**Answer:**

**Task 1: React Components**
- Create reusable components (EventCard, Navbar)
- Pass data through props
- Use conditional rendering

↓

**Task 2: Routing & State Management**
- Connect components into a multi-page app with React Router
- Manage authentication with Context API
- Create ProtectedRoute component

↓

**Task 3: Express API**
- Build backend endpoints that components need
- Implement middleware (logging, auth, error handling)
- Define data models with Mongoose

↓

**Task 4: API Consumption**
- Connect React components to Express endpoints
- Fetch data with useEffect
- Handle loading and error states

↓

**Task 5: Database**
- Define Mongoose schemas for data structure
- Implement relationships between collections
- Ensure data validation and integrity

**How they work together:**
```
Frontend (React)
    ↓
Task 1: Components display data with props
    ↓
Task 2: Router navigates between pages, Context stores auth
    ↓
Task 4: Components fetch data from API
    ↓
Backend (Express)
    ↓
Task 3: API endpoints process requests
    ↓
Task 5: Database stores and validates data
```

---

## Practice Questions for Viva

1. Why is EventCard a reusable component? How would the code change if it weren't reusable?
2. Draw a diagram showing the data flow from clicking "Book" button to seeing the booked ticket in "My Tickets".
3. What happens if user tries to access `/organizer` page without organizer role?
4. What would break if we didn't use MongoDB transactions in ticket booking?
5. Why must the backend validate ticket quantity even if frontend already did?
6. How does a user stay logged in after closing and reopening the browser?
7. What's the difference between `GET /api/v1/events` and `GET /api/v1/tickets/my`?
8. How does Mongoose's populate() help in the My Tickets page?
9. What would happen if we used hardcoded events instead of fetching from API?
10. How does the router prevent unauthorized access to protected pages?

---

## Code Examples for Demonstration

### Example 1: Complete Flow - Booking a Ticket

```javascript
// 1. User types email on LoginPage
// Frontend: POST /auth/login
{
  "email": "john@eventhub.com"
}

// Backend Response: HTTP 200
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "attendee": {
    "id": "507f...",
    "name": "John",
    "role": "attendee"
  }
}

// Frontend: Stores token + attendee in localStorage, redirects to /events

// 2. User sees events on EventsPage
// Frontend: GET /events (no auth needed)
// Backend Response: [event1, event2, event3, ...]

// 3. User clicks "Book" on an event
// EventCard onBook callback triggered
// Booking form appears

// 4. User enters quantity=2 and clicks "Confirm"
// Frontend validation: quantity is positive integer ✓
// Frontend: POST /tickets
{
  "eventId": "507f1f77bcf86cd799439012",
  "quantity": 2,
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Backend: authGuard middleware
// - Reads Authorization header
// - Verifies JWT
// - Extracts attendeeId = "507f1f77bcf86cd799439011"

// Backend: createTicket controller
// - Validates quantity = 2 ✓
// - Finds event, checks ticketsAvailable = 50 ✓
// - Creates Ticket document
// - Decrements ticketsAvailable from 50 to 48

// Backend Response: HTTP 201
{
  "success": true,
  "message": "Ticket booked successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439013",
    "attendeeId": "507f1f77bcf86cd799439011",
    "eventId": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "status": "booked"
  }
}

// Frontend: Shows success message, updates event card (48 tickets left)

// 5. User clicks "My Tickets"
// Frontend: GET /tickets/my with Bearer token
// Backend: Returns only this attendee's tickets with populate

// Response: HTTP 200
{
  "tickets": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "attendeeId": { "name": "John", "email": "john@..." },
      "eventId": { "title": "Tech Conf", "date": "2026-11-21" },
      "quantity": 2,
      "status": "booked"
    }
  ]
}

// Frontend: Displays ticket in MyTicketsPage
```

---

## Summary

**Remember these key points for your viva:**

1. **Components:** Reusable building blocks with props
2. **Routing:** Navigate between pages without full reload
3. **Context:** Share data across entire app
4. **Protected Routes:** Verify authentication before showing pages
5. **REST API:** Standardized way for frontend and backend to communicate
6. **Middleware:** Process requests (logging, authentication, error handling)
7. **Database:** MongoDB stores all data
8. **Mongoose:** JavaScript library to work with MongoDB
9. **JWT:** Token that proves user is logged in
10. **Transactions:** Ensure database operations are safe

**Final tip:** During viva, explain your code by following the data flow. Start from user action (click), show what happens in React, then what API is called, then what backend does, then how data returns to frontend. This shows complete understanding!

---

**Good luck with your viva!** 🚀

