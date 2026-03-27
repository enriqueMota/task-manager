'use client';

import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onCreateTask: () => void;
}

export function EmptyState({ hasFilters, onClearFilters, onCreateTask }: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <ClipboardList className="size-8 text-muted-foreground" />
      </div>
      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold mb-1">No matching tasks</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            No tasks match your current filters. Try adjusting your filters or clear them.
          </p>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            Get started by creating your first task.
          </p>
          <Button onClick={onCreateTask} size="sm">
            Create task
          </Button>
        </>
      )}
    </div>
  );
}
