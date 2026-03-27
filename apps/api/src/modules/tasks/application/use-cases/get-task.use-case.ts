import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';

export class TaskNotFoundException extends Error {
  constructor(id: string) {
    super(`Task with id "${id}" was not found`);
    this.name = 'TaskNotFoundException';
  }
}

export interface GetTaskInput {
  id: string;
}

export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: GetTaskInput): Promise<TaskEntity> {
    const task = await this.taskRepository.findById(input.id);

    if (!task) {
      throw new TaskNotFoundException(input.id);
    }

    return task;
  }
}
