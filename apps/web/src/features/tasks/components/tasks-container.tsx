'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { CreateTaskDto } from '@task-manager/shared';
import { Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { TaskResponse } from '../api/types';
import { useCreateTask, useDeleteTask, useUpdateTask } from '../hooks/use-task-mutations';
import { useTasks, useTaskStats } from '../hooks/use-tasks';
import { useTaskFilterStore } from '../store/task-filter.store';
import { DeleteTaskDialog } from './delete-task-dialog';
import { EmptyState } from './empty-state';
import { ErrorFallback } from './error-fallback';
import { StatsCards } from './stats-cards';
import { TaskFilters } from './task-filters';
import { TaskFormDialog } from './task-form-dialog';
import { TaskList } from './task-list';
import { TaskListSkeleton } from './task-list-skeleton';

export function TasksContainer(): React.ReactElement {
  // Filter state
  const { status, priority, assignee, sortField, sortDirection, clearFilters } =
    useTaskFilterStore();

  // Queries
  const tasksQuery = useTasks({ status, priority, assignee, sortField, sortDirection });
  const statsQuery = useTaskStats();

  // Mutations
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskResponse | null>(null);

  const hasFilters = status !== undefined || priority !== undefined;

  // Handlers
  const handleCreateClick = useCallback((): void => {
    setEditingTask(null);
    setFormOpen(true);
  }, []);

  const handleEditClick = useCallback((task: TaskResponse): void => {
    setEditingTask(task);
    setFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((task: TaskResponse): void => {
    setDeletingTask(task);
  }, []);

  const handleFormSubmit = useCallback(
    (data: CreateTaskDto): void => {
      if (editingTask) {
        updateTask.mutate(
          { id: editingTask.id, dto: data },
          { onSuccess: () => setFormOpen(false) },
        );
      } else {
        createTask.mutate(data, { onSuccess: () => setFormOpen(false) });
      }
    },
    [editingTask, createTask, updateTask],
  );

  const handleDeleteConfirm = useCallback((): void => {
    if (!deletingTask) return;
    deleteTask.mutate(deletingTask.id, {
      onSuccess: () => setDeletingTask(null),
    });
  }, [deletingTask, deleteTask]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      <Separator />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            {tasksQuery.data
              ? `${tasksQuery.data.length} task${tasksQuery.data.length === 1 ? '' : 's'}`
              : 'Loading...'}
          </p>
        </div>
        <Button onClick={handleCreateClick} size="sm" className="gap-1.5 w-full sm:w-auto">
          <Plus className="size-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters />

      {/* Content */}
      {tasksQuery.isLoading ? (
        <TaskListSkeleton />
      ) : tasksQuery.isError ? (
        <ErrorFallback
          message={tasksQuery.error?.message}
          onRetry={() => void tasksQuery.refetch()}
        />
      ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
        <TaskList
          tasks={tasksQuery.data}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      ) : (
        <EmptyState
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onCreateTask={handleCreateClick}
        />
      )}

      {/* Dialogs */}
      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        isSubmitting={createTask.isPending || updateTask.isPending}
      />

      <DeleteTaskDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        task={deletingTask}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteTask.isPending}
      />
    </div>
  );
}
