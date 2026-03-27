import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTaskUseCase } from './create-task.use-case.js';
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
    title: 'Test task',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
  });

describe('CreateTaskUseCase', () => {
  let repo: TaskRepository;
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    repo = makeMockRepo();
    useCase = new CreateTaskUseCase(repo);
  });

  it('creates and persists a new task', async () => {
    const dto = {
      title: 'Buy milk',
      status: 'pending' as const,
      priority: 'low' as const,
    };
    const created = makeTask({ title: dto.title });
    vi.mocked(repo.create).mockResolvedValue(created);

    const result = await useCase.execute({ dto });

    expect(repo.create).toHaveBeenCalledOnce();
    expect(result.title).toBe('Buy milk');
  });

  it('assigns a UUID to the new task', async () => {
    const dto = {
      title: 'Do laundry',
      status: 'pending' as const,
      priority: 'medium' as const,
    };
    vi.mocked(repo.create).mockImplementation((task) => Promise.resolve(task));

    const result = await useCase.execute({ dto });

    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('parses dueDate string into a Date', async () => {
    const dto = {
      title: 'Submit report',
      status: 'pending' as const,
      priority: 'high' as const,
      dueDate: '2026-12-31T00:00:00.000Z',
    };
    vi.mocked(repo.create).mockImplementation((task) => Promise.resolve(task));

    const result = await useCase.execute({ dto });

    expect(result.dueDate).toBeInstanceOf(Date);
  });
});
