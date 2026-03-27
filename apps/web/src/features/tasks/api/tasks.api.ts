import type { CreateTaskDto, UpdateTaskDto } from '@task-manager/shared';
import type { ListTasksParams, TaskResponse, TaskStatsResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`API error ${response.status}: ${message}`);
  }

  return response.json() as Promise<T>;
}

function buildQueryString(params: ListTasksParams): string {
  const searchParams = new URLSearchParams();
  if (params.status) searchParams.set('status', params.status);
  if (params.priority) searchParams.set('priority', params.priority);
  if (params.assignee) searchParams.set('assignee', params.assignee);
  if (params.sortField) searchParams.set('sortField', params.sortField);
  if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const tasksApi = {
  list: (params: ListTasksParams = {}): Promise<TaskResponse[]> => {
    return apiFetch<TaskResponse[]>(`/tasks${buildQueryString(params)}`);
  },

  getById: (id: string): Promise<TaskResponse> => {
    return apiFetch<TaskResponse>(`/tasks/${id}`);
  },

  create: (dto: CreateTaskDto): Promise<TaskResponse> => {
    return apiFetch<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  update: (id: string, dto: UpdateTaskDto): Promise<TaskResponse> => {
    return apiFetch<TaskResponse>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  delete: (id: string): Promise<void> => {
    return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
  },

  getStats: (): Promise<TaskStatsResponse> => {
    return apiFetch<TaskStatsResponse>('/tasks/stats');
  },
};
