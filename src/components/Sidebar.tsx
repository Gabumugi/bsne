import React from 'react';
import { LayoutDashboard, FolderKanban, MessageSquare, Megaphone, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filesCount: number;
  chatCount: number;
  announcementsCount: number;
  membersCount: number;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  filesCount,
  chatCount,
  announcementsCount,
  membersCount,
  darkMode,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'files', label: 'File Sharing', icon: FolderKanban, badge: filesCount },
    { id: 'chat', label: 'Live Chat', icon: MessageSquare, badge: chatCount },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, badge: announcementsCount },
    { id: 'members', label: 'Members', icon: Users, badge: membersCount },
    { id: 'ai-insights', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <aside className={`w-64 border-r flex flex-col transition-colors ${
      darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
    } h-[calc(100vh-4rem)] sticky top-16`}>
      <div className="p-4 space-y-1.5 flex-1">
        <p className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Main Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 font-semibold'
                  : darkMode
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : darkMode
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className={`p-3 rounded-xl border ${
          darkMode ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
        } text-xs space-y-2`}>
          <div className="flex items-center space-x-2 text-emerald-500 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Secure Committee Node</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            All files and chats are encrypted and restricted to authorized members.
          </p>
        </div>
      </div>
    </aside>
  );
};
