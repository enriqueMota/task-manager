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
  ApiExtraModels,
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
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
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
@ApiExtraModels(
  TaskResponseDto,
  PaginatedTaskResponseDto,
  TaskStatsResponseDto,
  CreateTaskRequestDto,
  UpdateTaskRequestDto,
  ValidationErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
)
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

  // ─── Statistics ──────────────────────────────────────────────────────────

  @Get('stats')
  @ApiTags('statistics')
  @ApiOperation({
    summary: 'Get task statistics',
    description:
      'Returns aggregated statistics for all tasks, grouped by **status** and **priority**. ' +
      'Counts are computed at the database level for optimal performance.',
    operationId: 'getTaskStats',
  })
  @ApiResponse({
    status: 200,
    description:
      'Aggregated task statistics with total count and breakdowns by status and priority.',
    type: TaskStatsResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async getStats(): Promise<TaskStatsResponseDto> {
    const stats = await this.getTaskStatsUseCase.execute();
    return toTaskStatsResponseDto(stats);
  }

  // ─── List Tasks ──────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List tasks',
    description:
      'Returns a **paginated** list of tasks with optional filtering by status, priority, ' +
      'and assignee, plus sorting by due date, priority, or creation date. ' +
      'Results include pagination metadata **(total, page, pageSize)**.',
    operationId: 'listTasks',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: TASK_STATUS_VALUES,
    description: 'Filter tasks by their current status',
    example: 'pending',
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: TASK_PRIORITY_VALUES,
    description: 'Filter tasks by their priority level',
    example: 'high',
  })
  @ApiQuery({
    name: 'assignee',
    required: false,
    type: String,
    description: 'Filter tasks by assignee name (exact match)',
    example: 'John Doe',
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    enum: ['dueDate', 'priority', 'createdAt'],
    description: 'Field to sort results by',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort direction (ascending or descending)',
    example: 'desc',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (1-indexed). Defaults to 1.',
    example: 1,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description:
      'Number of items per page. Defaults to 10. Max recommended: 100.',
    example: 10,
    schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
  })
  @ApiResponse({
    status: 200,
    description:
      'Paginated list of tasks matching the provided filters and sort criteria.',
    type: PaginatedTaskResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
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

  // ─── Get Single Task ────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary: 'Get a task by ID',
    description:
      'Retrieves a single task by its unique UUID identifier. ' +
      'Returns 404 if no task exists with the given ID.',
    operationId: 'getTask',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique UUID identifier of the task',
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiResponse({
    status: 200,
    description: 'The task matching the provided ID.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the provided ID.',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
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

  // ─── Create Task ────────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new task',
    description:
      'Creates a new task with the provided details. ' +
      'The `title`, `status`, and `priority` fields are **required**. ' +
      'All fields are validated using Zod schemas — invalid requests return ' +
      'structured per-field error messages.',
    operationId: 'createTask',
  })
  @ApiBody({
    description: 'Task creation payload',
    type: CreateTaskRequestDto,
    examples: {
      minimal: {
        summary: 'Minimal task (required fields only)',
        description: 'Creates a task with only the required fields',
        value: {
          title: 'Review pull request',
          status: 'pending',
          priority: 'medium',
        },
      },
      complete: {
        summary: 'Complete task (all fields)',
        description:
          'Creates a task with all available fields including optional ones',
        value: {
          title: 'Finish quarterly report',
          description:
            'Summarize Q1 metrics and prepare charts for the board meeting',
          status: 'pending',
          priority: 'high',
          dueDate: '2026-04-01T15:00:00.000Z',
          assignee: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created. Returns the full task object.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error — one or more fields failed schema validation.',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
  async createTask(
    @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute({ dto });
    return toTaskResponseDto(task);
  }

  // ─── Update Task ────────────────────────────────────────────────────────

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing task',
    description:
      'Updates an existing task identified by UUID. All fields are **optional** — ' +
      'only the provided fields will be updated (partial update). ' +
      'Returns 404 if the task does not exist.',
    operationId: 'updateTask',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique UUID identifier of the task to update',
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiBody({
    description:
      'Partial task update payload — include only the fields you want to change',
    type: UpdateTaskRequestDto,
    examples: {
      statusOnly: {
        summary: 'Update status only',
        description: 'Move a task to in-progress',
        value: {
          status: 'in-progress',
        },
      },
      priorityAndAssignee: {
        summary: 'Update priority and reassign',
        description: 'Escalate priority and reassign the task',
        value: {
          priority: 'high',
          assignee: 'Jane Doe',
        },
      },
      fullUpdate: {
        summary: 'Full update',
        description: 'Update all fields at once',
        value: {
          title: 'Finish quarterly report — final version',
          description: 'Include revised Q1 charts and executive summary',
          status: 'in-progress',
          priority: 'high',
          dueDate: '2026-04-05T18:00:00.000Z',
          assignee: 'Jane Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Task successfully updated. Returns the full updated task.',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error — one or more fields failed schema validation.',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the provided ID.',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
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

  // ─── Delete Task ────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Permanently deletes a task identified by UUID. ' +
      'Returns 204 No Content on success, 404 if the task does not exist. ' +
      'This action is **irreversible**.',
    operationId: 'deleteTask',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique UUID identifier of the task to delete',
    format: 'uuid',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @ApiResponse({
    status: 204,
    description: 'Task successfully deleted. No content returned.',
  })
  @ApiResponse({
    status: 404,
    description: 'No task found with the provided ID.',
    type: NotFoundErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  })
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
