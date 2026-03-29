import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks.api';
import type {
  ListTasksParams,
  PaginatedTaskResponse,
  TaskResponse,
  TaskStatsResponse,
} from '../api/types';
import { taskKeys } from './task-keys';

export function useTasks(params: ListTasksParams = {}) {
  return useQuery<PaginatedTaskResponse>({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.list(params),
    staleTime: 1000 * 60,
  });
}

export function useTask(id: string) {
  return useQuery<TaskResponse>({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  });
}

export function useTaskStats() {
  return useQuery<TaskStatsResponse>({
    queryKey: taskKeys.stats(),
    queryFn: () => tasksApi.getStats(),
  });
}
