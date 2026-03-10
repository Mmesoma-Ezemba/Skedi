import { useState, FormEvent } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { X } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
}

export function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [hasReminder, setHasReminder] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !startTime) return;

    onSave({
      title,
      category,
      type,
      location,
      startTime: new Date(startTime),
      duration,
      priority,
      status: 'todo',
      hasReminder,
    });
    
    // Reset form
    setTitle('');
    setCategory('');
    setType('');
    setLocation('');
    setStartTime('');
    setDuration(60);
    setPriority('medium');
    setHasReminder(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Task</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
            <input 
              required
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Study for exam"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <input 
                type="text" 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Economics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <input 
                type="text" 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g. Deep Work"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="e.g. Main Library"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time *</label>
              <input 
                required
                type="datetime-local" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (min)</label>
              <input 
                type="number" 
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasReminder}
                  onChange={(e) => setHasReminder(e.target.checked)}
                  className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Set Reminder</span>
              </label>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-blue-600 rounded-xl shadow-sm transition-colors"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
