import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';

export interface DeleteTaskInput {
  id: string;
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    await this.taskRepository.delete(input.id);
  }
}
