import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import logger from './utils/logger.js';

const port = process.env.PORT;
app.listen(port, function () {
  logger.info(`Server is running on port http://localhost:${port}`);
});
