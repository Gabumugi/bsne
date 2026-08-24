import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, AlertTriangle, Clock, Info, Trash2, X, Plus } from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  onAddReminder: (reminder: { title: string; message: string; minutes: number }) => void;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearNotification,
  onClearAll,
  onAddReminder,
  isOpen,
  onClose,
  darkMode,
}) => {
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(1);

  if (!isOpen) return null;

  const handleReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle) return;
    onAddReminder({
      title: reminderTitle,
      message: reminderMessage || 'Custom committee reminder alert',
      minutes: Number(reminderMinutes) || 1,
    });
    setReminderTitle('');
    setReminderMessage('');
    setShowAddReminderModal(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-indigo-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className={`w-full max-w-md ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} border-l shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base">Notifications & Reminders</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              {notifications.filter(n => !n.read).length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddReminderModal(true)}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Reminder</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 space-y-3 text-slate-400">
              <Bell className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-sm font-medium">No active notifications or reminders</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-4 rounded-xl border transition-all relative group cursor-pointer ${
                  item.read
                    ? darkMode ? 'bg-slate-800/30 border-slate-800 opacity-75' : 'bg-slate-50 border-slate-100 opacity-75'
                    : darkMode ? 'bg-slate-800/80 border-slate-700 shadow-sm' : 'bg-white border-indigo-100 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="shrink-0 mt-0.5">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearNotification(item.id);
                    }}
                    className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Dismiss Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
            <span className="text-xs text-slate-500">Click notification to mark as read</span>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>

      {/* Set Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Set Committee Reminder</h3>
              <button onClick={() => setShowAddReminderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReminderSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budget Review Meeting"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Details / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes for reminder..."
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold">Trigger In (Minutes)</label>
                <input
                  type="number"
                  min={1}
                  max={1440}
                  value={reminderMinutes}
                  onChange={(e) => setReminderMinutes(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
