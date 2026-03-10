import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay, isToday, setHours, setMinutes } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Task, TaskPriority, TaskStatus as TStatus, CATEGORIES, PRIORITIES, STATUSES, TIMEZONES } from '../types';
import { cn } from '../utils';

/* ─── props ─── */
interface CalendarViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  timezone: string;
}

/* ─── helpers ─── */
const formatTimeInTZ = (date: Date, tz: string, fmt: string = 'h:mm a') => {
  try {
    return new Date(date).toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return format(date, fmt);
  }
};

const getHourInTZ = (date: Date, tz: string): number => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: false }).formatToParts(date);
    const hourPart = parts.find(p => p.type === 'hour');
    return hourPart ? parseInt(hourPart.value, 10) : date.getHours();
  } catch {
    return date.getHours();
  }
};

const getMinuteInTZ = (date: Date, tz: string): number => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, minute: 'numeric' }).formatToParts(date);
    const minPart = parts.find(p => p.type === 'minute');
    return minPart ? parseInt(minPart.value, 10) : date.getMinutes();
  } catch {
    return date.getMinutes();
  }
};

/* ─── component ─── */
export function CalendarView({ tasks, onUpdateTask, onAddTask, timezone }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  // Timezone
  const [viewUTC, setViewUTC] = useState(false);
  const activeTZ = viewUTC ? 'UTC' : timezone;

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<TaskPriority | null>(null);
  const [filterStatus, setFilterStatus] = useState<TStatus | null>(null);
  const activeFilterCount = [filterCategory, filterPriority, filterStatus].filter(Boolean).length;

  // Create-from-slot modal
  const [createSlot, setCreateSlot] = useState<{ day: Date; hour: number } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Deep Work');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDuration, setNewDuration] = useState(60);

  // Drag state
  const [dragOverSlot, setDragOverSlot] = useState<{ dayIdx: number; hour: number } | null>(null);
  const dragTaskIdRef = useRef<string | null>(null);

  // Resize state
  const resizingRef = useRef<{ taskId: string; startY: number; origDuration: number } | null>(null);

  // Week navigation
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToToday = () => { setCurrentDate(new Date()); setSelectedDay(new Date()); };

  const hours = Array.from({ length: 18 }, (_, i) => i + 6);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Unplaced tasks (mock sidebar items)
  const unplacedTasks = useMemo(() => [
    { id: 'u1', title: 'Review Chapter 4', duration: 45, priority: 'medium' as const },
    { id: 'u2', title: 'Draft Essay Outline', duration: 60, priority: 'high' as const },
  ], []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filterCategory && (t.category || t.type) !== filterCategory && t.category !== filterCategory && t.type !== filterCategory) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      return true;
    });
  }, [tasks, filterCategory, filterPriority, filterStatus]);

  // Unique categories from tasks
  const taskCategories = useMemo(() => {
    const cats = new Set<string>();
    tasks.forEach(t => { if (t.category) cats.add(t.category); if (t.type) cats.add(t.type); });
    return Array.from(cats);
  }, [tasks]);

  /* ─── Task styles ─── */
  const getTaskStyle = (task: Task) => {
    if (task.category === 'Deep Work' || task.type === 'Deep Work') {
      return "bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/50 dark:to-indigo-800/30 border-indigo-300/70 dark:border-indigo-600/50 text-indigo-800 dark:text-indigo-200";
    }
    if (task.category === 'Break') {
      return "bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-800/30 border-emerald-300/70 dark:border-emerald-600/50 text-emerald-800 dark:text-emerald-200";
    }
    if (task.category === 'Calendar Event') {
      return "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/80 dark:to-slate-700/60 border-slate-300/70 dark:border-slate-600/50 text-slate-800 dark:text-slate-200";
    }
    return "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/30 border-blue-300/70 dark:border-blue-600/50 text-blue-800 dark:text-blue-200";
  };

  const getTaskIcon = (task: Task) => {
    if (task.category === 'Deep Work' || task.type === 'Deep Work') return 'psychology';
    if (task.category === 'Break') return 'coffee';
    if (task.category === 'Calendar Event') return 'event';
    return 'task_alt';
  };

  /* ─── Drag & Drop ─── */
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    dragTaskIdRef.current = taskId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDragOverSlot(null);
  }, []);

  const handleSlotDragOver = useCallback((e: React.DragEvent, dayIdx: number, hour: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSlot({ dayIdx, hour });
  }, []);

  const handleSlotDragLeave = useCallback(() => {
    setDragOverSlot(null);
  }, []);

  const handleSlotDrop = useCallback((e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || dragTaskIdRef.current;
    if (!taskId) return;
    setDragOverSlot(null);

    // Check if it's an existing task
    const existingTask = tasks.find(t => t.id === taskId);
    if (existingTask) {
      const newStart = new Date(day);
      newStart.setHours(hour, 0, 0, 0);
      onUpdateTask({ ...existingTask, startTime: newStart });
      return;
    }

    // Check if it's an unplaced task
    const unplaced = unplacedTasks.find(t => t.id === taskId);
    if (unplaced) {
      const newStart = new Date(day);
      newStart.setHours(hour, 0, 0, 0);
      onAddTask({
        title: unplaced.title,
        category: 'Deep Work',
        startTime: newStart,
        duration: unplaced.duration,
        priority: unplaced.priority,
        status: 'todo',
      });
    }
  }, [tasks, unplacedTasks, onUpdateTask, onAddTask]);

  /* ─── Resize ─── */
  const handleResizeStart = useCallback((e: React.MouseEvent, taskId: string, currentDuration: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizingRef.current = { taskId, startY: e.clientY, origDuration: currentDuration };

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const deltaY = ev.clientY - resizingRef.current.startY;
      const deltaMinutes = Math.round((deltaY / 80) * 60);
      const newDuration = Math.max(15, resizingRef.current.origDuration + deltaMinutes);
      const task = tasks.find(t => t.id === resizingRef.current!.taskId);
      if (task) {
        onUpdateTask({ ...task, duration: newDuration });
      }
    };

    const onMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [tasks, onUpdateTask]);

  /* ─── Create from slot ─── */
  const handleSlotClick = useCallback((day: Date, hour: number) => {
    setCreateSlot({ day, hour });
    setNewTitle('');
    setNewCategory('Deep Work');
    setNewPriority('medium');
    setNewDuration(60);
  }, []);

  const handleCreateTask = useCallback(() => {
    if (!createSlot || !newTitle.trim()) return;
    const startTime = new Date(createSlot.day);
    startTime.setHours(createSlot.hour, 0, 0, 0);
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      startTime,
      duration: newDuration,
      priority: newPriority,
      status: 'todo',
    });
    setCreateSlot(null);
  }, [createSlot, newTitle, newCategory, newPriority, newDuration, onAddTask]);

  /* ─── Clear filters ─── */
  const clearFilters = () => {
    setFilterCategory(null);
    setFilterPriority(null);
    setFilterStatus(null);
  };

  /* ─── Current time indicator position ─── */
  const now = new Date();
  const currentHourInTZ = getHourInTZ(now, activeTZ);
  const currentMinuteInTZ = getMinuteInTZ(now, activeTZ);
  const nowTopRem = (currentHourInTZ - 6 + currentMinuteInTZ / 60) * 5;
  const showCurrentTimeLine = currentHourInTZ >= 6 && currentHourInTZ < 24;

  // Determine which day column the current time line should appear in
  const todayColumnIndex = days.findIndex(d => isToday(d));

  return (
    <div className="flex flex-col h-full gap-6">
      {/* ═══ Top Controls ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-200 dark:border-slate-700/50">
            <button onClick={prevWeek} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all cursor-pointer" title="Previous week">
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button onClick={goToToday} className="px-4 py-1.5 text-sm font-bold rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm transition-all cursor-pointer">
              Today
            </button>
            <button onClick={nextWeek} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm transition-all cursor-pointer" title="Next week">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white hidden md:block">
            {format(weekStart, 'MMMM d')} – {format(weekEnd, 'MMMM d, yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {/* Timezone toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700/50 shrink-0">
            <button
              onClick={() => setViewUTC(false)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                !viewUTC ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >Local</button>
            <button
              onClick={() => setViewUTC(true)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                viewUTC ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >UTC</button>
          </div>

          {/* Filters button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 border rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
                showFilters || activeFilterCount > 0
                  ? "bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>

            {/* Filter dropdown */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Filter Tasks</h4>
                    {activeFilterCount > 0 && (
                      <button onClick={clearFilters} className="text-xs font-medium text-primary hover:underline cursor-pointer">Clear all</button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="mb-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {taskCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                          className={cn(
                            "filter-chip px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer",
                            filterCategory === cat
                              ? "bg-primary/10 border-primary/30 text-primary filter-chip-active"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                          )}
                        >{cat}</button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div className="mb-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Priority</label>
                    <div className="flex gap-1.5">
                      {PRIORITIES.map(p => (
                        <button
                          key={p}
                          onClick={() => setFilterPriority(filterPriority === p ? null : p)}
                          className={cn(
                            "filter-chip px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize cursor-pointer",
                            filterPriority === p
                              ? "bg-primary/10 border-primary/30 text-primary filter-chip-active"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                          )}
                        >{p}</button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Status</label>
                    <div className="flex gap-1.5">
                      {STATUSES.map(s => (
                        <button
                          key={s}
                          onClick={() => setFilterStatus(filterStatus === s ? null : s)}
                          className={cn(
                            "filter-chip px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize cursor-pointer",
                            filterStatus === s
                              ? "bg-primary/10 border-primary/30 text-primary filter-chip-active"
                              : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                          )}
                        >{s.replace('-', ' ')}</button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 whitespace-nowrap cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Rebuild Week
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* ═══ Main Calendar Grid ═══ */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm flex flex-col overflow-hidden">
          {/* Calendar Header (Days) */}
          <div className="flex border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/20">
            <div className="w-16 shrink-0 border-r border-border-light dark:border-border-dark flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {viewUTC ? 'UTC' : 'Local'}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {days.map((day, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "py-3 text-center border-r border-border-light dark:border-border-dark last:border-r-0 cursor-pointer transition-all duration-200",
                    isSameDay(day, selectedDay) ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                  )}
                >
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    {format(day, 'EEE')}
                  </div>
                  <div className={cn(
                    "w-8 h-8 mx-auto flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200",
                    isToday(day) ? "bg-primary text-white shadow-md shadow-primary/30" :
                      isSameDay(day, selectedDay) ? "text-primary ring-2 ring-primary/20" : "text-slate-900 dark:text-white"
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
                      {new Date(0, 0, 0, hour, 0).toLocaleTimeString('en-US', {
                        timeZone: activeTZ,
                        hour: 'numeric',
                        minute: undefined,
                        hour12: true,
                      }).replace(':00', '').replace(' ', ' ')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              <div className="flex-1 grid grid-cols-7 relative">
                {/* Grid Lines (clickable slots) */}
                <div className="absolute inset-0 grid grid-cols-7">
                  {days.map((day, dayIdx) => (
                    <div key={dayIdx} className="border-r border-border-light dark:border-border-dark last:border-r-0">
                      {hours.map(hour => (
                        <div
                          key={hour}
                          className={cn(
                            "h-20 border-b border-border-light/50 dark:border-border-dark/50 border-dashed calendar-slot-hover cursor-pointer transition-colors",
                            dragOverSlot?.dayIdx === dayIdx && dragOverSlot?.hour === hour && "calendar-slot-dragover"
                          )}
                          onClick={() => handleSlotClick(day, hour)}
                          onDragOver={(e) => handleSlotDragOver(e, dayIdx, hour)}
                          onDragLeave={handleSlotDragLeave}
                          onDrop={(e) => handleSlotDrop(e, day, hour)}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Current Time Indicator */}
                {showCurrentTimeLine && todayColumnIndex >= 0 && (
                  <div
                    className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
                    style={{ top: `${nowTopRem}rem` }}
                  >
                    <div className="absolute -left-0 w-full border-t-2 border-red-500/80" />
                    <div
                      className="absolute -top-1.5 w-3 h-3 bg-red-500 rounded-full pulse-dot"
                      style={{ left: `${(todayColumnIndex / 7) * 100}%` }}
                    />
                  </div>
                )}

                {/* Tasks */}
                {days.map((day, dayIndex) => {
                  const dayTasks = filteredTasks.filter(t => isSameDay(t.startTime, day));

                  return (
                    <div key={dayIndex} className="relative h-full" style={{ gridColumn: dayIndex + 1 }}>
                      <AnimatePresence mode="popLayout">
                        {dayTasks.map(task => {
                          const startHour = task.startTime.getHours();
                          const startMinute = task.startTime.getMinutes();
                          if (startHour < 6 || startHour >= 24) return null;

                          const top = (startHour - 6 + startMinute / 60) * 5;
                          const height = Math.max((task.duration / 60) * 5, 1.25);

                          return (
                            <motion.div
                              key={task.id}
                              layout
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              draggable
                              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, task.id)}
                              onDragEnd={(e) => handleDragEnd(e as unknown as React.DragEvent)}
                              className={cn(
                                "absolute left-1 right-1 rounded-xl border p-2 shadow-sm flex flex-col overflow-hidden cursor-grab hover:shadow-lg transition-shadow group z-10 backdrop-blur-[2px]",
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
                              {height > 2.5 && (
                                <div className="flex items-center gap-1 mt-auto text-[10px] font-medium opacity-80">
                                  <span className="material-symbols-outlined text-[12px]">{getTaskIcon(task)}</span>
                                  {formatTimeInTZ(task.startTime, activeTZ)}
                                </div>
                              )}

                              {/* Resize handle */}
                              <div
                                className="resize-handle absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize flex justify-center items-center"
                                onMouseDown={(e) => handleResizeStart(e, task.id, task.duration)}
                              >
                                <div className="w-8 h-1 bg-current rounded-full opacity-40" />
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Right Panel ═══ */}
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

            {/* Day stats */}
            {(() => {
              const dayTasks = filteredTasks.filter(t => isSameDay(t.startTime, selectedDay));
              const deepWorkMins = dayTasks.filter(t => t.category === 'Deep Work' || t.type === 'Deep Work').reduce((sum, t) => sum + t.duration, 0);
              const breakMins = dayTasks.filter(t => t.category === 'Break').reduce((sum, t) => sum + t.duration, 0);
              return (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 block mb-1">Deep Work</span>
                    <span className="text-xl font-display font-bold text-indigo-900 dark:text-indigo-100">{(deepWorkMins / 60).toFixed(1)}h</span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">Breaks</span>
                    <span className="text-xl font-display font-bold text-emerald-900 dark:text-emerald-100">{(breakMins / 60).toFixed(1)}h</span>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Schedule Health</h4>
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
                <motion.div
                  key={task.id}
                  layout
                  whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
                  draggable
                  onDragStart={(e) => {
                    dragTaskIdRef.current = task.id;
                    (e as unknown as React.DragEvent).dataTransfer?.setData?.('text/plain', task.id);
                  }}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm cursor-grab hover:border-primary/50 transition-all group"
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Create Task Modal ═══ */}
      <AnimatePresence>
        {createSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setCreateSlot(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-surface-dark w-full max-w-md rounded-2xl shadow-2xl border border-border-light dark:border-border-dark overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-900/20">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Task</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {format(createSlot.day, 'EEEE, MMM d')} at {createSlot.hour > 12 ? createSlot.hour - 12 : createSlot.hour}:00 {createSlot.hour >= 12 ? 'PM' : 'AM'}
                  </p>
                </div>
                <button onClick={() => setCreateSlot(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                  <input
                    autoFocus
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="e.g., Study for Calculus exam"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {PRIORITIES.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (minutes)</label>
                  <div className="flex gap-2">
                    {[30, 45, 60, 90, 120].map(d => (
                      <button
                        key={d}
                        onClick={() => setNewDuration(d)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                          newDuration === d
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        )}
                      >{d}m</button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setCreateSlot(null)}
                    className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  >Cancel</button>
                  <button
                    onClick={handleCreateTask}
                    disabled={!newTitle.trim()}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-primary rounded-xl shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 cursor-pointer"
                  >Create Task</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
