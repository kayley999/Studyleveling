import { useState, useEffect, useRef } from "react";
import { Send, Users, Calendar, Clock, Loader2, Bot } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import supabase from "../../supabaseClient";

interface Message {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  isBot?: boolean;
  botAvatar?: string;
}

interface StudySession {
  id: number;
  unit: string;
  topic: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
}

// AI friend personas — each has a name, personality, avatar color, and role
const BOT_FRIENDS = [
  {
    id: "bot-sarah",
    name: "Sarah Chen",
    color: "bg-pink-500",
    personality: "You are Sarah Chen, a friendly and enthusiastic Computer Science student who loves algorithms and competitive programming. You're supportive, occasionally use CS jargon, drop the odd emoji, and always hype your friends up. Keep replies short and natural like a real group chat — 1-3 sentences max.",
  },
  {
    id: "bot-marcus",
    name: "Marcus J",
    color: "bg-indigo-500",
    personality: "You are Marcus J, a chill and laid-back IT student who's into cybersecurity and gaming. You give advice like a real mate, use casual language, the occasional 'lol' or 'bro', and keep things short. 1-3 sentences, feels like group chat.",
  },
  {
    id: "bot-priya",
    name: "Priya K",
    color: "bg-emerald-500",
    personality: "You are Priya K, a driven Data Science student who is organised, kind, and always shares useful tips. You're warm and genuine, occasionally mention study techniques or deadlines, and keep replies concise and real. 1-3 sentences max.",
  },
  {
    id: "bot-alex",
    name: "Alex Wu",
    color: "bg-orange-500",
    personality: "You are Alex Wu, a creative Software Engineering student who loves building side projects and startups. You're curious, ask questions back, and love bouncing ideas around. Keep it short like a real group chat — 1-3 sentences.",
  },
];

const STUDY_SESSIONS: StudySession[] = [
  { id: 1, unit: "FIT2004", topic: "Algorithm Analysis & Optimization", date: "Mar 18, 2026", time: "2:00 PM – 4:00 PM", participants: 8, maxParticipants: 12 },
  { id: 2, unit: "FIT3170", topic: "Software Requirements Workshop", date: "Mar 19, 2026", time: "10:00 AM – 12:00 PM", participants: 6, maxParticipants: 10 },
  { id: 3, unit: "FIT3171", topic: "Database Design Review", date: "Mar 20, 2026", time: "3:00 PM – 5:00 PM", participants: 10, maxParticipants: 15 },
  { id: 4, unit: "FIT3152", topic: "Data Visualization Study Group", date: "Mar 21, 2026", time: "1:00 PM – 3:00 PM", participants: 5, maxParticipants: 8 },
];

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-pink-500", "bg-cyan-600", "bg-emerald-500",
  "bg-orange-500", "bg-violet-500", "bg-yellow-600", "bg-red-500",
];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name?.charCodeAt(0) || 65) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Pick 1–2 random bots to respond, with slight stagger
function pickResponders(): typeof BOT_FRIENDS {
  const shuffled = [...BOT_FRIENDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.random() > 0.4 ? 2 : 1);
}

async function fetchBotReply(bot: typeof BOT_FRIENDS[number], userMessage: string, userName: string, chatHistory: Message[]): Promise<string> {
  // Build last few messages as context
  const recentHistory = chatHistory.slice(-8).map(m => ({
    role: "user" as const,
    content: `${m.user_name}: ${m.content}`,
  }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 120,
      system: `${bot.personality}\n\nYou are in a university student group chat. The person who just messaged is ${userName}. Reply naturally to them as their friend. Never break character, never say you're an AI.`,
      messages: [
        ...recentHistory,
        { role: "user", content: `${userName}: ${userMessage}` },
      ],
    }),
  });

  const data = await response.json();
  return data.content?.[0]?.text?.trim() || "haha yeah for sure 😄";
}

