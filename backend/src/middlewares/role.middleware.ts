import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ProjectMember from '../models/projectMember.model.js';
import { UserRole } from '../utils/constants.js';
import type { UserRoleType } from '../utils/constants.js';


export const validateProjectPermission = (roles: UserRoleType[] = []) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    if (!projectId || typeof projectId !== 'string') {
      throw new ApiError(400, 'Project id is missing');
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, 'Invalid project id');
    }

    if (!req.user?._id) {
      throw new ApiError(401, 'Unauthorized');
    }

    // Global admins have access to every project.
    if (req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });

    if (!projectMember) {
      throw new ApiError(404, 'Project not found');
    }

    const projectRole = projectMember.role;

    if (roles.length > 0 && !roles.includes(projectRole)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    next();
  });

  export const authorizeRoles = (roles: UserRoleType[] = []) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      throw new ApiError(403, 'You do not have permission to perform this action');
    }

    next();
  });