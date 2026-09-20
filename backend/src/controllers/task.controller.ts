import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import type { Request, Response } from 'express';
import {
  createSubTaskService,
  deleteSubTaskService,
  getTaskByIdService,
  getTasksService,
  createTaskService,
  deleteTaskService,
  updateSubTaskService,
  updateTaskService,
} from '../services/task.service.js';
import {
  createTaskValidator,
  updateTaskValidator,
} from '../validators/task.validator.js';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }

  const tasks = await getTasksService(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Tasks fetched successfully', tasks));
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!req.user?._id) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = createTaskValidator.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? 'Invalid request data',
    );
  }

  const files = Array.isArray(req.files) ? req.files : [];

  const attachments = files.map((file) => ({
    url: `/images/${file.filename}`,
    mimeType: file.mimetype,
    size: file.size,
  }));

  const task = await createTaskService({
    data: result.data,
    projectId,
    createdBy: req.user._id.toString(),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, 'Task created successfully', task));
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof taskId !== 'string') {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await getTaskByIdService(projectId, taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Task fetched successfully', task));
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof taskId !== 'string') {
    throw new ApiError(400, 'Invalid task ID');
  }

  const result = updateTaskValidator.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? 'Invalid request data',
    );
  }

  const task = await updateTaskService(projectId, taskId, result.data);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Task updated successfully', task));
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {});

export const createSubTask = asyncHandler(async (req: Request, res: Response) => {});

export const updateSubTask = asyncHandler(async (req: Request, res: Response) => {});

export const deleteSubTask = asyncHandler(async (req: Request, res: Response) => {});
