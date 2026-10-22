import { getDemoEvents, getDemoAttendees } from './authController.js';

// In-memory ticket storage
let demoTickets = [];
let eventInventory = {};

// Initialize inventory from demo events
const initializeInventory = () => {
  const events = getDemoEvents();
  events.forEach((event) => {
    eventInventory[event._id] = event.ticketsAvailable;
  });
};

initializeInventory();

// Create a ticket (book an event)
export const createTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const attendeeId = req.attendeeId;

    // Validate input
    if (!eventId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Event ID and quantity are required',
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      });
    }

    // Find event
    const events = getDemoEvents();
    const event = events.find((e) => e._id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check availability
    const available = eventInventory[eventId] || event.ticketsAvailable;
    if (available < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${available} tickets are available`,
      });
    }

    // Create ticket
    const ticket = {
      _id: Date.now().toString(),
      attendeeId,
      eventId,
      quantity,
      status: 'booked',
      bookingDate: new Date(),
    };

    demoTickets.push(ticket);

    // Decrement inventory
    eventInventory[eventId] = (eventInventory[eventId] || event.ticketsAvailable) - quantity;

    return res.status(201).json({
      success: true,
      message: 'Ticket booked successfully',
      ticket,
    });
  } catch (error) {
    console.error('Ticket creation error:', error);
    next(error);
  }
};

// Get my tickets
export const getMyTickets = async (req, res, next) => {
  try {
    const attendeeId = req.attendeeId;
    const events = getDemoEvents();
    const attendees = getDemoAttendees();

    // Filter tickets for this attendee
    const tickets = demoTickets
      .filter((t) => t.attendeeId === attendeeId)
      .map((t) => ({
        ...t,
        attendeeId: {
          _id: attendeeId,
          name: 'Demo User',
          email: Object.values(attendees).find((a) => a._id === attendeeId)?.email || 'user@eventhub.com',
        },
        eventId: events.find((e) => e._id === t.eventId) || {
          _id: t.eventId,
          title: 'Unknown Event',
          date: new Date(),
          venue: 'Unknown',
        },
      }));

    return res.status(200).json({
      success: true,
      message: 'Tickets retrieved successfully',
      tickets,
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    next(error);
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const attendeeId = req.attendeeId;

    // Validate status
    const validStatuses = ['booked', 'cancelled', 'used'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // Find ticket
    const ticket = demoTickets.find((t) => t._id === id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Check ownership
    if (ticket.attendeeId !== attendeeId) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own tickets',
      });
    }

    // Prevent invalid transitions
    if (ticket.status === 'cancelled' && status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a cancelled ticket',
      });
    }

    // Handle cancellation - restore inventory
    if (status === 'cancelled' && ticket.status === 'booked') {
      eventInventory[ticket.eventId] = (eventInventory[ticket.eventId] || 0) + ticket.quantity;
    }

    // Update status
    ticket.status = status;

    return res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Status update error:', error);
    next(error);
  }
};

export default { createTicket, getMyTickets, updateTicketStatus };
