'use client';

import { Button } from '@/components/ui/button';
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
import { StatsBar } from './stats-bar';
import { TaskFilters } from './task-filters';
import { TaskFormDialog } from './task-form-dialog';
import { TaskTable } from './task-table';
import { TaskTableSkeleton } from './task-table-skeleton';

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
    <div className="space-y-4">
      {/* Top bar: stats summary */}
      <StatsBar stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      {/* Toolbar: title + filters + new task */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight shrink-0">
          Tasks
          {tasksQuery.data && (
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
              ({tasksQuery.data.length})
            </span>
          )}
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <TaskFilters />
          <Button onClick={handleCreateClick} size="sm" className="gap-1.5 w-full sm:w-auto">
            <Plus className="size-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Content */}
      {tasksQuery.isLoading ? (
        <TaskTableSkeleton />
      ) : tasksQuery.isError ? (
        <ErrorFallback
          message={tasksQuery.error?.message}
          onRetry={() => void tasksQuery.refetch()}
        />
      ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
        <TaskTable tasks={tasksQuery.data} onEdit={handleEditClick} onDelete={handleDeleteClick} />
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
