import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.js';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Database error handler
export const handleDatabaseError = (error: any): AppError => {
  if (error.code === '23505') { // Unique constraint violation
    return new AppError('Resource already exists', 409, true, 'DUPLICATE_RESOURCE');
  }
  
  if (error.code === '23503') { // Foreign key constraint violation
    return new AppError('Referenced resource not found', 400, true, 'INVALID_REFERENCE');
  }
  
  if (error.code === '23502') { // Not null constraint violation
    return new AppError('Required field is missing', 400, true, 'MISSING_REQUIRED_FIELD');
  }
  
  if (error.code === '22001') { // String data too long
    return new AppError('Input data too long', 400, true, 'DATA_TOO_LONG');
  }
  
  if (error.code === '22003') { // Numeric value out of range
    return new AppError('Numeric value out of range', 400, true, 'VALUE_OUT_OF_RANGE');
  }
  
  if (error.code === 'ECONNREFUSED') {
    return new AppError('Database connection failed', 503, true, 'DATABASE_UNAVAILABLE');
  }
  
  // Generic database error
  return new AppError('Database operation failed', 500, false, 'DATABASE_ERROR');
};

// JWT error handler
export const handleJWTError = (error: any): AppError => {
  if (error.name === 'TokenExpiredError') {
    return new AppError('Token has expired', 401, true, 'TOKEN_EXPIRED');
  }
  
  if (error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401, true, 'INVALID_TOKEN');
  }
  
  if (error.name === 'NotBeforeError') {
    return new AppError('Token not active yet', 401, true, 'TOKEN_NOT_ACTIVE');
  }
  
  return new AppError('Authentication failed', 401, true, 'AUTH_FAILED');
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details
  logger.error(`Error ${err.statusCode || 500}: ${err.message}`, {
    error: err,
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id || 'anonymous'
    },
    stack: err.stack
  });

  // Handle specific error types
  if (err.code && (err.code.startsWith('23') || err.code === 'ECONNREFUSED')) {
    error = handleDatabaseError(err);
  } else if (err.name && (err.name.includes('JsonWebToken') || err.name.includes('Token'))) {
    error = handleJWTError(err);
  } else if (err.name === 'CastError') {
    error = new AppError('Invalid ID format', 400, true, 'INVALID_ID');
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new AppError(`Validation Error: ${message}`, 400, true, 'VALIDATION_ERROR');
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File size too large', 413, true, 'FILE_TOO_LARGE');
  } else if (err.statusCode) {
    error = new AppError(err.message, err.statusCode, err.isOperational || true, err.code);
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.isOperational !== false ? error.message : 'Something went wrong';

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: error.code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message, {
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    }
  });
  
  next(new AppError(message, 404, true, 'ROUTE_NOT_FOUND'));
};

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: (req as any).user?.id || 'anonymous'
      },
      response: {
        statusCode: res.statusCode,
        duration
      }
    });
  });
  
  next();
};
