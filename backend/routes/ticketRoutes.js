import express from 'express';
import {
  createTicket,
  getMyTickets,
  updateTicketStatus,
} from '../controllers/ticketController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// POST /api/v1/tickets
// Protected endpoint - create/book a ticket
router.post('/', authGuard, createTicket);

// GET /api/v1/tickets/my
// Protected endpoint - get user's tickets
router.get('/my', authGuard, getMyTickets);

// PATCH /api/v1/tickets/:id/status
// Protected endpoint - update ticket status
router.patch('/:id/status', authGuard, updateTicketStatus);

export default router;
