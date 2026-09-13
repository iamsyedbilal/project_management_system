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
export const getProjectDetails = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  const project = await getProjectDetailsService(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Project details fetched successfully', project));
});

// Update project  - ADMIN
export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  const updatedProject = await updateProjectService(projectId, { name, description });

  return res.status(200).json(new ApiResponse(200, 'Project updated successfully', updatedProject));
});

// Delete project - ADMIN
export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  await deleteProjectService(projectId);

  return res.status(200).json(new ApiResponse(200, 'Project deleted successfully'));
});

// List project members
export const listProjectMembers = asyncHandler(async (req: Request, res: Response) => {});

// Add project member
export const addProjectMember = asyncHandler(async (req: Request, res: Response) => {});

// Update member role - ADMIN
export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {});

// Remove member - ADMIN
export const removeMember = asyncHandler(async (req: Request, res: Response) => {});
