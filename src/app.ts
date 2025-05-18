import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import { corsConfig, envConfig, rateLimiter } from './app/config';
import { requestLogger } from './app/logger';
import helmet from 'helmet';
import hpp from 'hpp';
import requestIp from 'request-ip';
import compression from 'compression';

const app = express();

// Middleware setup
app.use(cors(corsConfig)); // CORS
app.use(cookieParser()); // Cookie parsing
app.use(requestIp.mw()); // Extract IP address
app.use(compression()); // Compress responses
app.use(rateLimiter); // Rate limiting
app.use(
  helmet({
    xPoweredBy: false, // Hide Express info
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Enforce HTTPS
    noSniff: true, // Prevent MIME sniffing
    referrerPolicy: { policy: 'no-referrer' }, // Hide referrer info
  }),
); // Apply security headers
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(express.json({ limit: '16kb' })); // Limit JSON payload
app.use(requestLogger); // Log requests

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
app.use(globalErrorHandler); // Global error handler
app.use(notFound); // 404 handler

export default app;
