import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Custom format for development - colorized and readable
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, context, trace, ...meta }) => {
    let log = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }

    if (trace) {
      log += `\n${trace}`;
    }

    return log;
  }),
);

// JSON format for production - structured and parseable
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create transports based on environment
const transports: winston.transport[] = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  }),
];

// Add file transports in production
if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  );
}

export const createLogger = () => {
  return WinstonModule.createLogger({
    format: isDevelopment ? developmentFormat : productionFormat,
    transports,
    exceptionHandlers: [
      new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
  });
};
