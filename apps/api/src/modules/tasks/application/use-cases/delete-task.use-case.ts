import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';
import { TaskNotFoundException } from './get-task.use-case.js';

export interface DeleteTaskInput {
  id: string;
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    const existing = await this.taskRepository.findById(input.id);

    if (!existing) {
      throw new TaskNotFoundException(input.id);
    }

    await this.taskRepository.delete(input.id);
  }
}
