import mongoose from 'mongoose';
import { UserRole, UserRoleType } from '../utils/constants.js';

export interface IProjectMember extends mongoose.Document {
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  role: UserRoleType;
  createdAt: Date;
  updatedAt: Date;
}

const projectMemberSchema = new mongoose.Schema<IProjectMember>(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.MEMBER,
      required: [true, 'Member role is required'],
    },
  },
  { timestamps: true },
);

projectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

const ProjectMember = mongoose.model<IProjectMember>('ProjectMember', projectMemberSchema);

export default ProjectMember;
