import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string({ error: 'Title is required' }).min(1, { error: 'Title too short' }),
  content: z.string({ error: 'Title is required' }).min(1, { error: 'Content too short' }),
});

export type NoteInput = z.infer<typeof noteSchema>;

export type Note = NoteInput & {
  noteId: string;
  userId: string;
  createdAt: string;
};
