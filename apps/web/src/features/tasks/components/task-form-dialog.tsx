'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CreateTaskDto } from '@task-manager/shared';
import type { TaskResponse } from '../api/types';
import { TaskForm } from './task-form';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: TaskResponse | null;
  onSubmit: (data: CreateTaskDto) => void;
  isSubmitting: boolean;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  isSubmitting,
}: TaskFormDialogProps): React.ReactElement {
  const isEditing = !!task;

  const defaultValues: Partial<CreateTaskDto> | undefined = task
    ? {
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        assignee: task.assignee ?? '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 16) : undefined,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <TaskForm
          key={task?.id ?? 'create'}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? 'Save Changes' : 'Create Task'}
        />
      </DialogContent>
    </Dialog>
  );
}
