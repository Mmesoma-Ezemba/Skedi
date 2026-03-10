import { Task } from '../types';

interface DeadlinesProps {
  tasks: Task[];
}

export function Deadlines({ tasks }: DeadlinesProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Deadlines</h2>
        <p className="text-slate-600 dark:text-slate-400">Strategic overview of your academic pressure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Next Exam</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">Microeconomics</p>
          <p className="text-sm text-red-500 font-medium mt-1">In 3 days</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Assignments Due</h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
          <p className="text-sm text-slate-500 font-medium mt-1">This week</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Subjects at Risk</h3>
          <p className="text-2xl font-bold text-amber-500">1</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Calculus</p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-light dark:border-border-dark">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Deadlines</h3>
        </div>
        <ul className="divide-y divide-border-light dark:divide-border-dark">
          <li className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/40 flex flex-col items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <span className="text-xs font-bold leading-none">OCT</span>
                <span className="text-lg font-bold leading-none mt-1">27</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Microeconomics Midterm</h4>
                <p className="text-sm text-slate-500">Economics • Exam</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-red-500">3 Days Left</p>
                <p className="text-xs text-slate-500">At Risk</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </li>
          <li className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                <span className="text-xs font-bold leading-none">NOV</span>
                <span className="text-lg font-bold leading-none mt-1">02</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">Literature Essay Draft</h4>
                <p className="text-sm text-slate-500">Literature • Assignment</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">9 Days Left</p>
                <p className="text-xs text-emerald-500">On Track</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
