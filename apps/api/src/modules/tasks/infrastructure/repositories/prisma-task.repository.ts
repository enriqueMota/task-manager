import { Injectable, Inject } from '@nestjs/common';
import type { Prisma } from '../../../../generated/prisma/index.js';
import { TaskMapper } from '../mappers/task.mapper.js';
import { TaskEntity } from '../../domain/entities/task.entity.js';
import type {
  TaskRepository,
  TaskFilters,
  TaskSort,
  TaskStats,
} from '../../domain/repositories/task.repository.interface.js';
import { PrismaService } from '../prisma/prisma.service.js';

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

  async findAll(filters?: TaskFilters, sort?: TaskSort): Promise<TaskEntity[]> {
    const where: Prisma.TaskWhereInput = {};

    if (filters?.status !== undefined) where.status = filters.status;

    if (filters?.priority !== undefined) where.priority = filters.priority;
    if (filters?.assignee !== undefined) where.assignee = filters.assignee;

    const orderBy: Prisma.TaskOrderByWithRelationInput = sort
      ? { [sort.field]: sort.direction }
      : { createdAt: 'desc' };

    const records = await this.prisma.task.findMany({ where, orderBy });
    return records.map((r) => TaskMapper.toDomain(r));
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const record = await this.prisma.task.update({
      where: { id: task.id },
      data: TaskMapper.toUpdateInput(task),
    });
    return TaskMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
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
