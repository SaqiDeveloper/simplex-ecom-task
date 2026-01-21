import { Request, Response, NextFunction } from 'express';

const sanitizeSensitiveData = (body: any): any => {
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

const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    if (process.env.NODE_ENV === 'development') {
      const sanitizedBody = sanitizeSensitiveData(req.body);
      
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        path: req.path,
        params: req.params,
        query: req.query,
        body: sanitizedBody,
        ip: req.ip || (req.socket as any).remoteAddress,
        userAgent: req.get('user-agent')
      };

      console.log('\n--- Incoming Request ---');
      console.log(JSON.stringify(logData, null, 2));
      console.log('------------------------\n');
    }
    
    next();
  } catch (error) {
    console.error('Error in requestLogger middleware:', error);
    next();
  }
};

export default requestLogger;

