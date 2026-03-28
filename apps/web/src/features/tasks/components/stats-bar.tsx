'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { TaskStatsResponse } from '../api/types';

interface StatsBarProps {
  stats: TaskStatsResponse | undefined;
  isLoading: boolean;
}

export function StatsBar({ stats, isLoading }: StatsBarProps): React.ReactElement {
  if (isLoading) {
    return (
      <div className="flex items-center gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-20" />
        ))}
      </div>
    );
  }

  if (!stats) return <></>;

  const items: { label: string; value: number; dotColor: string }[] = [
    { label: 'Total', value: stats.total, dotColor: 'bg-foreground' },
    { label: 'Pending', value: stats.byStatus.pending ?? 0, dotColor: 'bg-amber-500' },
    { label: 'In Progress', value: stats.byStatus['in-progress'] ?? 0, dotColor: 'bg-blue-500' },
    { label: 'Completed', value: stats.byStatus.completed ?? 0, dotColor: 'bg-emerald-500' },
    { label: 'High', value: stats.byPriority.high ?? 0, dotColor: 'bg-red-500' },
    { label: 'Medium', value: stats.byPriority.medium ?? 0, dotColor: 'bg-orange-500' },
    { label: 'Low', value: stats.byPriority.low ?? 0, dotColor: 'bg-slate-400' },
  ];

  return (
    <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${item.dotColor}`} />
          <span className="font-medium tabular-nums text-foreground">{item.value}</span>
          {item.label}
        </span>
      ))}
    </div>
  );
}
