import { useState, FormEvent } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';

interface InboxProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
}

export function Inbox({ tasks, onAddTask }: InboxProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleQuickAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      title: newTaskTitle,
      startTime: new Date(), // Default to now, should be unscheduled ideally
      duration: 60,
      priority: 'medium',
      status: 'todo',
    });
    setNewTaskTitle('');
  };

  const inboxTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Inbox</h2>
        <p className="text-slate-600 dark:text-slate-400">Capture unscheduled tasks and ideas here.</p>
      </div>

      <form onSubmit={handleQuickAdd} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl py-4 pl-4 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </form>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        {inboxTasks.length > 0 ? (
          <ul className="divide-y divide-border-light dark:divide-border-dark">
            {inboxTasks.map(task => (
              <li key={task.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <button className="text-slate-300 hover:text-emerald-500 dark:text-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-[24px]">radio_button_unchecked</span>
                  </button>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      {task.category && <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{task.category}</span>}
                      {task.priority === 'high' && <span className="text-red-500 flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">local_fire_department</span> High</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
            <p>Your inbox is empty. Add a task above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
