import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TaskStatus, TaskPriority } from '@task-manager/shared';
import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskStats } from '../../domain/repositories/task.repository.interface.js';

// ─── Response DTOs ───────────────────────────────────────────────────────────

export class TaskResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Unique identifier for the task',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'Title of the task (3–100 characters)',
    example: 'Finish quarterly report',
    minLength: 3,
    maxLength: 100,
  })
  title: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Detailed description of the task (max 500 characters)',
    example: 'Summarize Q1 metrics and prepare charts for the board meeting',
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'Current status of the task',
    enum: ['pending', 'in-progress', 'completed'],
    example: 'pending',
  })
  status: TaskStatus;

  @ApiProperty({
    type: 'string',
    description: 'Priority level of the task',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  priority: TaskPriority;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Due date in ISO 8601 format',
    example: '2026-04-01T15:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  dueDate?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Name of the person assigned to this task',
    example: 'John Doe',
  })
  assignee?: string;

  @ApiProperty({
    type: 'string',
    description: 'Timestamp when the task was created (ISO 8601)',
    example: '2026-03-15T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    type: 'string',
    description: 'Timestamp when the task was last updated (ISO 8601)',
    example: '2026-03-20T14:45:00.000Z',
    format: 'date-time',
  })
  updatedAt: string;
}

export class TaskStatsResponseDto {
  @ApiProperty({
    type: 'integer',
    description: 'Total number of tasks in the system',
    example: 20,
  })
  total: number;

  @ApiProperty({
    type: 'object',
    description:
      'Count of tasks grouped by status (pending | in-progress | completed)',
    additionalProperties: { type: 'integer' },
    example: { pending: 5, 'in-progress': 3, completed: 12 },
  })
  byStatus: Record<string, number>;

  @ApiProperty({
    type: 'object',
    description: 'Count of tasks grouped by priority (low | medium | high)',
    additionalProperties: { type: 'integer' },
    example: { low: 4, medium: 8, high: 8 },
  })
  byPriority: Record<string, number>;
}

export class PaginationMetaDto {
  @ApiProperty({
    type: 'integer',
    description: 'Total number of items matching the query',
    example: 42,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    type: 'integer',
    description: 'Current page number (1-indexed)',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    type: 'integer',
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  pageSize: number;
}

export class PaginatedTaskResponseDto extends PaginationMetaDto {
  @ApiProperty({
    type: 'array',
    items: { $ref: '#/components/schemas/TaskResponseDto' },
    description: 'Array of task items for the current page',
  })
  items: TaskResponseDto[];
}

// ─── Request DTOs ────────────────────────────────────────────────────────────

export class CreateTaskRequestDto {
  @ApiProperty({
    type: 'string',
    description: 'Title of the task (3–100 characters)',
    example: 'Finish quarterly report',
    minLength: 3,
    maxLength: 100,
  })
  title: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Detailed description (max 500 characters)',
    example: 'Summarize Q1 metrics and prepare charts for the board meeting',
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    description: 'Initial status of the task',
    enum: ['pending', 'in-progress', 'completed'],
    example: 'pending',
  })
  status: string;

  @ApiProperty({
    type: 'string',
    description: 'Priority level of the task',
    enum: ['low', 'medium', 'high'],
    example: 'medium',
  })
  priority: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Due date in ISO 8601 date-time format',
    example: '2026-04-01T15:00:00.000Z',
    format: 'date-time',
  })
  dueDate?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Name of the person to assign the task to',
    example: 'John Doe',
  })
  assignee?: string;
}

export class UpdateTaskRequestDto {
  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated title (3–100 characters)',
    example: 'Finish quarterly report — final version',
    minLength: 3,
    maxLength: 100,
  })
  title?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated description (max 500 characters)',
    example: 'Include revised Q1 charts and executive summary',
    maxLength: 500,
  })
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated status',
    enum: ['pending', 'in-progress', 'completed'],
    example: 'in-progress',
  })
  status?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated priority level',
    enum: ['low', 'medium', 'high'],
    example: 'high',
  })
  priority?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated due date in ISO 8601 date-time format',
    example: '2026-04-05T18:00:00.000Z',
    format: 'date-time',
  })
  dueDate?: string;

  @ApiPropertyOptional({
    type: 'string',
    description: 'Updated assignee name',
    example: 'Jane Doe',
  })
  assignee?: string;
}

// ─── Error Response DTOs ─────────────────────────────────────────────────────

export class ValidationErrorDetail {
  @ApiProperty({
    type: 'string',
    description: 'Dot-notation path to the invalid field',
    example: 'title',
  })
  path: string;

  @ApiProperty({
    type: 'string',
    description: 'Human-readable error message for this field',
    example: 'String must contain at least 3 character(s)',
  })
  message: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    type: 'integer',
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    description: 'Error summary',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    type: 'array',
    items: { $ref: '#/components/schemas/ValidationErrorDetail' },
    description: 'List of per-field validation errors',
  })
  errors: ValidationErrorDetail[];
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    type: 'integer',
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    description: 'Error message describing what was not found',
    example:
      'Task with id "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" was not found',
  })
  message: string;
}

export class InternalServerErrorResponseDto {
  @ApiProperty({
    type: 'integer',
    description: 'HTTP status code',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    type: 'string',
    description: 'Error message',
    example: 'Internal server error',
  })
  message: string;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

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
