import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import { corsConfig, envConfig, rateLimiter } from './app/config';
import { morganLogger } from './app/logger';
import helmet from 'helmet';
import hpp from 'hpp';

const app = express();

// Middleware setup
app.use(cors(corsConfig)); // CORS
app.use(cookieParser()); // Cookie parsing
app.use(rateLimiter); // Rate limiting
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(hpp()); // Prevent HTTP parameter pollution
app.use(express.json({ limit: '16kb' })); // JSON body parser
app.use(morganLogger); // Request logging

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
