// Request Logger Middleware
// Logs every incoming request in format: [METHOD] [PATH] [TIMESTAMP]

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.originalUrl;
  console.log(`[${method}] [${path}] [${timestamp}]`);
  next();
};

export default requestLogger;
