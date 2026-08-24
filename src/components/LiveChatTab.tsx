import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { Send, Paperclip, Smile, Sparkles, CheckCheck, Users } from 'lucide-react';

interface LiveChatTabProps {
  messages: ChatMessage[];
  users: User[];
  currentUser: User;
  onSendMessage: (text: string, fileAttachment?: any) => void;
  onReactMessage: (messageId: string, emoji: string) => void;
  darkMode: boolean;
}

export const LiveChatTab: React.FC<LiveChatTabProps> = ({
  messages,
  users,
  currentUser,
  onSendMessage,
  onReactMessage,
  darkMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['👍', '❤️', '👏', '🔥', '✅', '💡'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Chat Main Area */}
      <div className={`lg:col-span-3 rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-xs flex flex-col overflow-hidden`}>
        {/* Chat Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white'} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              #
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Committee Discussion Lounge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Secure real-time communications channel</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {users.filter(u => u.status === 'online').length} members online
            </span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 group ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-slate-200 dark:ring-slate-800"
                />
                <div className={`max-w-md space-y-1 ${isMe ? 'text-right' : ''}`}>
                  <div className={`flex items-center space-x-2 text-xs ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold text-slate-800 dark:text-white">{msg.senderName}</span>
                    <span className="text-slate-400">{msg.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed relative ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : darkMode
                      ? 'bg-slate-800 text-slate-200 rounded-tl-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}>
                    <p>{msg.text}</p>

                    {/* Reactions display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className={`flex flex-wrap gap-1 mt-2 pt-2 border-t ${isMe ? 'border-indigo-500/40 justify-end' : darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                      {Object.entries(msg.reactions).map(([emoji, userIdsRaw]) => {
                        const userIds = userIdsRaw as string[];
                        return (
                          <button
                            key={emoji}
                            onClick={() => onReactMessage(msg.id, emoji)}
                            className={`px-2 py-0.5 rounded-full text-[11px] flex items-center space-x-1 border ${
                              userIds.includes(currentUser.id)
                                ? 'bg-indigo-500/20 border-indigo-400 text-white'
                                : darkMode ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{userIds.length}</span>
                          </button>
                        );
                      })}
                      </div>
                    )}
                  </div>

                  {/* Reaction trigger hover button */}
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ${isMe ? 'justify-end' : ''}`}>
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onReactMessage(msg.id, emoji)}
                        className="text-xs p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSubmit} className={`p-4 border-t ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'} flex items-center space-x-3`}>
          <button
            type="button"
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            title="Attach File"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <input
            type="text"
            placeholder="Type your message to committee..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-xs border ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Online Members Sidebar */}
      <div className={`hidden lg:flex flex-col rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-xs p-4 space-y-4`}>
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">Committee Directory</h4>
        </div>

        <div className="space-y-3 overflow-y-auto flex-1">
          {users.map((u) => (
            <div key={u.id} className="flex items-center space-x-3">
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ${
                  darkMode ? 'ring-slate-900' : 'ring-white'
                } ${u.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-slate-800 dark:text-white">{u.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
