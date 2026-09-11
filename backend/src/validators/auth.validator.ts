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

export const loginUserValidation = z.object({
  identifier: z
    .string({
      error: 'Username or email is required',
    })
    .trim()
    .min(1, 'Username or email is required'),

  password: z
    .string({
      error: 'Password is required',
    })
    .min(1, 'Password is required'),
});

export const forgotPasswordValidation = z.object({
  email: z.email('Invalid email address'),
});

export const resetForgotPasswordValidation = z
  .object({
    password: z
      .string({
        error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password cannot exceed 100 characters'),

    confirmPassword: z.string({
      error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changeCurrentPasswordValidation = z
  .object({
    currentPassword: z.string({
      error: 'Current password is required',
    }),

    newPassword: z
      .string({
        error: 'New password is required',
      })
      .min(8, 'New password must be at least 8 characters')
      .max(100, 'New password cannot exceed 100 characters'),

    confirmPassword: z.string({
      error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginUserValidation>;
export type RegisterInput = z.infer<typeof registerUserValidation>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordValidation>;
export type ResetForgotPasswordInput = z.infer<typeof resetForgotPasswordValidation>;
export type ChangeCurrentPasswordInput = z.infer<typeof changeCurrentPasswordValidation>;
