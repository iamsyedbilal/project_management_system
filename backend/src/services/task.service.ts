import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import Task from '../models/task.model.js';
import ApiError from '../utils/apiError.js';

export const getTasksService = async (projectId: string) => {
  
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate('assignedTo', 'avatar username fullName');

  return tasks;
};

export const createTaskService = async (_params: {
  data: Record<string, unknown>;
  projectId: string;
}) => {};

export const getTaskByIdService = async () => {};

export const updateTaskService = async () => {};

export const deleteTaskService = async () => {};

export const createSubTaskService = async () => {};

export const updateSubTaskService = async () => {};

export const deleteSubTaskService = async () => {};
