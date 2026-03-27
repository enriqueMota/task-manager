import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTaskUseCase } from './delete-task.use-case.js';
import { TaskNotFoundException } from './get-task.use-case.js';
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
    title: 'Task to delete',
    status: 'pending',
    priority: 'low',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });

describe('DeleteTaskUseCase', () => {
  let repo: TaskRepository;
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new DeleteTaskUseCase(repo);
  });

  it('deletes the task when it exists', async () => {
    vi.mocked(repo.findById).mockResolvedValue(makeTask());
    vi.mocked(repo.delete).mockResolvedValue(undefined);

    await useCase.execute({ id: 'uuid-1' });

    expect(repo.delete).toHaveBeenCalledWith('uuid-1');
    expect(repo.delete).toHaveBeenCalledOnce();
  });

  it('throws TaskNotFoundException when task does not exist', async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'ghost-id' })).rejects.toThrow(
      TaskNotFoundException,
    );
  });

  it('does not call delete when task is not found', async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'ghost-id' })).rejects.toThrow();
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
