import 'dotenv/config';
import winston from 'winston';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// Custom format for console (colorized, readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]: ${message}\n${stack}`
      : `${timestamp} [${level}]: ${message}`;
  }),
);

// Format for files (plain, JSON-friendly)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: fileFormat,
  defaultMeta: { service: 'url-shortener-api' },
  transports: [
    // Always log to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
  exceptionHandlers: [new winston.transports.Console({ format: consoleFormat })],
  rejectionHandlers: [new winston.transports.Console({ format: consoleFormat })],
});

// In production, also write to files
if (isProduction) {
  logger.add(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
    }),
  );
  logger.add(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
    }),
  );
}

export default logger;
