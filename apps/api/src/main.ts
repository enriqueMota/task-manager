import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3001',
  });

  app.useGlobalFilters(new DomainExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription(
      `## Overview

A RESTful API for managing tasks with full **CRUD** operations, filtering, sorting, pagination, and statistics.

### Features
- 📝 Create, read, update, and delete tasks
- 🔍 Filter tasks by **status**, **priority**, and **assignee**
- 📊 Sort tasks by **due date**, **priority**, or **creation date**
- 📄 Server-side **pagination** with configurable page sizes
- 📈 Aggregated **statistics** grouped by status and priority

### Validation
All request bodies are validated using **Zod** schemas. Invalid requests return structured error responses with per-field details.

### Architecture
Built with **NestJS** following Clean Architecture principles with vertical feature slicing.`,
    )
    .setVersion('1.0.0')
    .setContact(
      'Task Manager Team',
      'https://github.com/enriquemota/task-manager',
      'contact@taskmanager.dev',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Local Development')
    .addTag(
      'tasks',
      'Endpoints for managing tasks (CRUD, filtering, sorting, pagination)',
    )
    .addTag('statistics', 'Endpoints for task analytics and aggregated metrics')
    .addTag('health', 'Health check endpoint')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Task Manager API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `.swagger-ui .topbar { display: none }`,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: { activate: true, theme: 'monokai' },
      tryItOutEnabled: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
