'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Calendar, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TaskResponse } from '../api/types';
import { formatDate, isOverdue } from '../lib/task-display';
import { StatusBadge } from './status-badge';
import { PriorityBadge } from './priority-badge';

interface TaskTableProps {
  tasks: TaskResponse[];
  onEdit: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
}

export function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps): React.ReactElement {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="min-w-[200px]">Task</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[110px]">Priority</TableHead>
            <TableHead className="w-[120px]">Due Date</TableHead>
            <TableHead className="w-[120px]">Assignee</TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate) && task.status !== 'completed';
            return (
              <TableRow
                key={task.id}
                className={cn('cursor-pointer', overdue && 'bg-red-50/40')}
                onClick={() => onEdit(task)}
              >
                {/* Title + description */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm leading-tight line-clamp-1">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={task.status} />
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  {task.dueDate ? (
                    <span
                      className={cn(
                        'flex items-center gap-1 text-xs',
                        overdue ? 'text-red-600 font-medium' : 'text-muted-foreground',
                      )}
                    >
                      <Calendar className="size-3 shrink-0" />
                      {formatDate(task.dueDate)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Assignee */}
                <TableCell>
                  {task.assignee ? (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="size-3 shrink-0" />
                      <span className="truncate max-w-[90px]">{task.assignee}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task);
                        }}
                      >
                        <Pencil className="size-3.5 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(task);
                        }}
                      >
                        <Trash2 className="size-3.5 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
