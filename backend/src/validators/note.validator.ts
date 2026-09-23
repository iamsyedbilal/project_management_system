import { z } from 'zod';

export const createNoteValidator = z.object({
  title: z
    .string({ error: 'Title must be a string' })
    .trim()
    .min(1, 'Note title is required'),
  content: z
    .string({ error: 'Content must be a string' })
    .trim()
    .min(1, 'Note content is required'),
});

export type CreateNoteInput = z.infer<typeof createNoteValidator>;

export const updateNoteValidator = createNoteValidator
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    'At least one field is required to update the note',
  );

export type UpdateNoteInput = z.infer<typeof updateNoteValidator>;
