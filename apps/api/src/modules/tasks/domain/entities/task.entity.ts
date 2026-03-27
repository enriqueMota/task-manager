import type { TaskPriority, TaskStatus } from '@task-manager/shared';

export class TaskEntity {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly dueDate?: Date;
  readonly assignee?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    assignee?: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;

    this.status = props.status;

    this.priority = props.priority;
    this.dueDate = props.dueDate;
    this.assignee = props.assignee;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
