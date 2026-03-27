import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CreateTaskDto } from '@task-manager/shared';
import { TaskForm } from './task-form';

// Minimal stubs for shadcn UI primitives used inside TaskForm.
// Select uses Radix portals — we replace with a native <select> so
// Controller / react-hook-form can register and validate the value.
vi.mock('@/components/ui/select', () => ({
  Select: ({
    children,
    onValueChange,
    value,
  }: {
    children: React.ReactNode;
    onValueChange?: (v: string) => void;
    value?: string;
  }) => (
    // Use defaultValue (uncontrolled) so the native <select> holds its own state.
    // This avoids React's controlled-select resetting behavior in jsdom,
    // while still notifying RHF's Controller via onValueChange.
    <select
      data-testid="select"
      defaultValue={value ?? ''}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <option value="">{placeholder}</option>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <option value={value}>{children}</option>
  ),
}));

interface FormTestProps {
  onSubmit?: (data: CreateTaskDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<CreateTaskDto>;
}

function renderForm(props: FormTestProps = {}): ReturnType<typeof render> {
  return render(
    <TaskForm
      onSubmit={props.onSubmit ?? vi.fn()}
      onCancel={props.onCancel ?? vi.fn()}
      isSubmitting={props.isSubmitting ?? false}
      submitLabel={props.submitLabel ?? 'Create Task'}
      defaultValues={props.defaultValues}
    />,
  );
}

describe('TaskForm — validation', () => {
  it('renders all expected fields', () => {
    renderForm();

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('shows validation error when title is empty on submit', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when title is too short (< 3 chars)', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/title/i), 'ab');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('does NOT show title error when title has 3+ characters', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/title/i), 'Fix bug');
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.queryByText(/title must be at least 3 characters/i)).not.toBeInTheDocument();
    });
  });

  it('calls onSubmit with correct data when form is valid', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderForm({ onSubmit });

    await user.type(screen.getByLabelText(/title/i), 'Fix critical bug');
    await user.type(screen.getByLabelText(/assignee/i), 'alice');

    // Directly call the onValueChange callback that the mocked Select exposes.
    // We get a reference to each select and fire a synthetic React change event
    // using fireEvent (which triggers React's event system, not just native DOM).
    const selects = screen.getAllByTestId('select') as HTMLSelectElement[];
    await act(async () => {
      fireEvent.change(selects[0], { target: { value: 'in-progress' } });
      fireEvent.change(selects[1], { target: { value: 'high' } });
    });

    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
    });

    const [calledWith] = onSubmit.mock.calls[0] as [Record<string, unknown>];
    expect(calledWith.title).toBe('Fix critical bug');
    expect(calledWith.assignee).toBe('alice');
    expect(calledWith.status).toBe('in-progress');
    expect(calledWith.priority).toBe('high');
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    renderForm({ onCancel });

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables buttons while submitting', () => {
    renderForm({ isSubmitting: true });

    expect(screen.getByRole('button', { name: /create task/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('shows custom submitLabel', () => {
    renderForm({ submitLabel: 'Save Changes' });

    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('prefills defaultValues when provided', () => {
    renderForm({
      defaultValues: {
        title: 'Prefilled title',
        description: 'Some description',
        assignee: 'bob',
      },
    });

    expect(screen.getByLabelText(/title/i)).toHaveValue('Prefilled title');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Some description');
    expect(screen.getByLabelText(/assignee/i)).toHaveValue('bob');
  });

  it('shows validation error when description exceeds 500 characters', async () => {
    const user = userEvent.setup();
    renderForm();

    const longDescription = 'a'.repeat(501);
    await user.type(screen.getByLabelText(/title/i), 'Valid title');
    await user.type(screen.getByLabelText(/description/i), longDescription);
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/description must be at most 500 characters/i)).toBeInTheDocument();
    });
  });

  it('onSubmit is NOT called when form is invalid', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderForm({ onSubmit });

    // Leave title empty — form is invalid
    await user.click(screen.getByRole('button', { name: /create task/i }));

    await waitFor(() => {
      expect(screen.getByText(/title must be at least 3 characters/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
