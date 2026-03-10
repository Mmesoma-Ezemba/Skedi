import { useState } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay, isToday } from 'date-fns';
import { Task } from '../types';
import { cn } from '../utils';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = addDays(weekStart, 6);

  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock unplaced tasks
  const unplacedTasks = [
    { id: 'u1', title: 'Review Chapter 4', duration: 45, priority: 'medium' },
    { id: 'u2', title: 'Draft Essay Outline', duration: 60, priority: 'high' },
  ];

  const getTaskStyle = (task: Task) => {
    if (task.category === 'Deep Work' || task.type === 'Deep Work') {
      return "bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700/50 text-indigo-800 dark:text-indigo-300";
    }
    if (task.category === 'Break') {
      return "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300";
    }
    if (task.category === 'Calendar Event') {
      return "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-300";
    }
    return "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700/50 text-blue-800 dark:text-blue-300";
  };

  const getTaskIcon = (task: Task) => {
    if (task.category === 'Deep Work' || task.type === 'Deep Work') return 'psychology';
    if (task.category === 'Break') return 'coffee';
    if (task.category === 'Calendar Event') return 'event';
    return 'task_alt';
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-200 dark:border-slate-700/50">
            <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button onClick={goToToday} className="px-4 py-1.5 text-sm font-bold rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer">
              Today
            </button>
            <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white hidden md:block">
            {format(weekStart, 'MMMM d')} - {format(weekEnd, 'MMMM d, yyyy')}
          </h2>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors whitespace-nowrap cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors whitespace-nowrap cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">view_week</span>
            View
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 whitespace-nowrap cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Rebuild Week
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* Main Calendar Grid */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col overflow-hidden">
          {/* Calendar Header (Days) */}
          <div className="flex border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-16 shrink-0 border-r border-border-light dark:border-border-dark"></div>
            <div className="flex-1 grid grid-cols-7">
              {days.map((day, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "py-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 cursor-pointer transition-colors",
                    isSameDay(day, selectedDay) ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-lg font-bold",
                    isToday(day) ? "bg-primary text-white shadow-md shadow-primary/30" : 
                    isSameDay(day, selectedDay) ? "text-primary" : "text-slate-900 dark:text-white"
                  )}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Body (Time Grid) */}
          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            <div className="flex min-h-max">
              {/* Time Column */}
              <div className="w-16 shrink-0 border-r border-border-light dark:border-border-dark bg-slate-50/30 dark:bg-slate-900/10">
                {hours.map(hour => (
                  <div key={hour} className="h-20 border-b border-border-light dark:border-border-dark relative">
                    <span className="absolute -top-2.5 right-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {format(new Date().setHours(hour, 0), 'h a')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              <div className="flex-1 grid grid-cols-7 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                  {days.map((_, i) => (
                    <div key={i} className="border-r border-border-light dark:border-border-dark last:border-r-0">
                      {hours.map(hour => (
                        <div key={hour} className="h-20 border-b border-border-light dark:border-border-dark border-dashed opacity-50"></div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Current Time Indicator (Mocked for today) */}
                {isSameDay(new Date(), weekStart) && (
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
                    style={{ top: `${(new Date().getHours() - 6 + new Date().getMinutes() / 60) * 5}rem` }}
                  >
                    <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                )}

                {/* Tasks */}
                {days.map((day, dayIndex) => {
                  const dayTasks = tasks.filter(t => isSameDay(t.startTime, day));
                  
                  return (
                    <div key={dayIndex} className="relative h-full">
                      {dayTasks.map(task => {
                        const startHour = task.startTime.getHours();
                        const startMinute = task.startTime.getMinutes();
                        // Only show tasks within our 6 AM to 11 PM window
                        if (startHour < 6 || startHour >= 24) return null;
                        
                        const top = (startHour - 6 + startMinute / 60) * 5; // 5rem (80px) per hour
                        const height = (task.duration / 60) * 5;
                        
                        return (
                          <div 
                            key={task.id}
                            className={cn(
                              "absolute left-1 right-1 rounded-lg border p-2 shadow-sm flex flex-col overflow-hidden cursor-pointer hover:shadow-md transition-shadow group z-10",
                              getTaskStyle(task)
                            )}
                            style={{ top: `${top}rem`, height: `${height}rem` }}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-bold leading-tight truncate group-hover:whitespace-normal">{task.title}</h4>
                              {task.priority === 'high' && (
                                <span className="material-symbols-outlined text-[14px] text-red-500 shrink-0">local_fire_department</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-auto text-[10px] font-medium opacity-80">
                              <span className="material-symbols-outlined text-[12px]">{getTaskIcon(task)}</span>
                              {format(task.startTime, 'h:mm a')}
                            </div>
                            
                            {/* Resize handle */}
                            <div className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 flex justify-center items-center">
                              <div className="w-6 h-1 bg-current rounded-full opacity-30"></div>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Drag to create interaction layer */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none">
                        {/* Mock hover state for empty slots could go here */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
          {/* Selected Day Summary */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">today</span>
                {format(selectedDay, 'EEEE')}
              </h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                {format(selectedDay, 'MMM d')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">Deep Work</span>
                <span className="text-xl font-display font-bold text-indigo-900 dark:text-indigo-100">4.5h</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Breaks</span>
                <span className="text-xl font-display font-bold text-emerald-900 dark:text-emerald-100">1.5h</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Schedule Health</h4>
              
              {/* Risk Alert */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">warning</span>
                <div>
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Dense Afternoon</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">3 hours of continuous study scheduled. Consider adding a 15m break.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Unplaced Tasks */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-5 shadow-sm flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400">inbox</span>
                Unplaced Tasks
              </h3>
              <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">
                {unplacedTasks.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Drag these onto the calendar to schedule them.
            </p>
            
            <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
              {unplacedTasks.map(task => (
                <div 
                  key={task.id}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm cursor-grab hover:border-primary/50 hover:shadow-md transition-all group"
                  draggable
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                    <span className="material-symbols-outlined text-slate-400 text-[16px] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {task.duration}m
                    </span>
                    {task.priority === 'high' && (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                        High
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
