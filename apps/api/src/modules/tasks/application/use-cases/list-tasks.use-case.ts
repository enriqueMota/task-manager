import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type {
  TaskRepository,
  TaskFilters,
  TaskSort,
} from '../../domain/repositories/task.repository.interface.js';

export interface ListTasksInput {
  filters?: TaskFilters;
  sort?: TaskSort;
}

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<TaskEntity[]> {
    return this.taskRepository.findAll(input.filters, input.sort);
  }
}
