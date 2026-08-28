import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request logger for debugging 404s
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});

// In-memory data store with rich seed data
let users = [
  {
    id: "u1",
    name: "Tony Tosh",
    email: "admin_01@committee.org",
    role: "Admin_01",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Executive Board",
    status: "online",
    joinedDate: "2025-01-15"
  },
  {
    id: "u2",
    name: "Apollo Ericks",
    email: "admin_02@committee.org",
    role: "Admin_02",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "Operations & Oversight",
    status: "online",
    joinedDate: "2025-02-01"
  },
  {
    id: "u3",
    name: "Mister Kinyua",
    email: "admin_03@committee.org",
    role: "Admin_03",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    department: "Finance & Compliance",
    status: "online",
    joinedDate: "2025-02-10"
  },
  {
    id: "u4",
    name: "Dr. Elena Vance",
    email: "elena.vance@committee.org",
    role: "Member",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    department: "Research & Development",
    status: "away",
    joinedDate: "2025-03-01"
  }
];

let files = [
  {
    id: "f1",
    name: "Q3_Strategic_Roadmap_2026.pdf",
    originalName: "Q3 Strategic Roadmap 2026.pdf",
    size: 2450000,
    type: "pdf",
    category: "Presentations",
    uploaderId: "u1",
    uploaderName: "Prof. Arthur Pendelton",
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    downloads: 14,
    version: 1,
    description: "Comprehensive strategic outlook for Q3 committee initiatives and milestone schedules.",
    aiSummary: "Outlines key deliverables for Q3 including budget allocation, safety protocol updates, and community rollout targets."
  },
  {
    id: "f2",
    name: "Financial_Audit_Report_H1.xlsx",
    originalName: "Financial Audit Report H1.xlsx",
    size: 1120000,
    type: "spreadsheet",
    category: "Budget",
    uploaderId: "u3",
    uploaderName: "Marcus Chen",
    uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    downloads: 22,
    version: 2,
    description: "Detailed breakdown of expenditures, grants received, and remaining reserve funds.",
    aiSummary: "Shows a surplus of 14% against projected spendings with primary allocation towards R&D lab upgrades."
  },
  {
    id: "f3",
    name: "Safety_Protocol_v4.2.docx",
    originalName: "Safety Protocol v4.2.docx",
    size: 840000,
    type: "docx",
    category: "Protocols",
    uploaderId: "u4",
    uploaderName: "Sarah Jenkins",
    uploadDate: new Date(Date.now() - 86400000 * 8).toISOString(),
    downloads: 31,
    version: 3,
    description: "Updated compliance guidelines for on-site facility access and equipment handling.",
    aiSummary: "Updated biometric entry requirements and emergency shutdown procedures for automated machinery."
  }
];

let messages = [
  {
    id: "m1",
    senderId: "u1",
    senderName: "Prof. Arthur Pendelton",
    senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: "Welcome everyone to the Project Committee Hub! Please review the Q3 roadmap document uploaded earlier.",
    timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: { "👍": ["u2", "u3"], "❤️": ["u4"] }
  },
  {
    id: "m2",
    senderId: "u3",
    senderName: "Marcus Chen",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    text: "Thanks Arthur. I've checked the financial numbers and everything aligns with our projections.",
    timestamp: new Date(Date.now() - 3600000 * 3).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: { "✅": ["u1"] }
  },
  {
    id: "m3",
    senderId: "u2",
    senderName: "Dr. Elena Vance",
    senderAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    text: "The new safety protocols look solid. Shall we schedule a sync meeting this Thursday?",
    timestamp: new Date(Date.now() - 3600000 * 1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reactions: {}
  }
];

let announcements = [
  {
    id: "a1",
    title: "Quarterly Committee Review Meeting",
    content: "Our primary review session is scheduled for this Friday at 10:00 AM UTC in Conference Room A. Please review all submitted file reports beforehand.",
    authorName: "Prof. Arthur Pendelton",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    date: new Date(Date.now() - 86400000).toISOString(),
    priority: "high",
    category: "Meeting"
  },
  {
    id: "a2",
    title: "New Cloud Storage & File Versioning Enabled",
    content: "Members can now upload files up to 50MB, including automatic versioning and AI-assisted summaries for PDF and document formats.",
    authorName: "Marcus Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    priority: "normal",
    category: "System"
  }
];

let activityLogs = [
  {
    id: "al1",
    userId: "u1",
    userName: "Prof. Arthur Pendelton",
    action: "Uploaded file",
    target: "Q3_Strategic_Roadmap_2026.pdf",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "al2",
    userId: "u3",
    userName: "Marcus Chen",
    action: "Uploaded file",
    target: "Financial_Audit_Report_H1.xlsx",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// PWA static routes
app.get("/sw.js", (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'sw.js'));
});

app.get("/manifest.json", (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'manifest.json'));
});

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Users & Auth
app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name, email, role, department } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const newUser = {
    id: "u_" + Date.now(),
    name,
    email,
    role: role || "Member",
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000000)}?w=150&auto=format&fit=crop&q=80`,
    department: department || "General Committee",
    status: "online",
    joinedDate: new Date().toISOString().split('T')[0]
  };
  users.push(newUser);
  activityLogs.unshift({
    id: "al_" + Date.now(),
    userId: newUser.id,
    userName: newUser.name,
    action: "Joined committee",
    target: newUser.email,
    timestamp: new Date().toISOString()
  });
  res.status(201).json(newUser);
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id !== id);
  res.json({ success: true });
});

// Files
app.get("/api/files", (req, res) => {
  res.json(files);
});

app.post("/api/files", async (req, res) => {
  const { name, size, type, category, uploaderId, uploaderName, description, content } = req.body;
  if (!name) {
    return res.status(400).json({ error: "File name is required" });
  }

  // Generate AI summary if Gemini is available
  let aiSummary = "Uploaded document for committee review.";
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Provide a concise 1-2 sentence professional summary for a committee document named "${name}" in category "${category}" with description "${description || 'None'}".`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });
      if (response.text) {
        aiSummary = response.text.trim();
      }
    }
  } catch (e) {
    console.error("AI summary error:", e);
  }

  const newFile = {
    id: "f_" + Date.now(),
    name,
    originalName: name,
    size: size || 102400,
    type: type || "pdf",
    category: category || "General",
    uploaderId: uploaderId || "u1",
    uploaderName: uploaderName || "Prof. Arthur Pendelton",
    uploadDate: new Date().toISOString(),
    downloads: 0,
    version: 1,
    description: description || "",
    aiSummary,
    url: content || "" // base64 or URL
  };

  files.unshift(newFile);
  activityLogs.unshift({
    id: "al_" + Date.now(),
    userId: uploaderId || "u1",
    userName: uploaderName || "Prof. Arthur Pendelton",
    action: "Uploaded file",
    target: name,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newFile);
});

