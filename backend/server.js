import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking, allows demo mode)
connectDB().catch((err) => {
  console.log('⚠ MongoDB not available - running in demo mode');
});

// Middleware
app.use(express.json());
app.use(cors());

// Request Logger Middleware (Global)
app.use(requestLogger);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Global Error Handler (registered last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ EventHub server running on http://localhost:${PORT}`);
});
