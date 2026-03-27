import type {
  TaskRepository,
  TaskStats,
} from '../../domain/repositories/task.repository.interface.js';

export class GetTaskStatsUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<TaskStats> {
    return this.taskRepository.getStats();
  }
}
