import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import type { CookieOptions, Request, Response } from 'express';
import {
  forgotPasswordRequestService,
  loginUserService,
  logoutUserService,
  refreshAccessTokenService,
  registerUserService,
  resendEmailVerificationService,
  verifyEmailService,
} from '../services/auth.service.js';
import {
  registerUserValidation,
  loginUserValidation,
  forgotPasswordValidation,
} from '../validators/auth.validator.js';
import ApiError from '../utils/apiError.js';

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

  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenOptions)
    .cookie('refreshToken', refreshTokenOptions)
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: loggedInUser,
      }),
    );
});

// Logout the authenticated user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUserService(req.user!._id.toString());

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
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

  const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, accessTokenOptions)
    .cookie('refreshToken', newRefreshToken, refreshTokenOptions)
    .json(new ApiResponse(200, 'Access token refreshed successfully'));
});

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

export const resendEmailVerification = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const userId = req.user._id.toString();
  await resendEmailVerificationService(baseUrl, userId);

  return res.status(200).json(new ApiResponse(200, 'Mail has been sent to your email ID', {}));
});

export const forgotPasswordRequest = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const forgotValidation = forgotPasswordValidation.safeParse(email);

  if (!forgotValidation.success) {
    throw new ApiError(400, forgotValidation.error.issues[0]?.message ?? 'Invalid request data');
  }

  await forgotPasswordRequestService(forgotValidation.data.email);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Password reset mail has been sent on your mail id', {}));
});
