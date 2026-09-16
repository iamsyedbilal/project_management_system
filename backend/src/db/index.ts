import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`,
    );
    logger.info(`MongoDB connected to the host: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection Error: ${error}`);
    process.exit(1);
  }
}
