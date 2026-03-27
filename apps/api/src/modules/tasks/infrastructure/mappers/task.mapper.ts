import type { Task as PrismaTask } from '../../../../generated/prisma/index.js';
import type { Prisma } from '../../../../generated/prisma/index.js';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskPriority, TaskStatus } from '@task-manager/shared';

export class TaskMapper {
  static toDomain(record: PrismaTask): TaskEntity {
    return new TaskEntity({
      id: record.id,
      title: record.title,
      description: record.description ?? undefined,

      status: record.status as TaskStatus,

      priority: record.priority as TaskPriority,
      dueDate: record.dueDate ?? undefined,
      assignee: record.assignee ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toCreateInput(task: TaskEntity): Prisma.TaskCreateInput {
    return {
      id: task.id,
      title: task.title,
      description: task.description,

      status: task.status,

      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
    };
  }

  static toUpdateInput(task: TaskEntity): Prisma.TaskUpdateInput {
    return {
      title: task.title,
      description: task.description,

      status: task.status,

      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
    };
  }
}
