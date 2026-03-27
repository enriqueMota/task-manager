import { describe, it, expect, beforeEach } from 'vitest';
import { useTaskFilterStore } from './task-filter.store';

describe('useTaskFilterStore', () => {
  beforeEach(() => {
    useTaskFilterStore.setState({
      status: undefined,
      priority: undefined,
      assignee: undefined,
      sortField: 'createdAt',
      sortDirection: 'desc',
    });
  });

  it('should have default initial state', () => {
    const state = useTaskFilterStore.getState();
    expect(state.status).toBeUndefined();
    expect(state.priority).toBeUndefined();
    expect(state.assignee).toBeUndefined();
    expect(state.sortField).toBe('createdAt');
    expect(state.sortDirection).toBe('desc');
  });

  it('should update status filter via setFilter', () => {
    const { setFilter } = useTaskFilterStore.getState();
    setFilter({ status: 'in-progress' });
    expect(useTaskFilterStore.getState().status).toBe('in-progress');
  });

  it('should update priority filter via setFilter', () => {
    const { setFilter } = useTaskFilterStore.getState();
    setFilter({ priority: 'high' });
    expect(useTaskFilterStore.getState().priority).toBe('high');
  });

  it('should update sort field and direction via setFilter', () => {
    const { setFilter } = useTaskFilterStore.getState();
    setFilter({ sortField: 'title', sortDirection: 'asc' });
    const state = useTaskFilterStore.getState();
    expect(state.sortField).toBe('title');
    expect(state.sortDirection).toBe('asc');
  });

  it('should preserve existing filters when partially updating', () => {
    const { setFilter } = useTaskFilterStore.getState();
    setFilter({ status: 'pending' });
    setFilter({ priority: 'low' });
    const state = useTaskFilterStore.getState();
    expect(state.status).toBe('pending');
    expect(state.priority).toBe('low');
  });

  it('should reset all filters on clearFilters', () => {
    const { setFilter, clearFilters } = useTaskFilterStore.getState();
    setFilter({ status: 'completed', priority: 'high', assignee: 'alice' });
    clearFilters();
    const state = useTaskFilterStore.getState();
    expect(state.status).toBeUndefined();
    expect(state.priority).toBeUndefined();
    expect(state.assignee).toBeUndefined();
    expect(state.sortField).toBe('createdAt');
    expect(state.sortDirection).toBe('desc');
  });
});
