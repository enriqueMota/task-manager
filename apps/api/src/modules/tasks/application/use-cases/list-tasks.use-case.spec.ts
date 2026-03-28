import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListTasksUseCase } from './list-tasks.use-case.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';
import { TaskEntity } from '../../domain/entities/task.entity.js';

const makeMockRepo = (): TaskRepository => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
});

const makeTask = (id: string): TaskEntity =>
  new TaskEntity({
    id,
    title: `Task ${id}`,
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

describe('ListTasksUseCase', () => {
  let repo: TaskRepository;
  let useCase: ListTasksUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new ListTasksUseCase(repo);
  });

  it('returns all tasks when no filters provided', async () => {
    const tasks = [makeTask('1'), makeTask('2')];
    vi.mocked(repo.findAll).mockResolvedValue({
      items: tasks,
      total: 2,
      page: 1,
      pageSize: 10,
    });

    const result = await useCase.execute({});

    expect(result.items).toHaveLength(2);
    expect(repo.findAll).toHaveBeenCalledWith(undefined, undefined, { page: 1, pageSize: 10 });
  });

  it('passes filters and sort to the repository', async () => {
    vi.mocked(repo.findAll).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });
    const filters = { status: 'completed' as const };
    const sort = { field: 'createdAt' as const, direction: 'asc' as const };

    await useCase.execute({ filters, sort });

    expect(repo.findAll).toHaveBeenCalledWith(filters, sort, { page: 1, pageSize: 10 });
  });

  it('returns empty array when no tasks exist', async () => {
    vi.mocked(repo.findAll).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    const result = await useCase.execute({});

    expect(result.items).toEqual([]);
  });
});
