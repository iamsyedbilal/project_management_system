import express from 'express';
import {
  changeCurrentPassword,
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

router.route('/resend-email-verification').post(resendEmailVerification);

router.route('/forgot-password').post(forgotPasswordRequest);

router.route('/reset-password/:resetToken').post(resetForgotPassword);

router.route('/change-password').post(verifyJWT, changeCurrentPassword);

export default router;
