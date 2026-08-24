import React, { useState, useEffect, lazy, Suspense } from 'react';
import { User, CommitteeFile, ChatMessage, Announcement, ActivityLog, NotificationItem } from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Lazy loaded tabs for performance optimization
const DashboardTab = lazy(() => import('./components/DashboardTab').then(m => ({ default: m.DashboardTab })));
const FileSharingTab = lazy(() => import('./components/FileSharingTab').then(m => ({ default: m.FileSharingTab })));
const LiveChatTab = lazy(() => import('./components/LiveChatTab').then(m => ({ default: m.LiveChatTab })));
const AnnouncementsTab = lazy(() => import('./components/AnnouncementsTab').then(m => ({ default: m.AnnouncementsTab })));
const MembersTab = lazy(() => import('./components/MembersTab').then(m => ({ default: m.MembersTab })));
const AIInsightsTab = lazy(() => import('./components/AIInsightsTab').then(m => ({ default: m.AIInsightsTab })));
const NotificationCenter = lazy(() => import('./components/NotificationCenter').then(m => ({ default: m.NotificationCenter })));

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [files, setFiles] = useState<CommitteeFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Q3 Roadmap Uploaded',
      message: 'Prof. Arthur Pendelton uploaded Q3_Strategic_Roadmap_2026.pdf with Gemini AI summary.',
      type: 'success',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Committee Meeting Reminder',
      message: 'Quarterly review scheduled for this Friday at 10:00 AM UTC in Conference Room A.',
      type: 'reminder',
      timestamp: 'Yesterday',
      read: false,
    }
  ]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [uRes, fRes, mRes, aRes, actRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/files'),
          fetch('/api/chat'),
          fetch('/api/announcements'),
          fetch('/api/activities'),
        ]);

        const usersData = await uRes.json();
        const filesData = await fRes.json();
        const messagesData = await mRes.json();
        const announcementsData = await aRes.json();
        const activitiesData = await actRes.json();

        setUsers(usersData);
        if (usersData.length > 0) {
          setCurrentUser(usersData[0]); // Default to Admin
        }
        setFiles(filesData);
        setMessages(messagesData);
        setAnnouncements(announcementsData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handlers
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setNotifications(prev => [
      {
        id: 'n_' + Date.now(),
        title: 'Account Switched',
        message: `Now viewing portal as ${user.name} (${user.role}).`,
        type: 'info',
        timestamp: 'Just now',
        read: false,
      },
      ...prev
    ]);
  };

  const handleUploadFile = async (fileData: any) => {
    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData),
      });
      const newFile = await res.json();
      setFiles(prev => [newFile, ...prev]);
      
      // Add notification
      setNotifications(prev => [
        {
          id: 'n_' + Date.now(),
          title: 'New File Uploaded',
          message: `${fileData.uploaderName || 'User'} uploaded "${newFile.name}" into ${newFile.category}.`,
          type: 'success',
          timestamp: 'Just now',
          read: false,
        },
        ...prev
      ]);

      // refresh activities
      const actRes = await fetch('/api/activities');
      setActivities(await actRes.json());
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await fetch(`/api/files/${fileId}`, { method: 'DELETE' });
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/files/${fileId}/download`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, downloads: data.downloads } : f));
      }
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const handleSendMessage = async (text: string, fileAttachment?: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text,
          fileAttachment,
        }),
      });
      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleReactMessage = async (messageId: string, emoji: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/chat/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId: currentUser.id }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: data.reactions } : m));
      }
    } catch (err) {
      console.error("Error reacting to message:", err);
    }
  };

  const handlePostAnnouncement = async (annData: any) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annData),
      });
      const newAnn = await res.json();
      setAnnouncements(prev => [newAnn, ...prev]);

      // Add notification
      setNotifications(prev => [
        {
          id: 'n_' + Date.now(),
          title: `New Announcement: ${newAnn.title}`,
          message: newAnn.content.substring(0, 100) + '...',
          type: 'warning',
          timestamp: 'Just now',
          read: false,
        },
        ...prev
      ]);
    } catch (err) {
      console.error("Error posting announcement:", err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  const handleAddMember = async (memberData: any) => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);

      setNotifications(prev => [
        {
          id: 'n_' + Date.now(),
          title: 'New Member Joined',
          message: `${newUser.name} joined the committee in ${newUser.department}.`,
          type: 'info',
          timestamp: 'Just now',
          read: false,
        },
        ...prev
      ]);

      const actRes = await fetch('/api/activities');
      setActivities(await actRes.json());
    } catch (err) {
      console.error("Error adding member:", err);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  // Notification handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleAddReminder = ({ title, message, minutes }: { title: string; message: string; minutes: number }) => {
    const newNotif: NotificationItem = {
      id: 'n_' + Date.now(),
      title: `Reminder: ${title}`,
      message,
      type: 'reminder',
      timestamp: `Scheduled for ${minutes} min(s)`,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setIsNotificationCenterOpen(true);
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-xl mx-auto animate-pulse">
            PC
          </div>
          <p className="text-sm font-medium text-slate-400">Loading Project Committee Hub...</p>
        </div>
      </div>
    );
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors`}>
      <Navbar
        currentUser={currentUser}
        users={users}
        onSwitchUser={handleSwitchUser}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        announcementsCount={announcements.length}
        onOpenAnnouncements={() => setActiveTab('announcements')}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      />

      <Suspense fallback={null}>
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onClearNotification={handleClearNotification}
          onClearAll={handleClearAllNotifications}
          onAddReminder={handleAddReminder}
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          darkMode={darkMode}
        />
      </Suspense>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filesCount={files.length}
            chatCount={messages.length}
            announcementsCount={announcements.length}
            membersCount={users.length}
            darkMode={darkMode}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-72 h-full shadow-2xl">
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                filesCount={files.length}
                chatCount={messages.length}
                announcementsCount={announcements.length}
                membersCount={users.length}
                darkMode={darkMode}
              />
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 p-4 md:p-8 max-w-7xl mx-auto overflow-y-auto min-h-[calc(100vh-4rem)]">
          <Suspense fallback={
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            {activeTab === 'dashboard' && (
              <DashboardTab
                files={files}
                messages={messages}
                announcements={announcements}
                users={users}
                onNavigate={setActiveTab}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'files' && (
              <FileSharingTab
                files={files}
                currentUser={currentUser}
                onUploadFile={handleUploadFile}
                onDeleteFile={handleDeleteFile}
                onDownloadFile={handleDownloadFile}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'chat' && (
              <LiveChatTab
                messages={messages}
                users={users}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onReactMessage={handleReactMessage}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsTab
                announcements={announcements}
                currentUser={currentUser}
                onPostAnnouncement={handlePostAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'members' && (
              <MembersTab
                users={users}
                activities={activities}
                currentUser={currentUser}
                onAddMember={handleAddMember}
                onDeleteMember={handleDeleteMember}
                darkMode={darkMode}
              />
            )}

            {activeTab === 'ai-insights' && (
              <AIInsightsTab
                files={files}
                darkMode={darkMode}
              />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
