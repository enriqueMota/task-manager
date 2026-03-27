import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTaskUseCase, TaskNotFoundException } from './get-task.use-case.js';
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

const makeTask = (): TaskEntity =>
  new TaskEntity({
    id: 'uuid-1',
    title: 'Test task',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

describe('GetTaskUseCase', () => {
  let repo: TaskRepository;
  let useCase: GetTaskUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new GetTaskUseCase(repo);
  });

  it('returns the task when found', async () => {
    const task = makeTask();
    vi.mocked(repo.findById).mockResolvedValue(task);

    const result = await useCase.execute({ id: 'uuid-1' });

    expect(result).toBe(task);
    expect(repo.findById).toHaveBeenCalledWith('uuid-1');
  });

  it('throws TaskNotFoundException when task does not exist', async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing-id' })).rejects.toThrow(
      TaskNotFoundException,
    );
  });

  it('exception message includes the task id', async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'abc-123' })).rejects.toThrow('abc-123');
  });
});