app.delete("/api/files/:id", (req, res) => {
  const { id } = req.params;
  files = files.filter(f => f.id !== id);
  res.json({ success: true });
});

app.post("/api/files/:id/download", (req, res) => {
  const { id } = req.params;
  const file = files.find(f => f.id === id);
  if (file) {
    file.downloads += 1;
    res.json({ success: true, downloads: file.downloads });
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Chat Messages
app.get("/api/chat", (req, res) => {
  res.json(messages);
});

app.post("/api/chat", (req, res) => {
  const { senderId, senderName, senderAvatar, text, fileAttachment } = req.body;
  if (!text && !fileAttachment) {
    return res.status(400).json({ error: "Message text or attachment required" });
  }
  const newMsg = {
    id: "m_" + Date.now(),
    senderId: senderId || "u1",
    senderName: senderName || "Prof. Arthur Pendelton",
    senderAvatar: senderAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    text: text || "",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fileAttachment: fileAttachment || undefined,
    reactions: {}
  };
  messages.push(newMsg);
  res.status(201).json(newMsg);
});

app.post("/api/chat/:id/react", (req, res) => {
  const { id } = req.params;
  const { emoji, userId } = req.body;
  const msg = messages.find(m => m.id === id);
  if (msg) {
    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];
    const idx = msg.reactions[emoji].indexOf(userId);
    if (idx > -1) {
      msg.reactions[emoji].splice(idx, 1);
      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
    } else {
      msg.reactions[emoji].push(userId);
    }
    res.json({ success: true, reactions: msg.reactions });
  } else {
    res.status(404).json({ error: "Message not found" });
  }
});

// Announcements
app.get("/api/announcements", (req, res) => {
  res.json(announcements);
});

app.post("/api/announcements", (req, res) => {
  const { title, content, authorName, authorAvatar, priority, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }
  const newAnn = {
    id: "a_" + Date.now(),
    title,
    content,
    authorName: authorName || "Prof. Arthur Pendelton",
    authorAvatar: authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    date: new Date().toISOString(),
    priority: priority || "normal",
    category: category || "General"
  };
  announcements.unshift(newAnn);
  res.status(201).json(newAnn);
});

app.delete("/api/announcements/:id", (req, res) => {
  const { id } = req.params;
  announcements = announcements.filter(a => a.id !== id);
  res.json({ success: true });
});

// Activity logs
app.get("/api/activities", (req, res) => {
  res.json(activityLogs);
});

// AI Assistant Endpoint
app.post("/api/ai/query", async (req, res) => {
  const { prompt, context } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ response: "Gemini API key is not configured. Please add GEMINI_API_KEY in secrets to enable advanced AI committee insights." });
    }
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `You are an expert AI advisor for the Project Committee Hub. 
Context files & info: ${JSON.stringify(context || files)}
User question: ${prompt}
Provide a professional, concise, and helpful response formatted nicely with markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt
    });

    res.json({ response: response.text || "No response generated." });
  } catch (error: any) {
    console.error("AI Query Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// Vite middleware setup & server start
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
