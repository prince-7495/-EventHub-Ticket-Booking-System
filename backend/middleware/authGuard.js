import { verifyToken } from '../utils/token.js';

// Auth Guard Middleware
// Validates Bearer token and attaches verified attendee identity and role to request

export const authGuard = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is missing',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid Authorization header format. Use "Bearer <token>"',
      });
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    req.attendeeId = decoded.attendeeId;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export default authGuard;
