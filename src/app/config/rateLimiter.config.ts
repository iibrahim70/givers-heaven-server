/* eslint-disable @typescript-eslint/no-unused-vars */

import rateLimit from 'express-rate-limit';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    if (!req.clientIp) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Client IP address could not be determined.',
      );
    }

    return req.clientIp;
  },
  handler: (req, res, next, options) => {
    throw new ApiError(
      options?.statusCode || httpStatus.TOO_MANY_REQUESTS,
      `Too many requests. Try again in ${options?.windowMs / 60000} mins.`,
    );
  },
});
