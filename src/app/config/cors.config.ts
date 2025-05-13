import { CorsOptions } from 'cors';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { envConfig } from './env.config';

// whitelist of allowed origins for CORS
const whitelist = envConfig.corsOrigin;

// CORS options to allow requests only from whitelisted origins
export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true); // Allow request
    } else {
      callback(
        // Deny request
        new ApiError(
          httpStatus.FORBIDDEN,
          'CORS request strictly prohibited from this origin',
        ),
      );
    }
  },
};
