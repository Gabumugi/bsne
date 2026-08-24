import React, { useState } from 'react';
import { Announcement, User } from '../types';
import { Megaphone, Plus, Clock, AlertCircle, X, CheckCircle2, Trash2 } from 'lucide-react';

interface AnnouncementsTabProps {
  announcements: Announcement[];
  currentUser: User;
  onPostAnnouncement: (announcement: any) => void;
  onDeleteAnnouncement: (id: string) => void;
  darkMode: boolean;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  announcements,
  currentUser,
  onPostAnnouncement,
  onDeleteAnnouncement,
  darkMode,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');
  const [category, setCategory] = useState('General');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    onPostAnnouncement({
      title,
      content,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      priority,
      category,
    });

    setTitle('');
    setContent('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Committee Announcements</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Official updates, meeting notices, and directive notices</p>
        </div>

        {currentUser.role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-6 rounded-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            } shadow-xs space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  ann.priority === 'high' ? 'bg-rose-500/10 text-rose-500 font-bold' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(ann.date).toLocaleDateString()} at {new Date(ann.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {currentUser.role === 'Admin' && (
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 transition-colors"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{ann.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{ann.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
              <img src={ann.authorAvatar} alt={ann.authorName} className="w-7 h-7 rounded-full object-cover" />
              <div className="text-xs">
                <span className="font-semibold text-slate-800 dark:text-white">{ann.authorName}</span>
                <span className="text-slate-400 ml-2">Posted official notice</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-2xl p-6 space-y-6 animate-in fade-in zoom-in-95`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">New Committee Announcement</h3>
                  <p className="text-xs text-slate-500">Broadcast updates to all members</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Committee Review & Directives"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="General">General</option>
                    <option value="Meeting">Meeting</option>
                    <option value="System">System Update</option>
                    <option value="Policy">Policy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Priority</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide announcement details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-xl text-xs border ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
