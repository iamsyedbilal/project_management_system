import * as z from 'zod';

export const registerUserValidation = z.object({
  username: z
    .string({
      error: 'Username is required',
    })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),

  email: z.email('Invalid email address'),

  password: z
    .string({
      error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

export type RegisterInput = z.infer<typeof registerUserValidation>;
