export const TASK_STATUS_VALUES = ['pending', 'in-progress', 'completed'] as const;

export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];
