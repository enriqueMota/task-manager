import { ApiProperty } from '@nestjs/swagger';
import type { TaskStatus, TaskPriority } from '@task-manager/shared';
import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskStats } from '../../domain/repositories/task.repository.interface.js';

export class TaskResponseDto {
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty({ required: false })
  description?: string;
  @ApiProperty({ enum: ['pending', 'in-progress', 'completed'] })
  status: TaskStatus;
  @ApiProperty({ enum: ['low', 'medium', 'high'] })
  priority: TaskPriority;
  @ApiProperty({ required: false, nullable: true })
  dueDate?: string;
  @ApiProperty({ required: false })
  assignee?: string;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
}

export class TaskStatsResponseDto {
  @ApiProperty()
  total: number;
  @ApiProperty({ type: Object, additionalProperties: { type: 'number' } })
  byStatus: Record<string, number>;
  @ApiProperty({ type: Object, additionalProperties: { type: 'number' } })
  byPriority: Record<string, number>;
}

export class PaginatedTaskResponseDto {
  @ApiProperty({ type: [TaskResponseDto] })
  items: TaskResponseDto[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
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
    total: stats.total,
    byStatus: stats.byStatus,
    byPriority: stats.byPriority,
  };
}
