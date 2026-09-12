import mongoose from 'mongoose';
import { AvailableTasksStatus } from '../utils/constants.js';
import type { TaskStatusType } from '../utils/constants.js';

export interface ITaskAttachment {
  url: string;
  mimeType: string;
  size: number;
}

export interface ITask extends mongoose.Document {
  project: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: TaskStatusType;
  attachments: ITaskAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Task title is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
    },
    status: {
      type: String,
      enum: AvailableTasksStatus,
      default: 'todo',
      required: [true, 'Task status is required'],
    },
    attachments: [
      {
        _id: false,
        url: {
          type: String,
          required: true,
        },
        mimeType: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
