import React, { useState } from 'react';
import { User, ActivityLog } from '../types';
import { Users, UserPlus, Shield, Mail, Trash2, X, CheckCircle2, Clock } from 'lucide-react';

interface MembersTabProps {
  users: User[];
  activities: ActivityLog[];
  currentUser: User;
  onAddMember: (memberData: any) => void;
  onDeleteMember: (id: string) => void;
  darkMode: boolean;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  users,
  activities,
  currentUser,
  onAddMember,
  onDeleteMember,
  darkMode,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Member'>('Member');
  const [department, setDepartment] = useState('Research');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddMember({ name, email, role, department });
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Committee Members & Directory</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage committee access, user roles, and monitor recent activity</p>
        </div>

        {currentUser.role === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Committee Member</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs space-y-4`}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Active Members ({users.length})</h3>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50/60 border-slate-100'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ${
                      darkMode ? 'ring-slate-900' : 'ring-white'
                    } ${u.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">{u.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{u.email} • <span className="font-medium text-indigo-600 dark:text-indigo-400">{u.department}</span></p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    u.role === 'Admin' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {u.role}
                  </span>

                  {currentUser.role === 'Admin' && u.id !== currentUser.id && (
                    <button
                      onClick={() => onDeleteMember(u.id)}
                      className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs space-y-4`}>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Activity Log</h3>
          </div>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="text-xs space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-white">{act.userName}</span>
                  <span className="text-[10px] text-slate-400">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {act.action}: <span className="font-medium text-indigo-600 dark:text-indigo-400">{act.target}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Add New Committee Member</h3>
                  <p className="text-xs text-slate-500">Grant portal access and email notifications</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Langdon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. robert.langdon@committee.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="Research & Development">Research & Development</option>
                    <option value="Finance & Budget">Finance & Budget</option>
                    <option value="Ethics & Compliance">Ethics & Compliance</option>
                    <option value="Executive Board">Executive Board</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Role</label>
                  <select
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
