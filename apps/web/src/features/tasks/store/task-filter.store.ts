import type { TaskPriority, TaskStatus } from '@task-manager/shared';
import { create } from 'zustand';

export type SortField = 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilterState {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
}

interface TaskFilterActions {
  setFilter: (filter: Partial<TaskFilterState>) => void;
  clearFilters: () => void;
}

export type TaskFilterStore = TaskFilterState & TaskFilterActions;

const initialState: TaskFilterState = {
  status: undefined,
  priority: undefined,
  assignee: undefined,
  sortField: 'createdAt',
  sortDirection: 'desc',
};

export const useTaskFilterStore = create<TaskFilterStore>((set) => ({
  ...initialState,

  setFilter: (filter: Partial<TaskFilterState>): void => {
    set((state) => ({ ...state, ...filter }));
  },

  clearFilters: (): void => {
    set({ ...initialState });
  },
}));
