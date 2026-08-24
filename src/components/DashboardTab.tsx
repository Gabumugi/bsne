import React from 'react';
import { CommitteeFile, ChatMessage, Announcement, User } from '../types';
import { FolderKanban, MessageSquare, Megaphone, Users, ArrowUpRight, FileText, Download, Sparkles, Clock } from 'lucide-react';

interface DashboardTabProps {
  files: CommitteeFile[];
  messages: ChatMessage[];
  announcements: Announcement[];
  users: User[];
  onNavigate: (tab: string) => void;
  darkMode: boolean;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  files,
  messages,
  announcements,
  users,
  onNavigate,
  darkMode,
}) => {
  const totalDownloads = files.reduce((acc, f) => acc + f.downloads, 0);
  const recentFiles = files.slice(0, 4);
  const recentAnnouncements = announcements.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Welcome Hero Card */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden ${
        darkMode ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-900/50 text-white' : 'bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-indigo-100 text-slate-800'
      } shadow-xs`}>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Committee Collaboration Portal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back to Project Committee Hub</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Collaborate on research, manage budgets, review safety protocols, and communicate securely in real-time with committee members.
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex items-center space-x-3">
          <button
            onClick={() => onNavigate('files')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center space-x-2"
          >
            <span>Browse Files</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('chat')}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-xs transition-all ${
              darkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            Open Chat Lounge
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Shared Files</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{files.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderKanban className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-emerald-500 font-medium">
            <span>{totalDownloads} total downloads</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Members</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{users.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-emerald-500 font-medium">
            <span>{users.filter(u => u.status === 'online').length} online now</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Chat Messages</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{messages.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-blue-500 font-medium">
            <span>Real-time channel active</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Announcements</p>
              <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{announcements.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Megaphone className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-1 text-xs text-amber-500 font-medium">
            <span>{announcements.filter(a => a.priority === 'high').length} high priority</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Files & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Shared Files</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Recently uploaded committee documentation and reports</p>
            </div>
            <button
              onClick={() => onNavigate('files')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  darkMode ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800' : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold truncate text-slate-800 dark:text-white">{file.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{file.category}</span>
                      <span>•</span>
                      <span>{file.uploaderName}</span>
                      <span>•</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('files')}
                  className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors shadow-xs"
                  title="View / Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Preview */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Announcements</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Important committee updates</p>
            </div>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              All ({announcements.length})
            </button>
          </div>

          <div className="space-y-4">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-xl border ${
                  darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/60 border-slate-100'
                } space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    ann.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {ann.category}
                  </span>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(ann.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
