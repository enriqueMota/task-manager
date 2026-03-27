import { randomUUID } from 'crypto';
import type { CreateTaskDto } from '@task-manager/shared';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';

export interface CreateTaskInput {
  dto: CreateTaskDto;
}

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<TaskEntity> {
    const now = new Date();

    const task = new TaskEntity({
      id: randomUUID(),
      title: input.dto.title,
      description: input.dto.description,
      status: input.dto.status,
      priority: input.dto.priority,
      dueDate: input.dto.dueDate ? new Date(input.dto.dueDate) : undefined,
      assignee: input.dto.assignee,
      createdAt: now,
      updatedAt: now,
    });

    return this.taskRepository.create(task);
  }
}
