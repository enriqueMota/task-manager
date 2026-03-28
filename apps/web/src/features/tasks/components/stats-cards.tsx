'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from '@task-manager/shared';
import { BarChart3, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import type { TaskStatsResponse } from '../api/types';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../lib/task-display';

interface StatsCardsProps {
  stats: TaskStatsResponse | undefined;
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps): React.ReactElement {
  if (isLoading) {
    return <StatsCardsSkeleton />;
  }

  if (!stats) return <></>;

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <SummaryCard
          icon={<ListTodo className="size-4" />}
          label="Total Tasks"
          value={stats.total}
          accent="text-primary"
        />
        <SummaryCard
          icon={<Clock className="size-4" />}
          label="Pending"
          value={stats.byStatus.pending ?? 0}
          accent="text-amber-600"
        />
        <SummaryCard
          icon={<BarChart3 className="size-4" />}
          label="In Progress"
          value={stats.byStatus['in-progress'] ?? 0}
          accent="text-blue-600"
        />
        <SummaryCard
          icon={<CheckCircle2 className="size-4" />}
          label="Completed"
          value={stats.byStatus.completed ?? 0}
          accent="text-emerald-600"
        />
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">By Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TASK_STATUS_VALUES.map((status) => {
              const count = stats.byStatus[status] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const config = STATUS_CONFIG[status];
              return (
                <div key={status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </span>
                    <span className="font-medium tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.dotColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">By Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {TASK_PRIORITY_VALUES.map((priority) => {
              const count = stats.byPriority[priority] ?? 0;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              const config = PRIORITY_CONFIG[priority];
              const barColor =
                priority === 'high'
                  ? 'bg-red-500'
                  : priority === 'medium'
                    ? 'bg-orange-500'
                    : 'bg-slate-400';
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs">{config.icon}</span>
                      {config.label}
                    </span>
                    <span className="font-medium tabular-nums">{count}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}

function SummaryCard({ icon, label, value, accent }: SummaryCardProps): React.ReactElement {
  return (
    <Card>
      <CardContent className="p-1.5 flex justify-center items-center gap-2">
        <div className={`rounded-lg bg-muted p-2 ${accent}`}>{icon}</div>
        <div>
          <p className="text-base font-bold tabular-nums">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCardsSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-2 flex items-center gap-2">
              <Skeleton className="size-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-3/4" />
              <Skeleton className="h-2 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
