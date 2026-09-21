import { z } from 'zod';
import { AvailableTasksStatus } from '../utils/constants.js';

export const createTaskValidator = z.object({
  title: z
    .string({ error: 'Title must be a string' })
    .trim()
    .min(1, 'Title is required'),
  description: z
    .string({ error: 'Description must be a string' })
    .trim()
    .optional(),
  assignedTo: z
    .string({ error: 'assignedTo must be a string' })
    .trim()
    .min(1, 'assignedTo cannot be empty')
    .optional(),
  status: z
    .enum(AvailableTasksStatus, {
      error: 'Invalid task status',
    })
    .optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskValidator>;

export const updateTaskValidator = createTaskValidator
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field is required to update the task',
  );

export type UpdateTaskInput = z.infer<typeof updateTaskValidator>;

export const createSubTaskValidator = z.object({
  title: z
    .string({ error: 'Title must be a string' })
    .trim()
    .min(1, 'Subtask title is required'),
  description: z
    .string({ error: 'Description must be a string' })
    .trim()
    .optional(),
  assignedTo: z
    .string({ error: 'assignedTo must be a string' })
    .trim()
    .min(1, 'assignedTo cannot be empty')
    .optional(),
});

export type CreateSubTaskInput = z.infer<typeof createSubTaskValidator>;

export const updateSubTaskValidator = z
  .object({
    title: z
      .string({ error: 'Title must be a string' })
      .trim()
      .min(1, 'Subtask title is required')
      .optional(),
    description: z
      .string({ error: 'Description must be a string' })
      .trim()
      .optional(),
    assignedTo: z
      .string({ error: 'assignedTo must be a string' })
      .trim()
      .min(1, 'assignedTo cannot be empty')
      .optional(),
    isCompleted: z.boolean({ error: 'isCompleted must be a boolean' }).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field is required to update the subtask',
  );

export type UpdateSubTaskInput = z.infer<typeof updateSubTaskValidator>;
