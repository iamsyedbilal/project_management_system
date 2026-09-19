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
