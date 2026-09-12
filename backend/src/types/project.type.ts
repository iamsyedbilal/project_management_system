import type mongoose from 'mongoose';
import type { CreateProjectInput } from '../validators/project.validator.js';

export interface CreateProjectServiceParams {
  data: CreateProjectInput;
  userId: mongoose.Types.ObjectId | string;
}
