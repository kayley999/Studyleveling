import { Trophy, Medal, TrendingUp, Zap } from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  xp: number;
  tasksCompleted: number;
  trend: "up" | "down" | "same";
}

export function LeaderboardPage() {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Sarah Chen", level: 15, xp: 4250, tasksCompleted: 47, trend: "up" },
    { rank: 2, name: "Marcus Johnson", level: 14, xp: 3890, tasksCompleted: 43, trend: "same" },
    { rank: 3, name: "Kayley", level: 12, xp: 2450, tasksCompleted: 32, trend: "up" },
    { rank: 4, name: "Emma Wilson", level: 12, xp: 2380, tasksCompleted: 31, trend: "down" },
    { rank: 5, name: "Alex Kumar", level: 11, xp: 2150, tasksCompleted: 29, trend: "up" },
    { rank: 6, name: "Olivia Martinez", level: 11, xp: 2090, tasksCompleted: 28, trend: "same" },
    { rank: 7, name: "James Lee", level: 10, xp: 1850, tasksCompleted: 25, trend: "up" },
    { rank: 8, name: "Sophia Brown", level: 10, xp: 1720, tasksCompleted: 24, trend: "down" },
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-yellow-600";
      case 2:
        return "from-slate-300 to-slate-400";
      case 3:
        return "from-orange-400 to-orange-600";
      default:
        return "from-cyan-400 to-blue-500";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-cyan-400 font-bold text-sm">#{rank}</div>;
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
            <h1 className="text-3xl font-bold text-white mb-2">LEADERBOARD</h1>
            <p className="text-cyan-400 text-sm">Top students competing for glory</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboard.slice(0, 3).map((entry, index) => {
          const positions = [1, 0, 2]; // Second place in middle (tallest)
          const actualEntry = index === 0 ? leaderboard[1] : index === 1 ? leaderboard[0] : leaderboard[2];
          const heights = ['h-32', 'h-40', 'h-28'];
          
          return (
            <div key={actualEntry.rank} className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(actualEntry.rank)} blur-lg opacity-50`}></div>
                <div className={`relative bg-gradient-to-r ${getRankColor(actualEntry.rank)} p-4 rounded-full`}>
                  {getRankIcon(actualEntry.rank)}
                </div>
              </div>
              
              <div className={`w-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-t-lg border-2 ${
                actualEntry.rank === 1 ? 'border-yellow-400' : 
                actualEntry.rank === 2 ? 'border-slate-300' : 
                'border-orange-400'
              } p-4 ${heights[index]} flex flex-col justify-end items-center`}>
                <div className="text-center">
                  <div className="font-bold text-white mb-1">{actualEntry.name}</div>
                  <div className="text-xs text-cyan-400 mb-1">Level {actualEntry.level}</div>
                  <div className="text-sm text-yellow-400 font-semibold">{actualEntry.xp.toLocaleString()} XP</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 overflow-hidden">
        {/* Table Header */}
        <div className="bg-slate-900/50 border-b border-slate-700/50 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">Student</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-2">XP</div>
            <div className="col-span-2">Tasks</div>
            <div className="col-span-1">Trend</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-700/50">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={`px-6 py-4 hover:bg-slate-700/30 transition-colors ${
                entry.name === "Kayley" ? "bg-cyan-500/10 border-l-4 border-cyan-400" : ""
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Name */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      entry.name === "Kayley" ? "text-cyan-400" : "text-white"
                    }`}>
                      {entry.name}
                    </span>
                    {entry.name === "Kayley" && (
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-400/30">
                        YOU
                      </span>
                    )}
                  </div>
                </div>

                {/* Level */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{entry.level}</span>
                  </div>
                </div>

                {/* XP */}
                <div className="col-span-2">
                  <span className="text-cyan-400 font-mono">
                    {entry.xp.toLocaleString()}
                  </span>
                </div>

                {/* Tasks */}
                <div className="col-span-2">
                  <span className="text-slate-300">{entry.tasksCompleted}</span>
                </div>

                {/* Trend */}
                <div className="col-span-1">
                  {entry.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  {entry.trend === "down" && (
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  )}
                  {entry.trend === "same" && (
                    <div className="w-4 h-0.5 bg-slate-500"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
          <div className="text-xs text-slate-400 mb-1">Your Rank</div>
          <div className="text-2xl font-bold text-cyan-400">#3</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
          <div className="text-xs text-slate-400 mb-1">Total Students</div>
          <div className="text-2xl font-bold text-white">156</div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center">
          <div className="text-xs text-slate-400 mb-1">Top 10%</div>
          <div className="text-2xl font-bold text-green-400">✓</div>
        </div>
      </div>
    </div>
  );
}
