import * as z from 'zod';
import { AvailableUserRole } from '../utils/constants.js';

export const createProjectValidation = z.object({
  name: z
    .string({
      error: 'Project name is required',
    })
    .trim()
    .min(1, 'Project name is required'),

  description: z.string().trim().optional(),
});

export const updateProjectValidation = z
  .object({
    name: z.string().trim().min(1, 'Project name cannot be empty').optional(),
    description: z.string().trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'At least one field is required to update the project',
  });

export const addProjectMemberValidation = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export const updateMemberRoleValidation = z.object({
  role: z.enum(AvailableUserRole),
});

export type CreateProjectInput = z.infer<typeof createProjectValidation>;
export type UpdateProjectInput = z.infer<typeof updateProjectValidation>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberValidation>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleValidation>;
