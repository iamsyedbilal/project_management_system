import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import type { CookieOptions, Request, Response } from 'express';
import { loginUserService, registerUserService } from '../services/auth.service.js';
import { registerUserValidation, loginUserValidation } from '../validators/auth.validator.js';
import ApiError from '../utils/apiError.js';

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

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const result = loginUserValidation.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
  }

  const { loggedInUser, accessToken, refreshToken } = await loginUserService(result.data);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(200, 'User logged in successfully', {
        user: loggedInUser,
      }),
    );
});
