'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskTableSkeletonProps {
  rows?: number;
}

export function TaskTableSkeleton({ rows = 5 }: TaskTableSkeletonProps): React.ReactElement {
  return (
    <div className="rounded-lg border bg-card text-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[200px]">Task</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[110px]">Priority</TableHead>
            <TableHead className="w-[120px]">Due Date</TableHead>
            <TableHead className="w-[120px]">Assignee</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3.5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3.5 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
