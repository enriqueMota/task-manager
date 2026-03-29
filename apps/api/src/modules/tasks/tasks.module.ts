import { Module } from '@nestjs/common';
import { PrismaTaskRepository } from './infrastructure/repositories/prisma-task.repository.js';
import { TASK_REPOSITORY } from './domain/repositories/task.repository.interface.js';
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case.js';
import { ListTasksUseCase } from './application/use-cases/list-tasks.use-case.js';
import { GetTaskUseCase } from './application/use-cases/get-task.use-case.js';
import { UpdateTaskUseCase } from './application/use-cases/update-task.use-case.js';
import { DeleteTaskUseCase } from './application/use-cases/delete-task.use-case.js';
import { GetTaskStatsUseCase } from './application/use-cases/get-task-stats.use-case.js';
import { TasksController } from './presentation/controllers/tasks.controller.js';

@Module({
  controllers: [TasksController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: PrismaTaskRepository,
    },
    {
      provide: CreateTaskUseCase,
      useFactory: (repo: PrismaTaskRepository) => new CreateTaskUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: ListTasksUseCase,
      useFactory: (repo: PrismaTaskRepository) => new ListTasksUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: GetTaskUseCase,
      useFactory: (repo: PrismaTaskRepository) => new GetTaskUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: UpdateTaskUseCase,
      useFactory: (repo: PrismaTaskRepository) => new UpdateTaskUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: DeleteTaskUseCase,
      useFactory: (repo: PrismaTaskRepository) => new DeleteTaskUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
    {
      provide: GetTaskStatsUseCase,
      useFactory: (repo: PrismaTaskRepository) => new GetTaskStatsUseCase(repo),
      inject: [TASK_REPOSITORY],
    },
  ],
})
export class TasksModule {}
