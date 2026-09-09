import express from 'express';
import { healthCheck } from '../controllers/healthChecker.controller.js';

const router = express.Router();

router.route('/health').get(healthCheck);

export default router;
