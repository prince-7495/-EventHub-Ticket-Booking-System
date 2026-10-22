import express from 'express';
import { getEvents, getEvent, createEvent } from '../controllers/eventController.js';
import { authGuard } from '../middleware/authGuard.js';

const router = express.Router();

// GET /api/v1/events
// Public endpoint - get all events
router.get('/', getEvents);

// GET /api/v1/events/:id
// Public endpoint - get single event
router.get('/:id', getEvent);

// POST /api/v1/events
// Protected endpoint (organizer only) - create event
router.post('/', authGuard, createEvent);

export default router;
