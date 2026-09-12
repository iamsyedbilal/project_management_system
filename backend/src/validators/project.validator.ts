import * as z from 'zod';

export const createProjectValidation = z.object({
  name: z
    .string({
      error: 'Project name is required',
    })
    .trim(),

  description: z.string().trim().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectValidation>;
