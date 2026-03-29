import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskIdSchema,
  TASK_STATUS_VALUES,
  TASK_PRIORITY_VALUES,
  type CreateTaskDto,
  type UpdateTaskDto,
  type TaskIdDto,
} from '@task-manager/shared';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe.js';
import {
  toTaskResponseDto,
  toTaskStatsResponseDto,
  TaskResponseDto,
  PaginatedTaskResponseDto,
  TaskStatsResponseDto,
} from '../dto/task-response.dto.js';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case.js';
import { ListTasksUseCase } from '../../application/use-cases/list-tasks.use-case.js';
import {
  GetTaskUseCase,
  TaskNotFoundException,
} from '../../application/use-cases/get-task.use-case.js';
import { UpdateTaskUseCase } from '../../application/use-cases/update-task.use-case.js';
import { DeleteTaskUseCase } from '../../application/use-cases/delete-task.use-case.js';
import { GetTaskStatsUseCase } from '../../application/use-cases/get-task-stats.use-case.js';
import type {
  TaskFilters,
  TaskSort,
} from '../../domain/repositories/task.repository.interface.js';
import type { TaskStatus, TaskPriority } from '@task-manager/shared';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(CreateTaskUseCase)
    private readonly createTaskUseCase: CreateTaskUseCase,
    @Inject(ListTasksUseCase)
    private readonly listTasksUseCase: ListTasksUseCase,
    @Inject(GetTaskUseCase)
    private readonly getTaskUseCase: GetTaskUseCase,
    @Inject(UpdateTaskUseCase)
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    @Inject(DeleteTaskUseCase)
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    @Inject(GetTaskStatsUseCase)
    private readonly getTaskStatsUseCase: GetTaskStatsUseCase,
  ) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get task statistics grouped by status and priority',
  })
  @ApiResponse({
    status: 200,
    description: 'Task statistics',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        byStatus: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
        byPriority: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getStats(): Promise<TaskStatsResponseDto> {
    const stats = await this.getTaskStatsUseCase.execute();
    return toTaskStatsResponseDto(stats);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks with optional filters and sorting' })
  @ApiQuery({ name: 'status', required: false, enum: TASK_STATUS_VALUES })
  @ApiQuery({ name: 'priority', required: false, enum: TASK_PRIORITY_VALUES })
  @ApiQuery({ name: 'assignee', required: false, type: String })
  @ApiQuery({
    name: 'sortField',
    required: false,
    enum: ['dueDate', 'priority', 'createdAt'],
  })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              description: { type: 'string', nullable: true },
              status: {
                type: 'string',
                enum: ['pending', 'in-progress', 'completed'],
              },
              priority: { type: 'string', enum: ['low', 'medium', 'high'] },
              dueDate: { type: 'string', nullable: true },
              assignee: { type: 'string', nullable: true },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        pageSize: { type: 'number' },
      },
    },
  })
  async listTasks(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('assignee') assignee?: string,
    @Query('sortField') sortField?: string,
    @Query('sortDirection') sortDirection?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ): Promise<PaginatedTaskResponseDto> {
    const filters: TaskFilters = {};

    if (status !== undefined) filters.status = status as TaskStatus;
    if (priority !== undefined) filters.priority = priority as TaskPriority;
    if (assignee !== undefined) filters.assignee = assignee;

    const sort: TaskSort | undefined =
      sortField !== undefined
        ? {
            field: sortField as TaskSort['field'],
            direction: (sortDirection ?? 'asc') as TaskSort['direction'],
          }
        : undefined;

    const paginated = await this.listTasksUseCase.execute({
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      sort,
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
    });

    return {
      items: paginated.items.map(toTaskResponseDto),
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTask(
    @Param('id', new ZodValidationPipe(TaskIdSchema.shape.id))
    id: TaskIdDto['id'],
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.getTaskUseCase.execute({ id });
      return toTaskResponseDto(task);
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Finish report' },
        description: {
          type: 'string',
          example: 'Summarize Q1 metrics',
          nullable: true,
        },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          example: 'pending',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          example: 'medium',
        },
        dueDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-04-01T15:00:00.000Z',
          nullable: true,
        },
        assignee: { type: 'string', example: 'John Doe', nullable: true },
      },
      required: ['title', 'status', 'priority'],
      example: {
        title: 'Finish report',
        description: 'Summarize Q1 metrics',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-04-01T15:00:00.000Z',
        assignee: 'John Doe',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Task created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createTask(
    @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute({ dto });
    return toTaskResponseDto(task);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Finish report' },
        description: {
          type: 'string',
          example: 'Summarize Q1 metrics',
          nullable: true,
        },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
          example: 'in-progress',
        },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          example: 'high',
        },
        dueDate: {
          type: 'string',
          format: 'date-time',
          example: '2026-04-05T18:00:00.000Z',
          nullable: true,
        },
        assignee: { type: 'string', example: 'Jane Doe', nullable: true },
      },
      required: ['title', 'status', 'priority'],
      example: {
        title: 'Finish report',
        description: 'Summarize Q1 metrics',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2026-04-05T18:00:00.000Z',
        assignee: 'Jane Doe',
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Task updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async updateTask(
    @Param('id', new ZodValidationPipe(TaskIdSchema.shape.id))
    id: TaskIdDto['id'],
    @Body(new ZodValidationPipe(UpdateTaskSchema)) dto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    try {
      const task = await this.updateTaskUseCase.execute({ id, dto });
      return toTaskResponseDto(task);
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task UUID' })
  @ApiResponse({ status: 204, description: 'Task deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async deleteTask(
    @Param('id', new ZodValidationPipe(TaskIdSchema.shape.id))
    id: TaskIdDto['id'],
  ): Promise<void> {
    try {
      await this.deleteTaskUseCase.execute({ id });
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
