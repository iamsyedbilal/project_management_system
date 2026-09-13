import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import type { UserRoleType } from '../utils/constants.js';

export const authorizeRoles = (...allowedRoles: UserRoleType[]) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    next();
  });
