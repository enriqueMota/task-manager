import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { TaskResponse } from '../api/types';
import { EmptyState } from './empty-state';
import { TaskList } from './task-list';

// ─── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('@/components/ui/card', () => ({
  Card: ({
    children,
    onClick,
    role,
    tabIndex,
    onKeyDown,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    role?: string;
    tabIndex?: number;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    className?: string;
  }) => (
    <div role={role ?? 'article'} tabIndex={tabIndex} onClick={onClick} onKeyDown={onKeyDown} className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('lucide-react', () => ({
  Calendar: () => <span data-testid="icon-calendar" />,
  User: () => <span data-testid="icon-user" />,
  ClipboardList: () => <span data-testid="icon-clipboard" />,
}));

// Stub badge components — they render their label as text which is enough for assertions
vi.mock('./status-badge', () => ({
  StatusBadge: ({ status }: { status: string }) => (
    <span data-testid="status-badge">{status}</span>
  ),
}));

vi.mock('./priority-badge', () => ({
  PriorityBadge: ({ priority }: { priority: string }) => (
    <span data-testid="priority-badge">{priority}</span>
  ),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

function makeTask(overrides: Partial<TaskResponse> = {}): TaskResponse {
  return {
    id: 'task-1',
    title: 'Fix critical bug',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const TASKS: TaskResponse[] = [
  makeTask({ id: '1', title: 'First task', status: 'pending', priority: 'high' }),
  makeTask({ id: '2', title: 'Second task', status: 'in-progress', priority: 'medium' }),
  makeTask({ id: '3', title: 'Third task', status: 'completed', priority: 'low' }),
];

// ─── TaskList Tests ───────────────────────────────────────────────────────────

describe('TaskList', () => {
  it('renders the correct number of task cards', () => {
    render(<TaskList tasks={TASKS} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('First task')).toBeInTheDocument();
    expect(screen.getByText('Second task')).toBeInTheDocument();
    expect(screen.getByText('Third task')).toBeInTheDocument();
  });

  it('renders each task title', () => {
    render(<TaskList tasks={TASKS} onEdit={vi.fn()} onDelete={vi.fn()} />);

    TASKS.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it('renders status badge for each task', () => {
    render(<TaskList tasks={TASKS} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const badges = screen.getAllByTestId('status-badge');
    expect(badges).toHaveLength(TASKS.length);
    expect(badges[0]).toHaveTextContent('pending');
    expect(badges[1]).toHaveTextContent('in-progress');
    expect(badges[2]).toHaveTextContent('completed');
  });

  it('renders priority badge for each task', () => {
    render(<TaskList tasks={TASKS} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const badges = screen.getAllByTestId('priority-badge');
    expect(badges).toHaveLength(TASKS.length);
    expect(badges[0]).toHaveTextContent('high');
    expect(badges[1]).toHaveTextContent('medium');
    expect(badges[2]).toHaveTextContent('low');
  });

  it('calls onEdit with the correct task when a card is clicked', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={TASKS} onEdit={onEdit} onDelete={vi.fn()} />);

    // Click the title text (h3) of the first card — the onClick bubbles up to the Card wrapper
    await user.click(screen.getByText(TASKS[0].title));

    expect(onEdit).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledWith(TASKS[0]);
  });

  it('calls onDelete with the correct task when the Delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskList tasks={TASKS} onEdit={vi.fn()} onDelete={onDelete} />);

    // Get all native <button type="button"> elements with text "Delete"
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(TASKS[0]);
  });

  it('renders task description when provided', () => {
    const task = makeTask({ description: 'This is a description' });
    render(<TaskList tasks={[task]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('does not render description section when description is absent', () => {
    const task = makeTask({ description: undefined });
    render(<TaskList tasks={[task]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByText(/this is a description/i)).not.toBeInTheDocument();
  });

  it('renders an empty list without crashing', () => {
    const { container } = render(<TaskList tasks={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ─── EmptyState Tests ─────────────────────────────────────────────────────────

describe('EmptyState', () => {
  it('shows "No tasks yet" and Create task button when hasFilters is false', () => {
    render(
      <EmptyState hasFilters={false} onClearFilters={vi.fn()} onCreateTask={vi.fn()} />,
    );

    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument();
  });

  it('shows "No matching tasks" and Clear filters button when hasFilters is true', () => {
    render(
      <EmptyState hasFilters={true} onClearFilters={vi.fn()} onCreateTask={vi.fn()} />,
    );

    expect(screen.getByText(/no matching tasks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /create task/i })).not.toBeInTheDocument();
  });

  it('calls onClearFilters when Clear filters button is clicked', async () => {
    const onClearFilters = vi.fn();
    const user = userEvent.setup();
    render(
      <EmptyState hasFilters={true} onClearFilters={onClearFilters} onCreateTask={vi.fn()} />,
    );

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(onClearFilters).toHaveBeenCalledOnce();
  });

  it('calls onCreateTask when Create task button is clicked', async () => {
    const onCreateTask = vi.fn();
    const user = userEvent.setup();
    render(
      <EmptyState hasFilters={false} onClearFilters={vi.fn()} onCreateTask={onCreateTask} />,
    );

    await user.click(screen.getByRole('button', { name: /create task/i }));

    expect(onCreateTask).toHaveBeenCalledOnce();
  });
});