export function SocialPage() {
  const { user, profile } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [botsTyping, setBotsTyping] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load real messages from Supabase
  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(60)
      .then(({ data }) => {
        if (data) setMessages(data);
        setLoadingMessages(false);
      });

    // Real-time: new messages from other real users
    const channel = supabase
      .channel("chat-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        setMessages(prev => {
          // Avoid duplicates (optimistic insert already added it)
          if (prev.some(m => m.id === (payload.new as Message).id)) return prev;
          return [...prev, payload.new as Message];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botsTyping]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !user || sending) return;

    setSending(true);
    setInput("");

    const userName = profile?.name || user.email?.split("@")[0] || "You";

    // Optimistic insert
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      user_name: userName,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    // Save to Supabase
    const { data: saved } = await supabase
      .from("messages")
      .insert({ user_id: user.id, user_name: userName, content })
      .select()
      .single();

    // Replace optimistic with real
    if (saved) {
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? saved : m));
    }

    setSending(false);
    inputRef.current?.focus();

    // Trigger AI friends to respond
    const responders = pickResponders();
    const allMessages = [...messages, optimisticMsg];

    responders.forEach((bot, i) => {
      const delay = 800 + i * 1200 + Math.random() * 800;

      // Show typing indicator after short pause
      setTimeout(() => {
        setBotsTyping(prev => [...prev, bot.id]);
      }, delay - 500);

      // Show reply
      setTimeout(async () => {
        setBotsTyping(prev => prev.filter(id => id !== bot.id));
        try {
          const reply = await fetchBotReply(bot, content, userName, allMessages);
          const botMsg: Message = {
            id: `bot-${bot.id}-${Date.now()}`,
            user_id: bot.id,
            user_name: bot.name,
            content: reply,
            created_at: new Date().toISOString(),
            isBot: true,
            botAvatar: bot.color,
          };
          setMessages(prev => [...prev, botMsg]);
        } catch {
          // Silently skip if API fails
          setBotsTyping(prev => prev.filter(id => id !== bot.id));
        }
      }, delay);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const typingBots = BOT_FRIENDS.filter(b => botsTyping.includes(b.id));

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="relative mb-8">
        <div className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{ clipPath: "polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))", borderImage: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1", boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          <div className="relative p-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">SOCIAL</h1>
              <p className="text-cyan-400 text-sm">Connect with classmates — AI friends always online 🤖</p>
            </div>
            <div className="flex items-center gap-3">
              {BOT_FRIENDS.map(b => (
                <div key={b.id} title={b.name} className={`w-8 h-8 rounded-full ${b.color} flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900`}>
                  {initials(b.name)}
                </div>
              ))}
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── CHAT ── */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-[620px]">
          {/* Chat header */}
          <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Class Discussion
            </h2>
            <div className="flex items-center gap-2">
              {profile && (
                <span className="text-xs text-slate-400">
                  You: <span className="text-cyan-400 font-semibold">{profile.name}</span>
                </span>
              )}
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                <Bot className="w-3 h-3" /> 4 friends online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <div className="flex gap-2">
                  {BOT_FRIENDS.map(b => (
                    <div key={b.id} className={`w-10 h-10 rounded-full ${b.color} flex items-center justify-center text-white text-xs font-bold`}>{initials(b.name)}</div>
                  ))}
                </div>
                <p className="text-sm text-center">Your AI friends are waiting!<br />Send a message to start the conversation.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.user_id === user?.id;
                const color = msg.isBot ? (msg.botAvatar ?? "bg-indigo-500") : avatarColor(msg.user_name);
                return (
                  <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${color}`}>
                      {initials(msg.user_name)}
                    </div>
                    <div className={`flex flex-col max-w-[74%] ${isMe ? "items-end" : "items-start"}`}>
                      <div className="flex items-baseline gap-1.5 mb-1">
                        <span className={`text-xs font-semibold ${isMe ? "text-cyan-400" : msg.isBot ? "text-slate-300" : "text-slate-400"}`}>
                          {isMe ? "You" : msg.user_name}
                        </span>
                        {msg.isBot && <Bot className="w-2.5 h-2.5 text-slate-600" />}
                        <span className="text-[10px] text-slate-600">{formatTime(msg.created_at)}</span>
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                          : "bg-slate-700/70 text-slate-200 rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing indicators */}
            {typingBots.map(bot => (
              <div key={bot.id} className="flex gap-2.5 items-end">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${bot.color}`}>
                  {initials(bot.name)}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-slate-500 mb-1 ml-1">{bot.name} is typing...</span>
                  <div className="bg-slate-700/70 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/40">
            {!user ? (
              <p className="text-slate-500 text-sm text-center">Log in to send messages</p>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message as ${profile?.name ?? "you"}...`}
                  maxLength={500}
                  className="flex-1 bg-slate-700/50 border border-slate-600/60 hover:border-slate-500 focus:border-cyan-400/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] flex-shrink-0"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {!sending && "Send"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── STUDY SESSIONS ── */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-[620px]">
          <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Group Study Sessions
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {STUDY_SESSIONS.map(session => (
              <div key={session.id} className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 hover:border-cyan-400/40 transition-all">
                <div className="mb-3">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">{session.unit}</span>
                  <h3 className="text-white font-semibold mt-2">{session.topic}</h3>
                </div>
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300"><Calendar className="w-4 h-4 text-cyan-400" />{session.date}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300"><Clock className="w-4 h-4 text-cyan-400" />{session.time}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-300"><Users className="w-4 h-4 text-cyan-400" />{session.participants} / {session.maxParticipants} participants</div>
                </div>
                <div className="relative h-1.5 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${(session.participants / session.maxParticipants) * 100}%` }} />
                </div>
                <button className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded-lg py-2 font-semibold text-sm transition-all">Join Session</button>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-700/50 bg-slate-900/40">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 rounded-xl font-semibold transition-all">
              Create New Study Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}