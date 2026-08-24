export type UserRole = 'Admin' | 'Member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  status: 'online' | 'offline' | 'away';
  joinedDate: string;
}

export interface CommitteeFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string; // 'pdf' | 'docx' | 'image' | 'video' | 'spreadsheet' | 'archive' | 'other'
  category: 'Research' | 'Budget' | 'Protocols' | 'Presentations' | 'General';
  uploaderId: string;
  uploaderName: string;
  uploadDate: string;
  downloads: number;
  version: number;
  description?: string;
  url?: string;
  aiSummary?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  fileAttachment?: {
    id: string;
    name: string;
    type: string;
    size: number;
  };
  reactions?: { [emoji: string]: string[] }; // emoji -> user IDs
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  priority: 'normal' | 'high' | 'urgent';
  category: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  timestamp: string;
  read: boolean;
}
