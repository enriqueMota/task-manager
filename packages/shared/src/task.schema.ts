import { z } from 'zod';
import { TASK_STATUS_VALUES } from './task-status.js';
import { TASK_PRIORITY_VALUES } from './task-priority.js';

export const TaskStatusSchema = z.enum(TASK_STATUS_VALUES);
export const TaskPrioritySchema = z.enum(TASK_PRIORITY_VALUES);

export const CreateTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be at most 100 characters'),
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  dueDate: z.string().datetime({ message: 'dueDate must be a valid ISO date string' }).optional(),
  assignee: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskIdSchema = z.object({
  id: z.string().uuid('Task id must be a valid UUID'),
});

export type CreateTaskDto = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDto = z.infer<typeof UpdateTaskSchema>;
export type TaskIdDto = z.infer<typeof TaskIdSchema>;
