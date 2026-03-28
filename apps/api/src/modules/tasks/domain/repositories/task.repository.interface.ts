import type { TaskEntity } from '../entities/task.entity.js';
import type { TaskPriority, TaskStatus } from '@task-manager/shared';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
}

export interface TaskSort {
  field: 'dueDate' | 'priority' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TaskStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface TaskRepository {
  create(task: TaskEntity): Promise<TaskEntity>;
  findById(id: string): Promise<TaskEntity | null>;
  findAll(
    filters?: TaskFilters,
    sort?: TaskSort,
    pagination?: PaginationParams,
  ): Promise<PaginatedResult<TaskEntity>>;
  update(task: TaskEntity): Promise<TaskEntity>;
  delete(id: string): Promise<void>;
  getStats(): Promise<TaskStats>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
