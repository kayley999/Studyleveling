import { useState } from "react";
import { Send, Users, Calendar, Clock } from "lucide-react";

interface Message {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
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

export function SocialPage() {
  const [messageInput, setMessageInput] = useState("");
  const [messages] = useState<Message[]>([
    {
      id: 1,
      user: "Sarah Chen",
      message: "Does anyone have the solution for question 3 in the Algorithm homework?",
      time: "10:23 AM",
      avatar: "SC"
    },
    {
      id: 2,
      user: "Marcus Johnson",
      message: "Yeah! I used dynamic programming. The key is to build a memoization table.",
      time: "10:25 AM",
      avatar: "MJ"
    },
    {
      id: 3,
      user: "Emma Wilson",
      message: "I'm stuck on the time complexity analysis. Is it O(n²) or O(n log n)?",
      time: "10:28 AM",
      avatar: "EW"
    },
    {
      id: 4,
      user: "Alex Kumar",
      message: "It should be O(n²) because of the nested loops. Check slide 47 from lecture 6!",
      time: "10:30 AM",
      avatar: "AK"
    },
    {
      id: 5,
      user: "Kayley",
      message: "Thanks everyone! The lecture slides really help. Anyone joining the study session tomorrow?",
      time: "10:32 AM",
      avatar: "K"
    },
  ]);

  const [studySessions] = useState<StudySession[]>([
    {
      id: 1,
      unit: "FIT2004",
      topic: "Algorithm Analysis & Optimization",
      date: "Mar 14, 2026",
      time: "2:00 PM - 4:00 PM",
      participants: 8,
      maxParticipants: 12
    },
    {
      id: 2,
      unit: "FIT3170",
      topic: "Software Requirements Workshop",
      date: "Mar 15, 2026",
      time: "10:00 AM - 12:00 PM",
      participants: 6,
      maxParticipants: 10
    },
    {
      id: 3,
      unit: "FIT3171",
      topic: "Database Design Review",
      date: "Mar 16, 2026",
      time: "3:00 PM - 5:00 PM",
      participants: 10,
      maxParticipants: 15
    },
    {
      id: 4,
      unit: "FIT3152",
      topic: "Data Visualization Study Group",
      date: "Mar 17, 2026",
      time: "1:00 PM - 3:00 PM",
      participants: 5,
      maxParticipants: 8
    },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to a server
      setMessageInput("");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="relative mb-8">
        <div 
          className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{
            clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
            borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Corner Decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

          <div className="relative p-8">
            <h1 className="text-3xl font-bold text-white mb-2">SOCIAL</h1>
            <p className="text-cyan-400 text-sm">Connect with fellow students and study groups</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chatroom */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Class Discussion
            </h2>
            <p className="text-sm text-slate-400 mt-1">24 students online</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  msg.user === "Kayley" 
                    ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-400/50' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${
                      msg.user === "Kayley" ? 'text-cyan-400' : 'text-white'
                    }`}>
                      {msg.user}
                    </span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-300 text-sm bg-slate-700/50 rounded-lg p-3">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50"
              />
              <button
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Group Study Sessions */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              Group Study Sessions
            </h2>
            <p className="text-sm text-slate-400 mt-1">Upcoming study groups</p>
          </div>

          {/* Study Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {studySessions.map((session) => (
              <div 
                key={session.id}
                className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4 hover:border-cyan-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                      {session.unit}
                    </span>
                    <h3 className="text-white font-semibold mt-2">{session.topic}</h3>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {session.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {session.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-cyan-400" />
                    {session.participants} / {session.maxParticipants} participants
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${(session.participants / session.maxParticipants) * 100}%` }}
                  ></div>
                </div>

                <button className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded-lg py-2 font-semibold text-sm transition-all">
                  Join Session
                </button>
              </div>
            ))}
          </div>

          {/* Create Session Button */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all">
              Create New Study Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
