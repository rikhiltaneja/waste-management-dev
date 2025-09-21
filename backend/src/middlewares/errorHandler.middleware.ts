import { Request, Response, NextFunction } from 'express';
import { TrainingError } from '../utils/errors';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (error instanceof TrainingError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        details: error.details
      },
      timestamp: new Date().toISOString(),
      path: req.url
    });
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      error: {
        message: 'Database operation failed',
        code: 'DATABASE_ERROR'
      },
      timestamp: new Date().toISOString(),
      path: req.url
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR'
      },
      timestamp: new Date().toISOString(),
      path: req.url
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    timestamp: new Date().toISOString(),
    path: req.url
  });
};