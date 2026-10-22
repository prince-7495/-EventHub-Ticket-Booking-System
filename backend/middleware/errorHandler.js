// Global Error Handler Middleware
// Handles all errors and returns structured JSON responses

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose Invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: messages,
    });
  }

  // Duplicate Key Error (Email, etc.)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // JSON Parse Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body',
    });
  }

  // Default server error
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

export default errorHandler;
