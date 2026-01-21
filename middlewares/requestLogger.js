/**
 * Request Logger Middleware
 * Production-level middleware for logging HTTP requests
 * Logs request details for debugging and monitoring
 */

/**
 * Middleware to log incoming HTTP requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Always calls next() to continue request processing
 * 
 * @description
 * Logs request method, URL, params, query, and body
 * Only logs in development mode to avoid performance impact in production
 * Sanitizes sensitive data from logs (passwords, tokens, etc.)
 * 
 * @example
 * app.use(requestLogger);
 */
const requestLogger = (req, res, next) => {
  try {
    // Only log in development mode to avoid performance impact in production
    if (process.env.NODE_ENV === 'development') {
      // Sanitize sensitive fields from request body
      const sanitizedBody = sanitizeSensitiveData(req.body);
      
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        params: req.params,
        query: req.query,
        body: sanitizedBody,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
      };

      console.log('\n--- Incoming Request ---');
      console.log(JSON.stringify(logData, null, 2));
      console.log('------------------------\n');
    }
    
    // Always proceed to next middleware
    return next();
  } catch (error) {
    // Log error but don't block request processing
    console.error('Error in requestLogger middleware:', error);
    return next();
  }
};

/**
 * Sanitizes sensitive data from request body before logging
 * 
 * @param {Object} body - Request body object
 * @returns {Object} Sanitized body object
 */
const sanitizeSensitiveData = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey', 'authorization'];
  const sanitized = { ...body };

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
};

module.exports = requestLogger;
