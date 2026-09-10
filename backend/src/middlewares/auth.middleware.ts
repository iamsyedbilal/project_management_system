import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

interface AccessTokenPayload {
  _id: string;
  email: string;
  username: string;
}

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized Request');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
    const user = await User.findById(decoded?._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry',
    );

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, 'Invalid access token'));
  }
});
