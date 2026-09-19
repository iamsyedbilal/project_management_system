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
import { createTaskValidator } from '../validators/task.validator.js';

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  if (typeof projectId !== 'string') {
    throw new ApiError(400, 'Invalid project ID');
  }
  const tasks = await getTasksService(projectId);

  return res.status(201).json(new ApiResponse(201, 'Task fetched successfully', tasks));
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    if (typeof projectId !== 'string') {
      throw new ApiError(400, 'Invalid project ID');
    }
    
    const result = createTaskValidator.safeParse(req.body)

    if (!result.success) {
        throw new ApiError(400, result.error.issues[0]?.message ?? 'Invalid request data');
      }

      await createTaskService({
        data:result.data,
        projectId
      })

});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {});

export const createSubTask = asyncHandler(async (req: Request, res: Response) => {});

export const updateSubTask = asyncHandler(async (req: Request, res: Response) => {});

export const deleteSubTask = asyncHandler(async (req: Request, res: Response) => {});
