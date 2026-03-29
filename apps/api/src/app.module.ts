import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module.js';
import { HealthController } from './shared/health/health.controller.js';
import { TasksModule } from './modules/tasks/tasks.module.js';

@Module({
  imports: [DatabaseModule, TasksModule],
  controllers: [HealthController],
})
export class AppModule {}
