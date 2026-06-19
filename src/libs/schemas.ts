import { z } from 'zod';


export const taskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required') 
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .trim(),
});


export type TaskFormValues = z.infer<typeof taskFormSchema>;
