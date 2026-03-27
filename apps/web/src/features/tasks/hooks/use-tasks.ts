import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import type { ListTasksParams, TaskResponse, TaskStatsResponse } from '../api/types';
import { taskKeys } from './task-keys';

export function useTasks(params: ListTasksParams = {}): ReturnType<typeof useQuery<TaskResponse[]>> {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.list(params),
  });
}

export function useTask(id: string): ReturnType<typeof useQuery<TaskResponse>> {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useTaskStats(): ReturnType<typeof useQuery<TaskStatsResponse>> {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => tasksApi.getStats(),
  });
}
