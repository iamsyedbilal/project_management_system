import mongoose from 'mongoose';
import Project from '../models/project.model.js';
import ProjectMember from '../models/projectMember.model.js';
import SubTask from '../models/subTask.model.js';
import { UserRole, type UserRoleType } from '../utils/constants.js';
import type { CreateSubTaskInput, UpdateSubTaskInput } from '../validators/task.validator.js';
import Task from '../models/task.model.js';
import ApiError from '../utils/apiError.js';
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from '../validators/task.validator.js';
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

export const updateTaskService = async (
  projectId: string,
  taskId: string,
  data: UpdateTaskInput,
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
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  let assignedTo: mongoose.Types.ObjectId | undefined;

  if (data.assignedTo !== undefined) {
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

  const updateData = {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(assignedTo !== undefined ? { assignedTo } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
  };

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(taskId),
      project: new mongoose.Types.ObjectId(projectId),
    },
    { $set: updateData },
    { new: true, runValidators: true },
  )
    .populate('assignedTo', 'avatar username fullName')
    .populate('createdBy', 'avatar username fullName');

  if (!updatedTask) {
    throw new ApiError(404, 'Task not found');
  }

  return updatedTask;
};

export const deleteTaskService = async (
  projectId: string,
  taskId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  const task = await Task.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  return task;
};

export const createSubTaskService = async (params: {
  data: CreateSubTaskInput;
  projectId: string;
  taskId: string;
  createdBy: string;
}) => {
  const { data, projectId, taskId, createdBy } = params;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, 'Invalid task ID');
  }

  if (!mongoose.Types.ObjectId.isValid(createdBy)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
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

  const subTask = await SubTask.create({
    task: new mongoose.Types.ObjectId(taskId),
    title: data.title,
    createdBy: new mongoose.Types.ObjectId(createdBy),
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(assignedTo !== undefined ? { assignedTo } : {}),
  });

  return SubTask.findById(subTask._id)
    .populate('assignedTo', 'avatar username fullName')
    .populate('createdBy', 'avatar username fullName');
};

export const updateSubTaskService = async (
  projectId: string,
  subTaskId: string,
  userId: string,
  userRole: UserRoleType,
  data: UpdateSubTaskInput,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new ApiError(400, 'Invalid subtask ID');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const subTask = await SubTask.findById(subTaskId);

  if (!subTask) {
    throw new ApiError(404, 'Subtask not found');
  }

  const task = await Task.findOne({
    _id: subTask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, 'Subtask not found');
  }

  const projectMember = await ProjectMember.findOne({
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  const isGlobalAdmin = userRole === UserRole.ADMIN;

  const isProjectAdmin =
    projectMember?.role === UserRole.PROJECT_ADMIN ||
    projectMember?.role === UserRole.ADMIN;

  const canManageSubTask = isGlobalAdmin || isProjectAdmin;

  if (!canManageSubTask) {
    if (
      data.title !== undefined ||
      data.description !== undefined ||
      data.assignedTo !== undefined
    ) {
      throw new ApiError(
        403,
        'You do not have permission to update this subtask',
      );
    }
  }

  let assignedTo: mongoose.Types.ObjectId | undefined;

  if (data.assignedTo !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(data.assignedTo)) {
      throw new ApiError(400, 'Invalid assignee ID');
    }

    const assignedMember = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(data.assignedTo),
    });

    if (!assignedMember) {
      throw new ApiError(
        400,
        'Assigned user is not a member of this project',
      );
    }

    assignedTo = new mongoose.Types.ObjectId(data.assignedTo);
  }

  const updateData = {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined
      ? { description: data.description }
      : {}),
    ...(assignedTo !== undefined ? { assignedTo } : {}),
    ...(data.isCompleted !== undefined
      ? { isCompleted: data.isCompleted }
      : {}),
  };

  const updateQuery: Record<string, unknown> = {
    $set: updateData,
  };

  if (data.isCompleted === true) {
    updateQuery.$set = {
      ...updateData,
      completedAt: new Date(),
    };
  }

  if (data.isCompleted === false) {
    updateQuery.$unset = {
      completedAt: '',
    };
  }

  const updatedSubTask = await SubTask.findByIdAndUpdate(
    subTaskId,
    updateQuery,
    {
      new: true,
      runValidators: true,
    },
  )
    .populate('assignedTo', 'avatar username fullName')
    .populate('createdBy', 'avatar username fullName');

  if (!updatedSubTask) {
    throw new ApiError(404, 'Subtask not found');
  }

  return updatedSubTask;
};

export const deleteSubTaskService = async (
  projectId: string,
  subTaskId: string,
) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  if (!mongoose.Types.ObjectId.isValid(subTaskId)) {
    throw new ApiError(400, 'Invalid subtask ID');
  }

  const subTask = await SubTask.findById(subTaskId);

  if (!subTask) {
    throw new ApiError(404, 'Subtask not found');
  }

  const task = await Task.findOne({
    _id: subTask.task,
    project: new mongoose.Types.ObjectId(projectId),
  });

  if (!task) {
    throw new ApiError(404, 'Subtask not found');
  }

  await SubTask.findByIdAndDelete(subTaskId);

  return null;
};
