import morgan from 'morgan';
import { appLogger } from './app.logger';

// Define a minimal HTTP request log format
const morganFormat = ':method :url :status :response-time ms';

// Morgan middleware using Winston for HTTP logging
export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const [method, url, status, responseTime] = message.trim().split(' ');

      // Forward structured log to winston
      const logObject = { method, url, status, responseTime };
      return appLogger.http(JSON.stringify(logObject));
    },
  },
});
