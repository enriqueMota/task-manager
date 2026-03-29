import type { UpdateTaskDto } from '@task-manager/shared';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';
import { TaskNotFoundException } from './get-task.use-case.js';

export interface UpdateTaskInput {
  id: string;
  dto: UpdateTaskDto;
}

/**
 * Returns the DTO value if the key was explicitly provided (even if undefined/null),
 * otherwise falls back to the existing value. This allows clearing optional fields.
 */
function resolveField<T>(
  dto: Record<string, unknown>,
  key: string,
  existing: T,
): T | undefined {
  return Object.hasOwn(dto, key) ? (dto[key] as T | undefined) : existing;
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: UpdateTaskInput): Promise<TaskEntity> {
    const existing = await this.taskRepository.findById(input.id);

    if (!existing) {
      throw new TaskNotFoundException(input.id);
    }

    const dtoRecord = input.dto as Record<string, unknown>;

    const rawDueDate = resolveField<string | undefined>(dtoRecord, 'dueDate', existing.dueDate?.toISOString());

    const updated = new TaskEntity({
      id: existing.id,
      title: input.dto.title ?? existing.title,
      description: resolveField(dtoRecord, 'description', existing.description),
      status: input.dto.status ?? existing.status,
      priority: input.dto.priority ?? existing.priority,
      dueDate: rawDueDate ? new Date(rawDueDate) : undefined,
      assignee: resolveField(dtoRecord, 'assignee', existing.assignee),
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    return this.taskRepository.update(updated);
  }
}
