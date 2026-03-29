import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { TasksController } from './tasks.controller.js';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case.js';
import { ListTasksUseCase } from '../../application/use-cases/list-tasks.use-case.js';
import { GetTaskUseCase } from '../../application/use-cases/get-task.use-case.js';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case.js';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case.js';
import { GetTaskStatsUseCase } from '../../application/use-cases/get-task-stats.use-case.js';
import { TaskNotFoundException } from '../../application/use-cases/get-task.use-case.js';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import { TASK_REPOSITORY } from '../../domain/repositories/task.repository.interface.js';
import { DomainExceptionFilter } from '../../../../shared/filters/domain-exception.filter.js';

const TEST_UUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

const makeTask = (
  overrides: Partial<ConstructorParameters<typeof TaskEntity>[0]> = {},
): TaskEntity =>
  new TaskEntity({
    id: TEST_UUID,
    title: 'Test task',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  });

const mockRepo = {
  create: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
};

const mockCreateUseCase = { execute: vi.fn() };
const mockListUseCase = { execute: vi.fn() };
const mockGetUseCase = { execute: vi.fn() };
const mockUpdateUseCase = { execute: vi.fn() };
const mockDeleteUseCase = { execute: vi.fn() };
const mockStatsUseCase = { execute: vi.fn() };

describe('TasksController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        { provide: TASK_REPOSITORY, useValue: mockRepo },
        { provide: CreateTaskUseCase, useValue: mockCreateUseCase },
        { provide: ListTasksUseCase, useValue: mockListUseCase },
        { provide: GetTaskUseCase, useValue: mockGetUseCase },
        { provide: UpdateTaskUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteTaskUseCase, useValue: mockDeleteUseCase },
        { provide: GetTaskStatsUseCase, useValue: mockStatsUseCase },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /tasks', () => {
    it('returns 200 with list of tasks', async () => {
      const task = makeTask();
      mockListUseCase.execute.mockResolvedValue({
        items: [task],
        total: 1,
        page: 1,
        pageSize: 10,
      });

      const res = await request(app.getHttpServer() as Server).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect((res.body.items as { id: string }[])[0].id).toBe(TEST_UUID);
    });

    it('returns 200 with empty array when no tasks', async () => {
      mockListUseCase.execute.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      });

      const res = await request(app.getHttpServer() as Server).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      });
    });
  });

  describe('GET /tasks/stats', () => {
    it('returns 200 with stats', async () => {
      const stats = {
        byStatus: { pending: 3, completed: 1 },
        byPriority: { low: 1, high: 3 },
      };
      mockStatsUseCase.execute.mockResolvedValue(stats);

      const res = await request(app.getHttpServer() as Server).get(
        '/tasks/stats',
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(stats);
    });
  });

  describe('GET /tasks/:id', () => {
    it('returns 200 with task when found', async () => {
      const task = makeTask();
      mockGetUseCase.execute.mockResolvedValue(task);

      const res = await request(app.getHttpServer() as Server).get(
        `/tasks/${TEST_UUID}`,
      );

      expect(res.status).toBe(200);
      expect((res.body as { id: string }).id).toBe(TEST_UUID);
    });

    it('returns 404 when task not found', async () => {
      mockGetUseCase.execute.mockRejectedValue(
        new TaskNotFoundException('b1d9e3e0-0000-4000-a000-000000000001'),
      );

      const res = await request(app.getHttpServer() as Server).get(
        '/tasks/b1d9e3e0-0000-4000-a000-000000000001',
      );

      expect(res.status).toBe(404);
    });
  });

  describe('POST /tasks', () => {
    it('returns 201 with created task', async () => {
      const task = makeTask({ title: 'New task' });
      mockCreateUseCase.execute.mockResolvedValue(task);

      const body = {
        title: 'New task',
        status: 'pending',
        priority: 'medium',
      };

      const res = await request(app.getHttpServer() as Server)
        .post('/tasks')
        .send(body)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(201);
      expect((res.body as { title: string }).title).toBe('New task');
    });

    it('returns 400 on validation failure', async () => {
      const res = await request(app.getHttpServer() as Server)
        .post('/tasks')
        .send({ title: 'x' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('returns 200 with updated task', async () => {
      const task = makeTask({ title: 'Updated' });
      mockUpdateUseCase.execute.mockResolvedValue(task);

      const res = await request(app.getHttpServer() as Server)
        .put(`/tasks/${TEST_UUID}`)
        .send({ title: 'Updated' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect((res.body as { title: string }).title).toBe('Updated');
    });

    it('returns 404 when task not found', async () => {
      mockUpdateUseCase.execute.mockRejectedValue(
        new TaskNotFoundException('b1d9e3e0-0000-4000-a000-000000000001'),
      );

      const res = await request(app.getHttpServer() as Server)
        .put('/tasks/b1d9e3e0-0000-4000-a000-000000000001')
        .send({ title: 'Changed' })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('returns 204 on success', async () => {
      mockDeleteUseCase.execute.mockResolvedValue(undefined);

      const res = await request(app.getHttpServer() as Server).delete(
        `/tasks/${TEST_UUID}`,
      );

      expect(res.status).toBe(204);
    });

    it('returns 404 when task not found', async () => {
      mockDeleteUseCase.execute.mockRejectedValue(
        new TaskNotFoundException('b1d9e3e0-0000-4000-a000-000000000001'),
      );

      const res = await request(app.getHttpServer() as Server).delete(
        '/tasks/b1d9e3e0-0000-4000-a000-000000000001',
      );

      expect(res.status).toBe(404);
    });
  });
});
