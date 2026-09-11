import express from 'express';
import {
  loginUser,
  logout,
  registerUser,
  resendEmailVerification,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logout);

router.route('/verify-email/:verificationToken').get(verifyEmail);

router.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);

export default router;
