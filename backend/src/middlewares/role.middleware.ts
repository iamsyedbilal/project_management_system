import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ProjectMember from '../models/projectMember.model.js';
import type { UserRoleType } from '../utils/constants.js';

export const validateProjectPermission = (roles: UserRoleType[] = []) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, 'Project id is missing');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, 'Invalid project id');
    }

    if (!req.user?._id) {
      throw new ApiError(401, 'Unauthorized');
    }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!projectMember) {
      throw new ApiError(400, 'Project not found');
    }

    const givenRole = projectMember.role;
    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    next();
  });
