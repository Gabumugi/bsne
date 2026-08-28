import React from 'react';
import { User } from '../types';
import { Bell, Shield, Moon, Sun, LogOut, ChevronDown, UserCheck, Menu } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  announcementsCount: number;
  onOpenAnnouncements: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  users,
  onSwitchUser,
  darkMode,
  setDarkMode,
  announcementsCount,
  onOpenAnnouncements,
  unreadNotificationsCount,
  onOpenNotifications,
  onToggleMobileMenu,
}) => {
  const [showUserDropdown, ReactSetShowUserDropdown] = React.useState(false);
  const setShowUserDropdown = ReactSetShowUserDropdown;

  return (
    <header className={`h-16 px-4 md:px-6 flex items-center justify-between border-b transition-colors ${
      darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    } sticky top-0 z-30 shadow-xs`}>
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20">
            ENB
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base leading-tight tracking-tight">ENB Committee Portal</h1>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Collaboration Portal</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Center Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Notifications & Reminders"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>



        {/* Current User Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-3 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center space-x-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                  currentUser.role === 'Admin' ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}></span>
                <span>{currentUser.role}</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-400">Signed in as</p>
                <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{currentUser.email}</p>
              </div>
              <div className="py-1">
                <p className="px-4 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Demo Account</p>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center space-x-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      u.id === currentUser.id ? 'bg-indigo-50/60 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{u.department} • {u.role}</p>
                    </div>
                    {u.id === currentUser.id && <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
