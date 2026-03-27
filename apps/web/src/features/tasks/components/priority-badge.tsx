'use client';

import { cn } from '@/lib/utils';
import type { TaskPriority } from '@task-manager/shared';
import { PRIORITY_CONFIG } from '../lib/task-display';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps): React.ReactElement {
  const config = PRIORITY_CONFIG[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className,
      )}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}
