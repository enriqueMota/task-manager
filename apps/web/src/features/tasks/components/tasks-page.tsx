'use client';

import { CheckSquare } from 'lucide-react';
import { TasksContainer } from './tasks-container';

export function TasksPage(): React.ReactElement {
  return (
    <div className="flex-1 bg-muted/30">
      {/* App Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-5 text-primary" />
              <span className="text-lg font-bold tracking-tight">Task Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TasksContainer />
      </main>
    </div>
  );
}
