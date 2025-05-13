/* eslint-disable @typescript-eslint/no-unused-vars */

import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import { requestLogger } from './app/logger/morgan.logger';
import rateLimit from 'express-rate-limit';
import { ApiError } from './app/errors/ApiError';
import httpStatus from 'http-status';
import { corsConfig, envConfig } from './app/config';

const app = express();

// Middleware setup
app.use(cors(corsConfig));
app.use(cookieParser());

// Rate limiter to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    if (!req.clientIp) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Unable to determine client IP!',
      );
    }

    return req.clientIp;
  },
  handler: (req, res, next, options) => {
    throw new ApiError(
      options?.statusCode,
      `Rate limit exceeded. Try again in ${options.windowMs / 60000} minutes.`,
    );
  },
});

// Apply rate limiter and setup body parsers
app.use(limiter);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Request logging
app.use(requestLogger);

// Root route - API status check
app.get('/', (req: Request, res: Response) => {
  const serverStatus = {
    status: 'running',
    message: 'Givers Heaven API is operational and running smoothly.',
    timestamp: new Date().toISOString(),
    version: 'v2.0.0',
    uptime: process.uptime(),
    environment: envConfig.nodeEnv,
    databaseStatus: 'connected',
    healthCheck: 'Healthy',
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    author: {
      name: 'Ibrahim Khalil',
      email: 'iibrahiim.dev@gmail.com',
      website: 'https://iibrahim-dev.netlify.app/',
    },
  };

  res.json(serverStatus);
});

// API routes
app.use('/api/v2', router);

// Error-handling middlewares
app.use(globalErrorHandler); // Global error handler middleware
app.use(notFound); // Middleware to handle 404 - Not Found errors

export default app;
