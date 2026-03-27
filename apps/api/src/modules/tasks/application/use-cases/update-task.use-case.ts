import type { UpdateTaskDto } from '@task-manager/shared';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';
import { TaskNotFoundException } from './get-task.use-case.js';

export interface UpdateTaskInput {
  id: string;
  dto: UpdateTaskDto;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(input.id);

    if (!existing) {
      throw new TaskNotFoundException(input.id);
    }

    const updated = new TaskEntity({
      id: existing.id,
      title: input.dto.title ?? existing.title,
      description: input.dto.description ?? existing.description,
      status: input.dto.status ?? existing.status,
      priority: input.dto.priority ?? existing.priority,
      dueDate: input.dto.dueDate
        ? new Date(input.dto.dueDate)
        : existing.dueDate,
      assignee: input.dto.assignee ?? existing.assignee,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.taskRepository.update(updated);
  }
}
