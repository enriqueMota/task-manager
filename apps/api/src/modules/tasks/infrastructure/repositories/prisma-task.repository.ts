import { Injectable, Inject } from '@nestjs/common';
import { TaskNotFoundException } from '../../application/use-cases/get-task.use-case.js';
import type { Prisma } from '../../../../generated/prisma/index.js';
import { TaskMapper } from '../mappers/task.mapper.js';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type {
  TaskRepository,
  TaskFilters,
  TaskSort,
  TaskStats,
  PaginatedResult,
} from '../../domain/repositories/task.repository.interface.js';
import { PrismaService } from '../../../../shared/database/prisma.service.js';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(task: TaskEntity): Promise<TaskEntity> {
    const record = await this.prisma.task.create({
      data: TaskMapper.toCreateInput(task),
    });
    return TaskMapper.toDomain(record);
  }

  async findById(id: string): Promise<TaskEntity | null> {
    const record = await this.prisma.task.findUnique({ where: { id } });
    return record ? TaskMapper.toDomain(record) : null;
  }

  async findAll(
    filters?: TaskFilters,
    sort?: TaskSort,
    pagination?: { page: number; pageSize: number },
  ): Promise<PaginatedResult<TaskEntity>> {
    const where: Prisma.TaskWhereInput = {};

    if (filters?.status !== undefined) where.status = filters.status;

    if (filters?.priority !== undefined) where.priority = filters.priority;
    if (filters?.assignee !== undefined) where.assignee = filters.assignee;

    const orderBy: Prisma.TaskOrderByWithRelationInput = sort
      ? { [sort.field]: sort.direction }
      : { createdAt: 'desc' };

    const page = pagination?.page ?? 1;
    const pageSize = pagination?.pageSize ?? 10;
    const offset = (page - 1) * pageSize;

    const [total, records] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        orderBy,
        take: pageSize,
        skip: offset,
      }),
    ]);

    return {
      items: records.map((r) => TaskMapper.toDomain(r)),
      total,
      page,
      pageSize,
    };
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const record = await this.prisma.task.update({
      where: { id: task.id },
      data: TaskMapper.toUpdateInput(task),
    });
    return TaskMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.task.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error as { code: string }).code === 'P2025'
      ) {
        throw new TaskNotFoundException(id);
      }
      throw error;
    }
  }

  async getStats(): Promise<TaskStats> {
    const [total, byStatusRows, byPriorityRows] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        _count: { _all: true },
      }),
    ]);

    const byStatus: Record<string, number> = {};
    for (const row of byStatusRows) {
      byStatus[row.status] = row._count._all;
    }

    const byPriority: Record<string, number> = {};
    for (const row of byPriorityRows) {
      byPriority[row.priority] = row._count._all;
    }

    return { total, byStatus, byPriority };
  }
}
