import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import type { Request, Response } from 'express';
import {
  addProjectMemberService,
  createProjectService,
  deleteProjectService,
  getProjectDetailsService,
  listProjectMembersService,
  listUserProjectsService,
  removeMemberService,
  updateMemberRoleService,
  updateProjectService,
} from '../services/project.service.js';
import { createProjectValidation } from '../validators/project.validator.js';
import ApiError from '../utils/apiError.js';

// List user projects (secured)
export const listUserProjects = asyncHandler(async (req: Request, res: Response) => {});

// Create project (secured)
export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }
  const result = createProjectValidation.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
  }

  const project = await createProjectService({
    data: result.data,
    userId,
  });

  return res.status(201).json(new ApiResponse(201, 'Project created successfully', project));
});

// Get project details - ADMIN
export const getProjectDetails = asyncHandler(async (req: Request, res: Response) => {});

// Update project  - ADMIN
export const updateProject = asyncHandler(async (req: Request, res: Response) => {});

// Delete project - ADMIN
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {});

// List project members
export const listProjectMembers = asyncHandler(async (req: Request, res: Response) => {});

// Add project member
export const addProjectMember = asyncHandler(async (req: Request, res: Response) => {});

// Update member role - ADMIN
export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {});

// Remove member - ADMIN
export const removeMember = asyncHandler(async (req: Request, res: Response) => {});
