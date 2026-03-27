'use client';

import { cn } from '@/lib/utils';
import type { TaskStatus } from '@task-manager/shared';
import { STATUS_CONFIG } from '../lib/task-display';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps): React.ReactElement {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
