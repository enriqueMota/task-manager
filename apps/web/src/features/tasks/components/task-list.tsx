'use client';

import type { TaskResponse } from '../api/types';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: TaskResponse[];
  onEdit: (task: TaskResponse) => void;
  onDelete: (task: TaskResponse) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps): React.ReactElement {
  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
