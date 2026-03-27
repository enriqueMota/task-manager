import type { TaskStatus, TaskPriority } from '@task-manager/shared';
import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskStats } from '../../domain/repositories/task.repository.interface.js';

export interface TaskResponseDto {
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

export interface TaskStatsResponseDto {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
}

export function toTaskResponseDto(entity: TaskEntity): TaskResponseDto {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    status: entity.status,
    priority: entity.priority,
    dueDate: entity.dueDate?.toISOString(),
    assignee: entity.assignee,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toTaskStatsResponseDto(stats: TaskStats): TaskStatsResponseDto {
  return {
    byStatus: stats.byStatus,
    byPriority: stats.byPriority,
  };
}
