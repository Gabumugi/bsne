import React, { useState } from 'react';
import { CommitteeFile } from '../types';
import { Sparkles, Send, Bot, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';

interface AIInsightsTabProps {
  files: CommitteeFile[];
  darkMode: boolean;
}

export const AIInsightsTab: React.FC<AIInsightsTabProps> = ({ files, darkMode }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: "Hello! I am your Gemini AI Committee Copilot. I have analyzed your uploaded documents (such as the Q3 Strategic Roadmap, Financial Audit, and Safety Protocols). Ask me anything about committee reports, financial summaries, or action items!"
    }
  ]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setQuery('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg, context: files }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', text: data.response || "No response received." }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: "Error connecting to AI service. Please verify your GEMINI_API_KEY." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Summarize all active committee priorities for Q3",
    "What are the main financial audit highlights?",
    "Review safety protocol requirements and key changes",
    "Generate action items for upcoming committee meeting"
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Copilot & Document Intelligence</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Committee Intelligence & Analysis</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions, extract action items, and synthesize committee files instantly</p>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(p);
            }}
            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between group ${
              darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50 text-slate-300' : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-700'
            }`}
          >
            <span>{p}</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className={`rounded-2xl border ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-xs flex flex-col h-[500px] overflow-hidden`}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-amber-500/10 text-amber-500 font-bold'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : darkMode
                  ? 'bg-slate-800/80 border border-slate-700 text-slate-200 rounded-tl-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Gemini is synthesizing committee documents...</span>
              </div>
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleAskAI} className={`p-4 border-t ${darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-white'} flex items-center space-x-3`}>
          <input
            type="text"
            placeholder="Ask anything about committee files, reports, or budgets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 px-4 py-3 rounded-xl text-xs border ${
              darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500/30`}
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
