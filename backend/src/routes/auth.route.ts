import express from 'express';
import {
  forgotPasswordRequest,
  loginUser,
  logout,
  registerUser,
  resendEmailVerification,
  resetForgotPassword,
  verifyEmail,
} from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logout);

router.route('/verify-email/:verificationToken').get(verifyEmail);

router.route('/resend-email-verification').post(verifyJWT, resendEmailVerification);

router.route('/forgot-password').post(forgotPasswordRequest);

router.route('/reset-password/:reset-token').post(resetForgotPassword);

export default router;
