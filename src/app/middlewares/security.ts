/* eslint-disable @typescript-eslint/no-unused-vars */

import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { corsConfig } from '../config/cors.config';

export const securityMiddlewares = [
  helmet(), // Set security headers
  hpp(), // Prevent HTTP parameter pollution
  cors(corsConfig), // CORS configuration
  cookieParser(), // Parse cookies
  // Disable Express "x-powered-by" header (done in app.ts)
];

export const rateLimiter = rateLimit({
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
