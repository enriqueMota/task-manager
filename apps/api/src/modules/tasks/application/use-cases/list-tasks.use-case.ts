import type { TaskEntity } from '../../domain/entities/task.entity.js';
import type {
  TaskRepository,
  TaskFilters,
  TaskSort,
  PaginatedResult,
} from '../../domain/repositories/task.repository.interface.js';

export interface ListTasksInput {
  filters?: TaskFilters;
  sort?: TaskSort;
  page?: number;
  pageSize?: number;
}

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksInput): Promise<PaginatedResult<TaskEntity>> {
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 10;
    return this.taskRepository.findAll(input.filters, input.sort, {
      page,
      pageSize,
    });
  }
}
