import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateTaskDto, UpdateTaskDto } from '@task-manager/shared';
import { tasksApi } from '../api/tasks.api';
import type { TaskResponse } from '../api/types';
import { taskKeys } from './task-keys';

export function useCreateTask(): ReturnType<typeof useMutation<TaskResponse, Error, CreateTaskDto>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskDto) => tasksApi.create(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to create task', { description: error.message });
    },
  });
}

export function useUpdateTask(): ReturnType<typeof useMutation<TaskResponse, Error, { id: string; dto: UpdateTaskDto }>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) => tasksApi.update(id, dto),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) });
      void queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to update task', { description: error.message });
    },
  });
}

export function useDeleteTask(): ReturnType<typeof useMutation<void, Error, string>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error('Failed to delete task', { description: error.message });
    },
  });
}
