import { PipeTransform, BadRequestException } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const error = result.error as ZodError;
      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    return result.data;
  }
}
