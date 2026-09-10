import express, { type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './utils/logger.js';
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5713',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use((req: Request, res: Response, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

import healthRoute from './routes/healthChecker.route.js';
import authRoute from './routes/auth.route.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

app.use('/api/v1', healthRoute);
app.use('/api/v1/auth', authRoute);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;
