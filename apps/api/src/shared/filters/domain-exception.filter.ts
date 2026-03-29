import {
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { TaskNotFoundException } from '../../modules/tasks/application/use-cases/get-task.use-case.js';

@Catch(TaskNotFoundException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: TaskNotFoundException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.NOT_FOUND).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: exception.message,
    });
  }
}
