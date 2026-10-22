import { getDemoEvents } from './authController.js';

// Get all events (public endpoint) - Use demo data, no DB calls
export const getEvents = async (req, res, next) => {
  try {
    const events = getDemoEvents();

    return res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      events,
    });
  } catch (error) {
    next(error);
  }
};

// Get single event
export const getEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const demoEvents = getDemoEvents();

    const event = demoEvents.find((e) => e._id === id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// Create event (demo mode - not persisted)
export const createEvent = async (req, res, next) => {
  try {
    const { title, category, date, venue, ticketsAvailable } = req.body;

    if (!title || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, and venue are required',
      });
    }

    // In demo mode, return success but don't persist
    return res.status(201).json({
      success: true,
      message: 'Event created successfully (Demo Mode - not persisted)',
      event: {
        _id: new Date().getTime().toString(),
        title,
        category: category || 'General',
        date,
        venue,
        ticketsAvailable: ticketsAvailable || 100,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default { getEvents, getEvent, createEvent };
