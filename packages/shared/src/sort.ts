export const SORT_FIELD_VALUES = ['dueDate', 'priority', 'createdAt'] as const;
export type SortField = (typeof SORT_FIELD_VALUES)[number];

export const SORT_DIRECTION_VALUES = ['asc', 'desc'] as const;
export type SortDirection = (typeof SORT_DIRECTION_VALUES)[number];
