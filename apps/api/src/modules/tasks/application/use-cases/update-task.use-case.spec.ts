import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTaskUseCase } from './update-task.use-case.js';
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

const makeTask = (
  overrides: Partial<ConstructorParameters<typeof TaskEntity>[0]> = {},
): TaskEntity =>
  new TaskEntity({
    id: 'uuid-1',
    title: 'Original title',
    status: 'pending',
    priority: 'low',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

describe('UpdateTaskUseCase', () => {
  let repo: TaskRepository;
  let useCase: UpdateTaskUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new UpdateTaskUseCase(repo);
  });

  it('updates task fields with provided values', async () => {
    const existing = makeTask();
    vi.mocked(repo.findById).mockResolvedValue(existing);
    vi.mocked(repo.update).mockImplementation((task) => Promise.resolve(task));

    const result = await useCase.execute({
      id: 'uuid-1',
      dto: { title: 'New title', status: 'completed' },
    });

    expect(result.title).toBe('New title');
    expect(result.status).toBe('completed');
  });

  it('retains existing values for fields not provided in dto', async () => {
    const existing = makeTask({ description: 'Keep this' });
    vi.mocked(repo.findById).mockResolvedValue(existing);
    vi.mocked(repo.update).mockImplementation((task) => Promise.resolve(task));

    const result = await useCase.execute({
      id: 'uuid-1',
      dto: { title: 'Updated' },
    });

    expect(result.description).toBe('Keep this');
    expect(result.priority).toBe('low');
  });

  it('throws TaskNotFoundException when task does not exist', async () => {
    vi.mocked(repo.findById).mockResolvedValue(null);

    await expect(useCase.execute({ id: 'bad-id', dto: {} })).rejects.toThrow(
      TaskNotFoundException,
    );
  });

  it('sets updatedAt to a new date', async () => {
    const existing = makeTask();
    vi.mocked(repo.findById).mockResolvedValue(existing);
    vi.mocked(repo.update).mockImplementation((task) => Promise.resolve(task));

    const result = await useCase.execute({
      id: 'uuid-1',
      dto: { title: 'Changed' },
    });

    expect(result.updatedAt.getTime()).toBeGreaterThan(
      existing.updatedAt.getTime(),
    );
  });
});
