import path from 'path';
import { format as formatDate } from 'date-fns';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { envConfig } from '../config';
import stripAnsi from 'strip-ansi';
import util from 'util';

// Define log levels with severity
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
};

// Set log level based on environment
const getLogLevel = () => {
  return envConfig.nodeEnv === 'development' ? 'http' : 'warn';
};

// Filter logs by specific level
const levelFilter = (level: string) => {
  return winston.format((info) => {
    return info?.level === level ? info : false;
  })();
};

// Assign colors to each log level
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
});

// Log format with timestamp and no color
const plainLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp as string);
    const formattedDate = formatDate(date, 'EEEE, yyyy-MM-dd HH:mm:ss');

    // Clean message for file output
    let cleanMessage = message;

    if (typeof message === 'string') {
      cleanMessage = stripAnsi(message);
    } else {
      cleanMessage = util.inspect(message, { depth: null });
    }

    return `${level.toUpperCase()}: ${cleanMessage} - [${formattedDate}]`;
  }),
);

// Log format with timestamp and color
const coloredConsoleFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp }) => {
    const date = new Date(timestamp as string);
    const formattedDate = formatDate(date, 'EEEE, yyyy-MM-dd HH:mm:ss');

    return `${level.toUpperCase()}: ${message} - [${formattedDate}]`;
  }),

  winston.format.colorize({ all: true }),
);

// Create rotating file transport for a specific level
const createDailyRotateTransport = (logLevel: string) =>
  new DailyRotateFile({
    filename: path.join(process.cwd(), 'logs', logLevel, '%DATE%.log'),
    datePattern: 'DD-MM-YYYY',
    maxSize: '20m',
    maxFiles: '1d',
    level: logLevel,
    format: winston.format.combine(levelFilter(logLevel), plainLogFormat),
  });

// Create and export the logger
export const appLogger = winston.createLogger({
  levels,
  level: getLogLevel(),
  transports: [
    // Console output
    new winston.transports.Console({
      format: coloredConsoleFormat,
    }),

    // File outputs by level
    createDailyRotateTransport('info'),
    createDailyRotateTransport('warn'),
    createDailyRotateTransport('error'),
    createDailyRotateTransport('http'),
  ],
});
