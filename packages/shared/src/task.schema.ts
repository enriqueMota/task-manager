import { z } from 'zod';
import { TASK_STATUS_VALUES } from './task-status';
import { TASK_PRIORITY_VALUES } from './task-priority';

export const TaskStatusSchema = z.enum(TASK_STATUS_VALUES);
export const TaskPrioritySchema = z.enum(TASK_PRIORITY_VALUES);

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.preprocess(
    (value) => {
      if (value === undefined || value === null || value === '') return undefined;
      if (typeof value !== 'string') return value;

      const parsedDate = new Date(value);
      if (Number.isNaN(parsedDate.getTime())) return value;

      // Convert local datetime-local string (e.g. 2026-03-28T19:15) to UTC ISO format
      return parsedDate.toISOString();
    },
    z.string().datetime({ offset: true, message: 'dueDate must be a valid ISO date string' }).optional(),
  ),
  assignee: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskIdSchema = z.object({
  id: z.string().uuid('Task id must be a valid UUID'),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type TaskIdDto = z.infer<typeof TaskIdSchema>;
