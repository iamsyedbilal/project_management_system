import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import type { Request, Response } from 'express';
import { registerUserService } from '../services/auth.service.js';
import { registerUserValidation } from '../validators/auth.validator.js';
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
