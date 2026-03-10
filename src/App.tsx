/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Task, TaskPriority, TaskStatus, TIMEZONES } from './types';
import { Timeline } from './components/Timeline';
import { CalendarView } from './components/CalendarView';
import { TaskModal } from './components/TaskModal';
import { Inbox } from './components/Inbox';
import { Deadlines } from './components/Deadlines';
import { Progress } from './components/Progress';
import { Settings } from './components/Settings';
import { cn } from './utils';

type Tab = 'today' | 'inbox' | 'calendar' | 'deadlines' | 'progress' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Calculus Problem Set',
      category: 'Deep Work',
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      duration: 60,
      priority: 'medium',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Intro to Microeconomics',
      category: 'Economics',
      type: 'Deep Work',
      location: 'Main Library',
      startTime: new Date(new Date().setHours(10, 30, 0, 0)),
      duration: 90,
      priority: 'high',
      status: 'in-progress',
    },
    {
      id: '3',
      title: 'Lunch & Recover',
      category: 'Break',
      startTime: new Date(new Date().setHours(12, 0, 0, 0)),
      duration: 60,
      priority: 'low',
      status: 'todo',
    },
    {
      id: '4',
      title: 'Physics 101 Lecture',
      category: 'Calendar Event',
      location: 'Science Building, Room 402',
      startTime: new Date(new Date().setHours(13, 0, 0, 0)),
      duration: 90,
      priority: 'medium',
      status: 'todo',
    }
  ]);

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'completed' ? 'todo' : 'completed'
        };
      }
      return task;
    }));
  };

  const handleToggleReminder = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          hasReminder: !task.hasReminder
        };
      }
      return task;
    }));
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const remainingTasks = tasks.filter(t => t.status !== 'completed').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Next Best Task */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">target</span>
                    Next Best Task
                  </h3>
                </div>
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-indigo-500/10 dark:from-primary/20 dark:to-indigo-500/20 border border-primary/20 dark:border-primary/30 shadow-lg shadow-primary/5">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
                  <div className="p-8 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wide mb-4">
                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                        High Priority
                      </div>
                      <h4 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight mb-2">
                        Study Intro to Microeconomics
                      </h4>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                          <span className="material-symbols-outlined text-amber-500 mt-0.5">psychology</span>
                          <div>
                            <span className="font-semibold block text-sm">Why this matters now:</span>
                            <span className="text-sm">High-stakes exam in 3 days. Your cognitive focus is at its daily peak.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col gap-3 shrink-0 bg-white/60 dark:bg-slate-800/60 p-5 rounded-2xl backdrop-blur-md border border-white/40 dark:border-slate-700/40">
                      <div className="text-center mb-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400 block">Est. Time</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">90 min</span>
                      </div>
                      <button className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full cursor-pointer">
                        <span className="material-symbols-outlined">play_arrow</span>
                        Start Session
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Today's Timeline */}
              <Timeline
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onToggleReminder={handleToggleReminder}
              />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Focus Readiness Widget */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Focus Readiness
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-display font-bold text-emerald-500">High</span>
                  <span className="text-sm font-medium text-slate-500">Peak Time</span>
                </div>
                {/* Graph visualization */}
                <div className="h-16 flex items-end gap-1 mt-4">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[30%]"></div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[50%]"></div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[70%]"></div>
                  <div className="w-full bg-emerald-500 rounded-t-sm h-[100%] shadow-[0_0_10px_rgba(16,185,129,0.4)] relative">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap hidden sm:block">Now</div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-sm h-[80%]"></div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[40%]"></div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-sm h-[20%]"></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>8 AM</span>
                  <span>12 PM</span>
                  <span>4 PM</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  Your cognitive energy usually peaks between 10:00 AM and 1:00 PM. Perfect for Deep Work.
                </p>
              </div>

              {/* Upcoming Deadlines Widget */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                  Upcoming Deadlines
                </h3>
                <div className="flex flex-col gap-4">
                  {/* Deadline 1 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 transition-transform hover:scale-[1.02] cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/40 flex flex-col items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                      <span className="text-xs font-bold leading-none">OCT</span>
                      <span className="text-lg font-bold leading-none mt-1">27</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">Microeconomics Midterm</h4>
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">3 Days Left</p>
                    </div>
                  </div>
                  {/* Deadline 2 */}
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-border-light dark:hover:border-border-dark transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <span className="text-xs font-bold leading-none">NOV</span>
                      <span className="text-lg font-bold leading-none mt-1">02</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">Literature Essay Draft</h4>
                      <p className="text-xs text-slate-500 mt-0.5">9 Days Left</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Health Widget */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 p-6 shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-indigo-500/10 dark:text-indigo-400/5 pointer-events-none">health_and_safety</span>
                <h3 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  Schedule Health
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 relative z-10">
                  Your schedule is well-balanced today. You have enough buffer time between major study blocks to avoid burnout.
                </p>
                <div className="bg-white/60 dark:bg-slate-900/60 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3 relative z-10">
                  <span className="material-symbols-outlined text-indigo-500">tips_and_updates</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Suggestion: Keep your 12:00 PM break sacred to maintain afternoon focus.</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'inbox':
        return <Inbox tasks={tasks} onAddTask={handleAddTask} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onUpdateTask={handleUpdateTask} onAddTask={handleAddTask} timezone={timezone} />;
      case 'deadlines':
        return <Deadlines tasks={tasks} />;
      case 'progress':
        return <Progress tasks={tasks} />;
      case 'settings':
        return <Settings timezone={timezone} onTimezoneChange={setTimezone} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen font-sans">
      <div className="flex h-screen overflow-hidden">
        <div className="flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden">
          {/* Top Navigation */}
          <header className="sticky top-0 z-50 glass-panel border-b border-border-light/50 dark:border-border-dark/50 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                  <span className="material-symbols-outlined text-xl">auto_awesome</span>
                </div>
                <h1 className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white">ExamFlow</h1>
              </div>
              <nav className="hidden lg:flex items-center gap-1">
                {(['today', 'inbox', 'calendar', 'deadlines', 'progress', 'settings'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer capitalize",
                      activeTab === tab ? "bg-primary/10 text-primary" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {tab === 'today' ? 'today' :
                        tab === 'inbox' ? 'inbox' :
                          tab === 'calendar' ? 'calendar_month' :
                            tab === 'deadlines' ? 'notification_important' :
                              tab === 'progress' ? 'analytics' : 'settings'}
                    </span>
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-xl">search</span>
                <input className="w-full bg-slate-100/50 dark:bg-slate-800/50 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl py-2.5 pl-11 pr-12 text-sm transition-all backdrop-blur-sm outline-none" placeholder="Search tasks, subjects, or notes..." type="text" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex h-5 w-5 items-center justify-center rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-sans text-[10px] font-medium text-slate-400">/</kbd>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all relative cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <div className="h-6 w-px bg-border-light dark:bg-border-dark mx-1"></div>
              <button className="flex items-center gap-3 p-1.5 pl-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-border-light dark:hover:border-border-dark cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Alex Rivera</p>
                  <p className="text-[10px] text-emerald-500 font-medium mt-1 flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Online
                  </p>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 rounded-lg bg-cover bg-center border border-primary/20 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkMw5ftcfCGER0on-73gdIyFLrlf2wUhvNdj_E50kEBZwSGu7ev-7lt9j9YkCsFI7YkQas5bH_w0YveMnPzHCT9ZwIwgyP0HvNs-VaQXHovNrf7j4mhlXriUqC8KFg32uYzvqijK8W2nPQKkcNtfaETOqm6UfbS-qo6L_e3_cM_iYTyVkbhCmsyjQQBPLM9S1YC3BKOLkDI5CVj0gUVYQkJePxLWlJ5nGheBQpMxRn13ebM_xa_p0ahiS_j3xehhP1T-WuCYUVm2VX")' }}></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
            {/* Header Section (Only show on Today tab) */}
            {activeTab === 'today' && (
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex items-center gap-6">
                  {/* Circular Progress */}
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner">
                    <svg className="w-full h-full -rotate-90 absolute top-0 left-0" viewBox="0 0 36 36">
                      <path className="text-slate-200 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                      <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${Math.round(((tasks.length - remainingTasks) / tasks.length) * 100)}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                    </svg>
                    <div className="text-center z-10">
                      <span className="block text-2xl font-bold text-slate-900 dark:text-white leading-none">
                        {Math.round(((tasks.length - remainingTasks) / tasks.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Good morning, Alex.</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2 text-lg">You have <strong className="text-primary">{remainingTasks} tasks</strong> remaining for today.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-2 bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30 px-5 py-3 rounded-xl transition-all duration-300 font-medium cursor-pointer"
                  >
                    <span className="material-symbols-outlined">add</span>
                    Add Task
                  </button>
                  <button className="group flex items-center gap-2 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm hover:shadow-md hover:border-primary/50 text-slate-700 dark:text-slate-200 px-5 py-3 rounded-xl transition-all duration-300 font-medium cursor-pointer">
                    <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform duration-500">sync</span>
                    Rebuild My Day
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Content */}
            {renderContent()}
          </main>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
      />
    </div>
  );
}
