'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from '@task-manager/shared';
import type { TaskPriority, TaskStatus } from '@task-manager/shared';
import { X } from 'lucide-react';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../lib/task-display';
import { useTaskFilterStore } from '../store/task-filter.store';

export function TaskFilters(): React.ReactElement {
  const { status, priority, sortField, sortDirection, setFilter, clearFilters } =
    useTaskFilterStore();

  const hasActiveFilters = status !== undefined || priority !== undefined;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Status filter */}
      <Select
        value={status ?? 'all'}
        onValueChange={(val) => setFilter({ status: val === 'all' ? undefined : (val as TaskStatus) })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {TASK_STATUS_VALUES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority filter */}
      <Select
        value={priority ?? 'all'}
        onValueChange={(val) => setFilter({ priority: val === 'all' ? undefined : (val as TaskPriority) })}
      >
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {TASK_PRIORITY_VALUES.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_CONFIG[p].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${sortField ?? 'createdAt'}-${sortDirection ?? 'desc'}`}
        onValueChange={(val) => {
          const [field, dir] = val.split('-') as [string, 'asc' | 'desc'];
          setFilter({
            sortField: field as 'title' | 'priority' | 'status' | 'dueDate' | 'createdAt',
            sortDirection: dir,
          });
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest first</SelectItem>
          <SelectItem value="createdAt-asc">Oldest first</SelectItem>
          <SelectItem value="title-asc">Title A→Z</SelectItem>
          <SelectItem value="title-desc">Title Z→A</SelectItem>
          <SelectItem value="priority-desc">Priority ↑</SelectItem>
          <SelectItem value="priority-asc">Priority ↓</SelectItem>
          <SelectItem value="dueDate-asc">Due soonest</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
