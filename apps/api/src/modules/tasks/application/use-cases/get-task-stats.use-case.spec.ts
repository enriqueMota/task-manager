import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetTaskStatsUseCase } from './get-task-stats.use-case.js';
import type {
  TaskRepository,
  TaskStats,
} from '../../domain/repositories/task.repository.interface.js';

const makeMockRepo = (): TaskRepository => ({
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
});

describe('GetTaskStatsUseCase', () => {
  let repo: TaskRepository;
  let useCase: GetTaskStatsUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new GetTaskStatsUseCase(repo);
  });

  it('returns stats from the repository', async () => {
    const stats: TaskStats = {
      total: 6,
      byStatus: { pending: 3, completed: 1, 'in-progress': 2 },
      byPriority: { low: 1, medium: 3, high: 2 },
    };
    vi.mocked(repo.getStats).mockResolvedValue(stats);

    const result = await useCase.execute();

    expect(result).toEqual(stats);
    expect(repo.getStats).toHaveBeenCalledOnce();
  });

  it('delegates entirely to repository — no in-memory computation', async () => {
    const stats: TaskStats = { total: 0, byStatus: {}, byPriority: {} };
    vi.mocked(repo.getStats).mockResolvedValue(stats);

    await useCase.execute();

    // Only getStats should be called — not findAll
    expect(repo.findAll).not.toHaveBeenCalled();
    expect(repo.getStats).toHaveBeenCalledOnce();
  });
});
