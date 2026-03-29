import { z } from 'zod';
import { TaskStatusSchema, TaskPrioritySchema } from './task.schema';
import { SORT_FIELD_VALUES, SORT_DIRECTION_VALUES } from './sort';

export const ListTasksQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  assignee: z.string().optional(),
  sortField: z.enum(SORT_FIELD_VALUES).optional(),
  sortDirection: z.enum(SORT_DIRECTION_VALUES).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListTasksQueryDto = z.infer<typeof ListTasksQuerySchema>;
