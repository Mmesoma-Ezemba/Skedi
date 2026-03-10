export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

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
