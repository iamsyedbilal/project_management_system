import { z } from 'zod';

export const createTaskValidator = z.object({
	title: z
		.string({ error: 'Title must be a string' })
		.trim()
		.min(1, 'Title is required'),
	description: z.string({ error: 'Description must be a string' }).trim().optional(),
	assignedTo: z
		.string({ error: 'assignedTo must be a string' })
		.trim()
		.min(1, 'assignedTo cannot be empty')
		.optional(),
	status: z
		.enum(['todo', 'in-progress', 'completed'], {
			error: 'Status must be todo, in-progress, or completed',
		})
		.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskValidator>;
