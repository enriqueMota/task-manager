'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, User } from 'lucide-react';
import type { TaskResponse } from '../api/types';
import { formatDate, isOverdue } from '../lib/task-display';
import { PriorityBadge } from './priority-badge';
import { StatusBadge } from './status-badge';

interface TaskCardProps {
  task: TaskResponse;
  onEdit: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps): React.ReactElement {
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer',
        overdue && 'border-red-200 bg-red-50/30',
      )}
      onClick={() => onEdit(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(task);
        }
      }}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header: title + badges */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <span className={cn('flex items-center gap-1', overdue && 'text-red-600 font-medium')}>
                <Calendar className="size-3" />
                {formatDate(task.dueDate)}
              </span>
            )}
            {task.assignee && (
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {task.assignee}
              </span>
            )}
          </div>
          <button
            type="button"
            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 text-xs font-medium transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
          >
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
