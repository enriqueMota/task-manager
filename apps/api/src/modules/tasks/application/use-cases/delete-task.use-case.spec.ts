import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTaskUseCase } from './delete-task.use-case.js';
import { TaskNotFoundException } from './get-task.use-case.js';
import type { TaskRepository } from '../../domain/repositories/task.repository.interface.js';

const makeMockRepo = (): TaskRepository => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
});

describe('DeleteTaskUseCase', () => {
  let repo: TaskRepository;
  let useCase: DeleteTaskUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new DeleteTaskUseCase(repo);
  });

  it('calls repository.delete with the given id', async () => {
    vi.mocked(repo.delete).mockResolvedValue(undefined);

    await useCase.execute({ id: 'uuid-1' });

    expect(repo.delete).toHaveBeenCalledWith('uuid-1');
    expect(repo.delete).toHaveBeenCalledOnce();
  });

  it('does not call findById (single-query delete)', async () => {
    vi.mocked(repo.delete).mockResolvedValue(undefined);

    await useCase.execute({ id: 'uuid-1' });

    expect(repo.findById).not.toHaveBeenCalled();
  });

  it('propagates TaskNotFoundException from repository', async () => {
    vi.mocked(repo.delete).mockRejectedValue(
      new TaskNotFoundException('ghost-id'),
    );

    await expect(useCase.execute({ id: 'ghost-id' })).rejects.toThrow(
      TaskNotFoundException,
    );
  });
});
