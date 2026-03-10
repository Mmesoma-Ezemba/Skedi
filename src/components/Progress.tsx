import { Task } from '../types';

interface ProgressProps {
  tasks: Task[];
}

export function Progress({ tasks }: ProgressProps) {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Progress</h2>
        <p className="text-slate-600 dark:text-slate-400">Track your consistency and planning quality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hours Studied</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">12.5</p>
          <p className="text-sm text-emerald-500 font-medium mt-1">This week</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Plan Adherence</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">85%</p>
          <p className="text-sm text-emerald-500 font-medium mt-1">+5% from last week</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Strongest</h3>
          <p className="text-xl font-bold text-slate-900 dark:text-white truncate">Literature</p>
          <p className="text-sm text-slate-500 font-medium mt-1">90% confidence</p>
        </div>
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Weakest</h3>
          <p className="text-xl font-bold text-slate-900 dark:text-white truncate">Calculus</p>
          <p className="text-sm text-amber-500 font-medium mt-1">Needs attention</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Subject Breakdown</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-900 dark:text-white">Economics</span>
                <span className="text-sm text-slate-500">6h 30m / 10h</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-900 dark:text-white">Literature</span>
                <span className="text-sm text-slate-500">4h / 4h</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-medium text-slate-900 dark:text-white">Calculus</span>
                <span className="text-sm text-slate-500">2h / 8h</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Planning Adherence</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Completed Blocks</p>
                  <p className="text-sm text-slate-500">This week</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">14</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="material-symbols-outlined">cancel</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Skipped Blocks</p>
                  <p className="text-sm text-slate-500">This week</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">2</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined">autorenew</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Rebuilds Triggered</p>
                  <p className="text-sm text-slate-500">This week</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
