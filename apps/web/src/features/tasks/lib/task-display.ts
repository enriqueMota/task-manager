import type { TaskPriority, TaskStatus } from '@task-manager/shared';

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; dotColor: string }> =
  {
    pending: {
      label: 'Pending',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    'in-progress': {
      label: 'In Progress',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
    },
    completed: {
      label: 'Completed',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
  };

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; icon: string }> =
  {
    low: {
      label: 'Low',
      color: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: '↓',
    },
    medium: {
      label: 'Medium',
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      icon: '→',
    },
    high: {
      label: 'High',
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: '↑',
    },
  };

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function isOverdue(dueDate: string | undefined): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}
