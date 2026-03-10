export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';
export type Timezone = string; // IANA timezone identifier

export interface Task {
  id: string;
  title: string;
  category?: string;
  type?: string; // e.g., 'Deep Work', 'Break', 'Calendar Event'
  location?: string;
  startTime: Date;
  duration: number; // minutes
  priority: TaskPriority;
  status: TaskStatus;
  hasReminder?: boolean;
}

export const CATEGORIES = ['Deep Work', 'Break', 'Calendar Event', 'Economics', 'General'] as const;
export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
export const STATUSES: TaskStatus[] = ['todo', 'in-progress', 'completed'];

export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central European (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
] as const;
