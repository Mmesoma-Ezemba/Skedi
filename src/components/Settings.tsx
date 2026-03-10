import { TIMEZONES } from '../types';

interface SettingsProps {
  timezone: string;
  onTimezoneChange: (tz: string) => void;
}

export function Settings({ timezone, onTimezoneChange }: SettingsProps) {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Settings</h2>
        <p className="text-slate-600 dark:text-slate-400">Manage your preferences and integrations.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
              <input type="text" defaultValue="Student" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" defaultValue="student@example.com" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => onTimezoneChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Study Preferences</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Preferred Focus Hours</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="focus" className="text-primary focus:ring-primary" defaultChecked />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Morning</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="focus" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Afternoon</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="focus" className="text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Evening</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preferred Session Length</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>45 minutes</option>
                <option>60 minutes</option>
                <option>90 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Daily Load</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>4 hours</option>
                <option>6 hours</option>
                <option>8 hours</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calendar Sync</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">Connected</span>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png" alt="Google Calendar" className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Google Calendar</p>
                <p className="text-sm text-slate-500">student@example.com</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors">
              Disconnect
            </button>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="px-6 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-medium shadow-sm transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
