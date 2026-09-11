import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import type { Request, Response } from 'express';
import {
  changeCurrentPasswordService,
  forgotPasswordRequestService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
  resendEmailVerificationService,
  resetForgotPasswordService,
  verifyEmailService,
} from '../services/auth.service.js';
import {
  registerUserValidation,
  loginUserValidation,
  forgotPasswordValidation,
  resetForgotPasswordValidation,
  changeCurrentPasswordValidation,
  resendEmailVerificationValidation,
} from '../validators/auth.validator.js';
import ApiError from '../utils/apiError.js';
import {
  accessTokenCookieOptions,
  clearCookieOptions,
  refreshTokenCookieOptions,
} from '../utils/cookies.js';

// User register
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const result = registerUserValidation.safeParse(req.body);
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
  }

  const createdUser = await registerUserService(result.data, baseUrl);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        'User registered successfully and verification email has been sent on your email',
        createdUser,
      ),
    );
});

// Login User
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = loginUserValidation.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
  }

  const { loggedInUser, accessToken, refreshToken } = await loginUserService(result.data);

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', refreshToken, refreshTokenCookieOptions)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: loggedInUser,
      }),
    );
});

// Logout the authenticated user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUserService(req.user!._id.toString());

  return res
    .status(200)
    .clearCookie('accessToken', clearCookieOptions)
    .clearCookie('refreshToken', clearCookieOptions)
    .json(new ApiResponse(200, 'User logged out successfully', null));
});

// Refresh access token
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshAccessTokenService(refreshToken);

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenCookieOptions)
    .cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions)
    .json(new ApiResponse(200, 'Access token refreshed successfully'));
});

// Verify Email
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.params;

  if (typeof verificationToken !== 'string') {
    throw new ApiError(400, 'Invalid verification token');
  }

  await verifyEmailService(verificationToken);

  return res.status(200).json(
    new ApiResponse(
      200,

      'Email is verified',
      {
        isEmailVerified: true,
      },
    ),
  );
});

// Resend Email Verification
export const resendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
  const result = resendEmailVerificationValidation.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  await resendEmailVerificationService(baseUrl, result.data.email);

  return res.status(200).json(new ApiResponse(200, 'Mail has been sent to your email ID', {}));
});

// Forgot Password Request
export const forgotPasswordRequest = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const validatedData = forgotPasswordValidation.safeParse({
    email,
  });

  if (!validatedData.success) {
    throw new ApiError(400, validatedData.error.issues[0]?.message ?? 'Invalid request data');
  }

  await forgotPasswordRequestService(validatedData.data.email);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        'If an account exists for this email, a password reset link has been sent.',
        {},
      ),
    );
});

// Reset Forgot Password
export const resetForgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { resetToken } = req.params;

  if (typeof resetToken !== 'string') {
    throw new ApiError(400, 'Invalid reset token');
  }

  const { password, confirmPassword } = req.body;
  const validateForgotData = resetForgotPasswordValidation.safeParse({
    password,
    confirmPassword,
  });

  if (!validateForgotData.success) {
    throw new ApiError(400, validateForgotData.error.issues[0]?.message ?? 'Invalid request data');
  }

  await resetForgotPasswordService({
    resetToken,
    ...validateForgotData.data,
  });

  return res.status(200).json(new ApiResponse(200, 'Password reset successfully', {}));
});

// Change Current Password
export const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const changePasswordValidationData = changeCurrentPasswordValidation.safeParse({
    currentPassword,
    newPassword,
    confirmPassword,
  });

  if (!changePasswordValidationData.success) {
    throw new ApiError(
      400,
      changePasswordValidationData.error.issues[0]?.message ?? 'Invalid request data',
    );
  }

  await changeCurrentPasswordService({
    userId: req.user._id.toString(),
    currentPassword: changePasswordValidationData.data.currentPassword,
    newPassword: changePasswordValidationData.data.newPassword,
  });

  return res.status(200).json(new ApiResponse(200, 'Password changed successfully', {}));
});
