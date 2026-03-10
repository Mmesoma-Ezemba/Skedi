import { useState } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

interface TimelineProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

export function Timeline({ tasks, onToggleComplete, onToggleReminder }: TimelineProps) {
  const [filter, setFilter] = useState<'all' | 'todo' | 'completed'>('all');
  const [sort, setSort] = useState<'time' | 'priority'>('time');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'time') {
      return a.startTime.getTime() - b.startTime.getTime();
    } else {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">schedule</span>
          Today's Timeline
        </h3>
        <div className="flex items-center gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="completed">Completed</option>
          </select>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="time">Sort by Time</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
        <AnimatePresence mode="popLayout">
          {sortedTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isCurrent = task.status === 'in-progress';
            
            return (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative pl-14 py-4 timeline-item"
              >
                <div className={cn(
                  "absolute left-0 top-5 w-12 text-right pr-4 text-xs font-semibold",
                  isCurrent ? "text-primary font-bold" : "text-slate-500"
                )}>
                  {format(task.startTime, 'H:mm')}
                </div>
                
                <div className={cn(
                  "absolute left-[44px] top-[22px] w-3 h-3 rounded-full z-10 transition-colors duration-300",
                  isCompleted ? "bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/30" : 
                  isCurrent ? "bg-primary ring-4 ring-primary/20 w-4 h-4 left-[42px] top-[20px] animate-pulse" :
                  task.category === 'Break' ? "bg-amber-400 ring-4 ring-amber-100 dark:ring-amber-900/30" :
                  "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                )}></div>
                
                <div className="timeline-line"></div>
                
                <div className={cn(
                  "rounded-xl p-4 transition-all duration-300 relative overflow-hidden group",
                  isCompleted ? "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 opacity-60" :
                  isCurrent ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary shadow-sm" :
                  task.category === 'Break' ? "bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 border-dashed p-3" :
                  "bg-white dark:bg-slate-800/50 border border-border-light dark:border-border-dark hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer"
                )}>
                  {isCurrent && <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 to-transparent"></div>}
                  
                  <div className="flex justify-between items-start">
                    <div>
                      {(task.category || task.type) && (
                        <div className="flex items-center gap-2 mb-1">
                          {task.category && (
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                              task.category === 'Economics' ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" :
                              task.category === 'Calendar Event' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                              "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                            )}>{task.category}</span>
                          )}
                          {task.type && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 uppercase">
                              {task.type}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <h5 className={cn(
                          "font-bold text-slate-900 dark:text-white transition-all duration-300",
                          isCompleted ? "line-through text-slate-500 dark:text-slate-400" :
                          isCurrent ? "text-lg" : ""
                        )}>{task.title}</h5>
                        
                        {task.priority === 'high' && !isCompleted && (
                          <span className="material-symbols-outlined text-[14px] text-red-500">local_fire_department</span>
                        )}
                      </div>
                      
                      {(task.location || task.type) && !isCompleted && task.category !== 'Break' && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                          {task.location && <><span className="material-symbols-outlined text-[16px]">location_on</span> {task.location}</>}
                          {!task.location && task.type && task.type}
                        </p>
                      )}
                      
                      {isCompleted && task.type && (
                        <p className="text-sm text-slate-500">{task.type} • {task.duration} min</p>
                      )}
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        {!isCompleted && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onToggleReminder(task.id); }}
                            className={cn(
                              "p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100",
                              task.hasReminder ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20 opacity-100" : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                            title={task.hasReminder ? "Reminder set" : "Set reminder"}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {task.hasReminder ? 'notifications_active' : 'notifications'}
                            </span>
                          </button>
                        )}
                        
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleComplete(task.id); }}
                          className={cn(
                            "transition-all duration-300 flex items-center justify-center",
                            isCompleted ? "text-emerald-500" : "text-slate-300 hover:text-emerald-500 dark:text-slate-600"
                          )}
                        >
                          <span className="material-symbols-outlined text-[24px]">
                            {isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                        </button>
                      </div>
                      
                      {!isCompleted && (
                        <div>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{task.duration} min</span>
                          {isCurrent && <p className="text-xs text-primary mt-1 font-medium">Up next</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {sortedTasks.length === 0 && (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">task</span>
            <p>No tasks found for the current filter.</p>
          </div>
        )}
      </div>
    </section>
  );
}
