import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import ProjectMember from '../models/projectMember.model.js';
import Task from '../models/task.model.js';
import ApiError from '../utils/apiError.js';
import type { CreateTaskInput } from '../validators/task.validator.js';
import type { ITaskAttachment } from '../models/task.model.js';

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

export const createTaskService = async (params: {
  data: CreateTaskInput;
  projectId: string;
  createdBy: string;
  attachments: ITaskAttachment[];
}) => {
  const { data, projectId, createdBy, attachments } = params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  let assignedTo: mongoose.Types.ObjectId | undefined;

  if (data.assignedTo) {
    if (!mongoose.Types.ObjectId.isValid(data.assignedTo)) {
      throw new ApiError(400, 'Invalid assignee ID');
    }

    const projectMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(data.assignedTo),
    });

    if (!projectMember) {
      throw new ApiError(
        400,
        'Assigned user is not a member of this project',
      );
    }

    assignedTo = new mongoose.Types.ObjectId(data.assignedTo);
  }

  const task = await Task.create({
    project: new mongoose.Types.ObjectId(projectId),
    title: data.title,
    createdBy: new mongoose.Types.ObjectId(createdBy),
    attachments,
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(assignedTo !== undefined ? { assignedTo } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
  });

  return task;
};

export const getTaskByIdService = async (
  projectId: string,
  taskId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate('assignedTo', 'avatar username fullName')
    .populate('createdBy', 'avatar username fullName');

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const updateTaskService = async () => {};

export const deleteTaskService = async () => {};

export const createSubTaskService = async () => {};

export const updateSubTaskService = async () => {};

export const deleteSubTaskService = async () => {};
