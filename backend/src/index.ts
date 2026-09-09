import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './db/index.js';
import app from './app.js';
import logger from './utils/logger.js';

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(port, function () {
      logger.info(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    logger.error(`MongoDB connection error Error: ${error}`);
  });
