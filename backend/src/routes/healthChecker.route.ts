import express from 'express';
import { healthCheck } from '../controllers/healthChecker.controller.js';

const router = express.Router();

router.route('/healthcheck/').get(healthCheck);

export default router;
