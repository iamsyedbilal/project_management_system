import mongoose from 'mongoose';

export interface IProject extends mongoose.Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Project name is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
  },
  { timestamps: true },
);

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
