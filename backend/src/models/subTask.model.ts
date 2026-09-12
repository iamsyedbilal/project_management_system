import mongoose from 'mongoose';

export interface ISubTask extends mongoose.Document {
  task: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subTaskSchema = new mongoose.Schema<ISubTask>(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task is required'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Subtask title is required'],
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
      required: [true, 'Subtask creator is required'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const SubTask = mongoose.model<ISubTask>('SubTask', subTaskSchema);

export default SubTask;
