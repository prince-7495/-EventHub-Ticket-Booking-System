import { generateToken } from '../utils/token.js';

// Demo attendees (in-memory storage)
const demoAttendees = {
  'john@eventhub.com': {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@eventhub.com',
    role: 'attendee',
  },
  'demo@eventhub.com': {
    _id: '507f1f77bcf86cd799439012',
    name: 'Demo Organizer',
    email: 'demo@eventhub.com',
    role: 'organizer',
  },
};

// Demo events (in-memory storage)
const demoEvents = [
  {
    _id: '507f1f77bcf86cd799439020',
    title: 'Tech Conference 2026',
    category: 'Technology',
    date: new Date('2026-11-21'),
    venue: 'Grand Convention Center, Mumbai',
    ticketsAvailable: 100,
  },
  {
    _id: '507f1f77bcf86cd799439021',
    title: 'Web Development Workshop',
    category: 'Workshop',
    date: new Date('2026-11-06'),
    venue: 'CSPIT Campus, Charusat, Anand',
    ticketsAvailable: 50,
  },
  {
    _id: '507f1f77bcf86cd799439022',
    title: 'AI & Machine Learning Summit',
    category: 'Seminar',
    date: new Date('2026-12-06'),
    venue: 'Taj Convention Center, Bangalore',
    ticketsAvailable: 150,
  },
  {
    _id: '507f1f77bcf86cd799439023',
    title: 'JavaScript Bootcamp',
    category: 'Training',
    date: new Date('2026-11-11'),
    venue: 'Tech Hub, Ahmedabad',
    ticketsAvailable: 75,
  },
  {
    _id: '507f1f77bcf86cd799439024',
    title: 'Full Stack Development Expo',
    category: 'Expo',
    date: new Date('2026-12-21'),
    venue: 'Convention Hall, Delhi',
    ticketsAvailable: 200,
  },
];

// Login controller - Fast, no database calls
export const login = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if valid demo email
    const demoAttendee = demoAttendees[normalizedEmail];
    if (!demoAttendee) {
      return res.status(400).json({
        success: false,
        message: 'Use demo@eventhub.com or john@eventhub.com to login',
      });
    }

    // Generate JWT token
    const token = generateToken(demoAttendee._id.toString(), demoAttendee.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      attendee: {
        id: demoAttendee._id,
        name: demoAttendee.name,
        email: demoAttendee.email,
        role: demoAttendee.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Export demo data for other endpoints
export const getDemoEvents = () => demoEvents;
export const getDemoAttendees = () => demoAttendees;

export default { login, getDemoEvents, getDemoAttendees };
