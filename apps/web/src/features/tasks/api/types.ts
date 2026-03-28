import type { TaskPriority, TaskStatus } from '@task-manager/shared';

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStatsResponse {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}

export interface ListTasksParams {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginatedTaskResponse {
  items: TaskResponse[];
  total: number;
  page: number;
  pageSize: number;
}
