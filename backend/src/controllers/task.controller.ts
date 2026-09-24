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
  createSubTaskValidator,
  createTaskValidator,
  updateSubTaskValidator,
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

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof taskId !== 'string') {
    throw new ApiError(400, 'Invalid task ID');
  }

  await deleteTaskService(projectId, taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Task deleted successfully', null));
});

export const createSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, taskId } = req.params;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof taskId !== 'string' || !taskId) {
    throw new ApiError(400, 'Invalid task ID');
  }

  if (!req.user?._id) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = createSubTaskValidator.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? 'Invalid request data',
    );
  }

  const subTask = await createSubTaskService({
    data: result.data,
    projectId,
    taskId,
    createdBy: req.user._id.toString(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, 'Subtask created successfully', subTask));
});

export const updateSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, subTaskId } = req.params;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof subTaskId !== 'string' || !subTaskId) {
    throw new ApiError(400, 'Invalid subtask ID');
  }

  if (!req.user?._id) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = updateSubTaskValidator.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? 'Invalid request data',
    );
  }

  const subTask = await updateSubTaskService(
    projectId,
    subTaskId,
    req.user._id.toString(),
    req.user.role,
    result.data,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 'Subtask updated successfully', subTask));
});

export const deleteSubTask = asyncHandler(async (req: Request, res: Response) => {
  const { projectId, subTaskId } = req.params;

  if (typeof projectId !== 'string' || !projectId) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (typeof subTaskId !== 'string' || !subTaskId) {
    throw new ApiError(400, 'Invalid subtask ID');
  }

  await deleteSubTaskService(projectId, subTaskId);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Subtask deleted successfully', null));
});
