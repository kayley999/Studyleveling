import { useEffect, useState, useRef } from "react";
import { Trophy, Zap, Loader2, CheckSquare, Crown, Medal, TrendingUp, TrendingDown, Minus, Star, ChevronUp, ChevronDown } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import supabase from "../../supabaseClient";

interface LeaderboardEntry {
  id: string;
  name: string;
  degree: string;
  field_of_study: string;
  xp: number;
  level: number;
  tasks_completed: number;
  // Computed
  rank?: number;
  prevRank?: number;
  trend?: "up" | "down" | "same" | "new";
  trendDelta?: number;
}

const REWARDS = [
  { place: 1, suffix: "st", bonusXP: 2000, color: "#FFD700", topThree: true },
  { place: 2, suffix: "nd", bonusXP: 1500, color: "#C0C0C0", topThree: true },
  { place: 3, suffix: "rd", bonusXP: 1000, color: "#CD7F32", topThree: true },
  { place: 4, suffix: "th", bonusXP: 750, color: "#818cf8", topThree: false },
  { place: 5, suffix: "th", bonusXP: 500, color: "#818cf8", topThree: false },
  { place: 6, suffix: "th", bonusXP: 350, color: "#94a3b8", topThree: false },
  { place: 7, suffix: "th", bonusXP: 250, color: "#94a3b8", topThree: false },
  { place: 8, suffix: "th", bonusXP: 200, color: "#94a3b8", topThree: false },
  { place: 9, suffix: "th", bonusXP: 150, color: "#94a3b8", topThree: false },
  { place: 10, suffix: "th", bonusXP: 100, color: "#94a3b8", topThree: false },
];

const AVATAR_COLORS = [
  { bg: "#7C3AED", light: "#A78BFA" }, { bg: "#DB2777", light: "#F9A8D4" },
  { bg: "#0891B2", light: "#67E8F9" }, { bg: "#16A34A", light: "#86EFAC" },
  { bg: "#EA580C", light: "#FED7AA" }, { bg: "#DC2626", light: "#FCA5A5" },
  { bg: "#CA8A04", light: "#FDE68A" }, { bg: "#6D28D9", light: "#C4B5FD" },
  { bg: "#0E7490", light: "#A5F3FC" }, { bg: "#166534", light: "#BBF7D0" },
];

function getColor(name: string) {
  return AVATAR_COLORS[(name?.charCodeAt(0) || 65) % AVATAR_COLORS.length];
}

function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const { bg, light } = getColor(name || "?");
  const s = size;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
      <rect width={s} height={s} rx={s * 0.2} fill={bg} />
      {/* head */}
      <rect x={s*0.37} y={s*0.1} width={s*0.26} height={s*0.26} rx={s*0.08} fill={light} />
      {/* eyes */}
      <rect x={s*0.41} y={s*0.2} width={s*0.07} height={s*0.07} fill={bg} />
      <rect x={s*0.52} y={s*0.2} width={s*0.07} height={s*0.07} fill={bg} />
      {/* body */}
      <rect x={s*0.28} y={s*0.4} width={s*0.44} height={s*0.32} rx={s*0.06} fill={light} opacity="0.9" />
      {/* legs */}
      <rect x={s*0.28} y={s*0.72} width={s*0.19} height={s*0.2} rx={s*0.04} fill={light} opacity="0.75" />
      <rect x={s*0.53} y={s*0.72} width={s*0.19} height={s*0.2} rx={s*0.04} fill={light} opacity="0.75" />
    </svg>
  );
}

// Mini XP bar chart
function XpBar({ xp, maxXp }: { xp: number; maxXp: number }) {
  const pct = maxXp > 0 ? Math.max(4, (xp / maxXp) * 100) : 4;
  return (
    <div className="flex-1 flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #6366f1, #818cf8)`,
          }}
        />
      </div>
    </div>
  );
}

// Trend badge
function TrendBadge({ trend, delta }: { trend: "up" | "down" | "same" | "new"; delta?: number }) {
  if (trend === "new") return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-400/20">NEW</span>
  );
  if (trend === "up") return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-400/20">
      <ChevronUp className="w-3 h-3" />{delta}
    </span>
  );
  if (trend === "down") return (
    <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-400/20">
      <ChevronDown className="w-3 h-3" />{delta}
    </span>
  );
  return <span className="flex items-center text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-500 border border-slate-700"><Minus className="w-3 h-3" /></span>;
}

// Podium block
function PodiumBlock({ entry, rank, height, show }: { entry: LeaderboardEntry; rank: number; height: number; show: boolean }) {
  const colors = {
    1: { block: "#4f46e5", mid: "#3730a3", glow: "rgba(99,102,241,0.6)", numColor: "rgba(255,255,255,0.15)" },
    2: { block: "#6366f1", mid: "#4f46e5", glow: "rgba(129,140,248,0.4)", numColor: "rgba(255,255,255,0.12)" },
    3: { block: "#818cf8", mid: "#6366f1", glow: "rgba(165,180,252,0.3)", numColor: "rgba(255,255,255,0.10)" },
  }[rank] ?? { block: "#475569", mid: "#334155", glow: "transparent", numColor: "rgba(255,255,255,0.1)" };

  const avatarSize = rank === 1 ? 64 : 52;

  return (
    <div
      className={`flex flex-col items-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: rank === 1 ? '0ms' : rank === 2 ? '150ms' : '300ms' }}
    >
      {rank === 1 && (
        <Crown className="w-8 h-8 text-yellow-400 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.9)] animate-pulse" style={{ animationDuration: '2.5s' }} />
      )}

      {/* Avatar */}
      <div className="relative mb-2">
        <div className="absolute inset-0 rounded-2xl blur-xl opacity-70" style={{ background: getColor(entry.name || "?").bg }}></div>
        <div className={`relative rounded-2xl overflow-hidden border-2 ${rank === 1 ? 'border-yellow-400/80 shadow-[0_0_25px_rgba(234,179,8,0.5)]' : rank === 2 ? 'border-slate-300/50' : 'border-orange-400/50'}`}>
          <Avatar name={entry.name || "?"} size={avatarSize} />
        </div>
        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-slate-900 ${rank === 1 ? 'bg-yellow-400 text-slate-900' : rank === 2 ? 'bg-slate-200 text-slate-900' : 'bg-orange-500 text-white'}`}>{rank}</div>
      </div>

      <p className={`font-bold text-center leading-tight mb-0.5 ${rank === 1 ? 'text-white text-sm' : 'text-slate-200 text-xs'}`} style={{ maxWidth: rank === 1 ? 110 : 95 }}>
        {entry.name || "Anonymous"}
      </p>

      {/* XP pill */}
      <div className={`mb-3 px-3 py-1 rounded-lg text-sm font-bold border ${rank === 1 ? 'bg-indigo-500/30 border-indigo-400/60 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-slate-700/60 border-slate-600/40 text-slate-300'}`}>
        {entry.xp.toLocaleString()} XP
      </div>

      {/* Podium body */}
      <div style={{ width: rank === 1 ? 120 : 100 }}>
        <div className="rounded-t-lg" style={{ height: 28, background: `linear-gradient(135deg, ${colors.block}, ${colors.mid})`, boxShadow: `0 -6px 24px ${colors.glow}` }} />
        <div className="flex items-end justify-center pb-2 rounded-b-sm" style={{ height, background: `linear-gradient(180deg, ${colors.mid} 0%, #1e1b4b 100%)` }}>
          <span className="font-black select-none" style={{ fontSize: height * 0.55, lineHeight: 1, color: colors.numColor }}>{rank}</span>
        </div>
      </div>
    </div>
  );
}

const TASKS_TOTAL = 4;

export function LeaderboardPage() {
  const { user, profile } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"monthly" | "alltime">("monthly");
  const [podiumShow, setPodiumShow] = useState(false);
  const prevRanksRef = useRef<Record<string, number>>({});
  const animRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, degree, field_of_study, xp, level, tasks_completed')
      .order('xp', { ascending: false })
      .limit(100);

    if (data) {
      const enriched: LeaderboardEntry[] = data.map((e, i) => {
        const rank = i + 1;
        const prevRank = prevRanksRef.current[e.id];
        let trend: LeaderboardEntry['trend'] = "new";
        let trendDelta = 0;
        if (prevRank !== undefined) {
          if (prevRank > rank) { trend = "up"; trendDelta = prevRank - rank; }
          else if (prevRank < rank) { trend = "down"; trendDelta = rank - prevRank; }
          else trend = "same";
        }
        return { ...e, rank, prevRank, trend, trendDelta };
      });

      // Update prev ranks for next fetch
      const newPrevRanks: Record<string, number> = {};
      enriched.forEach(e => { if (e.rank) newPrevRanks[e.id] = e.rank; });
      prevRanksRef.current = newPrevRanks;

      setLeaderboard(enriched);
      setPodiumShow(false);
      clearTimeout(animRef.current);
      animRef.current = setTimeout(() => setPodiumShow(true), 80);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    const ch = supabase
      .channel('lb-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchLeaderboard)
      .subscribe();

    return () => { supabase.removeChannel(ch); clearTimeout(animRef.current); };
  }, []);

  const maxXp = leaderboard[0]?.xp || 1;
  const top3 = leaderboard.slice(0, 3);
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3.length === 2 ? [top3[1], top3[0]] : top3;
  const podiumRanks = [2, 1, 3];
  const podiumHeights = [95, 125, 75];
  const myRank = leaderboard.findIndex(e => e.id === user?.id) + 1;

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6">
      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Leaderboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs uppercase tracking-widest font-semibold">Live</span>
          </div>
        </div>
        {myRank > 0 && (
          <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-400/30 rounded-xl px-5 py-3">
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Your Rank</p>
              <p className="text-2xl font-black text-indigo-300">#{myRank}</p>
            </div>
            <div className="w-px h-10 bg-indigo-400/20" />
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Your XP</p>
              <p className="text-2xl font-black text-yellow-400">{(profile?.xp ?? 0).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* LEFT: Podium + List */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
              <p className="text-slate-400">Loading rankings...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-32 bg-slate-800/40 rounded-2xl border border-slate-700/50">
              <Trophy className="w-16 h-16 text-indigo-400/30 mx-auto mb-4" />
              <p className="text-slate-300 text-xl font-bold mb-2">No players yet!</p>
              <p className="text-slate-500 text-sm">Complete tasks to appear here.</p>
            </div>
          ) : (
            <>
              {/* ─── PODIUM ─── */}
              {top3.length > 0 && (
                <div className="relative rounded-2xl mb-6 overflow-hidden"
                  style={{
                    background: 'linear-gradient(180deg, #0d0d1f 0%, #1a1040 60%, #0d0d1f 100%)',
                    border: '1px solid rgba(99,102,241,0.25)',
                    boxShadow: '0 0 80px rgba(99,102,241,0.12), inset 0 0 100px rgba(99,102,241,0.04)'
                  }}>
                  {/* Stars */}
                  <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="absolute rounded-full bg-white animate-pulse"
                        style={{ width: 1 + (i % 2), height: 1 + (i % 2), opacity: 0.1 + (i % 4) * 0.05, top: `${(i * 23) % 100}%`, left: `${(i * 37) % 100}%`, animationDelay: `${i * 0.15}s`, animationDuration: `${2 + (i % 3)}s` }} />
                    ))}
                  </div>
                  {/* Ground light */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-20 opacity-20 rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse, #818cf8, transparent)' }} />
                  <div className="relative pt-8 pb-0 px-6">
                    <div className="flex items-end justify-center gap-6">
                      {podiumOrder.map((entry, idx) => entry && (
                        <PodiumBlock key={entry.id} entry={entry} rank={podiumRanks[idx]} height={podiumHeights[idx]} show={podiumShow} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── TABLE ─── */}
              <div className="rounded-2xl border border-slate-700/50 overflow-hidden"
                style={{ background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)' }}>
                {/* Table header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/40">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Trophy className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-sm text-white">
                      {filter === "monthly" ? "Monthly Rankings" : "All-Time Rankings"}
                    </span>
                    <span className="text-slate-500 text-xs">— {leaderboard.length} players</span>
                  </div>
                  <div className="flex bg-slate-800/60 rounded-lg p-0.5 border border-slate-700/40">
                    {(["monthly", "alltime"] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                        {f === "monthly" ? "Monthly" : "All Time"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid px-6 py-2 text-[10px] uppercase tracking-widest text-slate-600 font-semibold border-b border-slate-800/60"
                  style={{ gridTemplateColumns: '40px 44px 1fr 80px 60px 80px 60px' }}>
                  <span>Rank</span>
                  <span></span>
                  <span>Student</span>
                  <span>Tasks</span>
                  <span>Trend</span>
                  <span>XP Bar</span>
                  <span className="text-right">XP</span>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-800/40 max-h-[600px] overflow-y-auto">
                  {leaderboard.map((entry) => {
                    const rank = entry.rank!;
                    const isMe = entry.id === user?.id;

                    return (
                      <div key={entry.id}
                        className={`grid items-center px-6 py-3 gap-3 transition-colors hover:bg-slate-800/40 ${isMe ? 'bg-indigo-500/10 border-l-[3px] border-indigo-400' : ''}`}
                        style={{ gridTemplateColumns: '40px 44px 1fr 80px 60px 80px 60px' }}>

                        {/* Rank */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${
                          rank === 1 ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300' :
                          rank === 2 ? 'bg-slate-300/15 border-slate-300/30 text-slate-300' :
                          rank === 3 ? 'bg-orange-500/20 border-orange-400/40 text-orange-300' :
                          'bg-slate-800/50 border-slate-700/40 text-slate-500'
                        }`}>
                          {rank <= 3 ? <Medal className="w-3.5 h-3.5" /> : rank}
                        </div>

                        {/* Avatar */}
                        <Avatar name={entry.name || "?"} size={38} />

                        {/* Name + degree */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-semibold text-sm truncate ${isMe ? 'text-indigo-300' : 'text-white'}`}>
                              {entry.name || "Anonymous"}
                            </span>
                            {isMe && <span className="text-[10px] bg-indigo-500/25 text-indigo-300 border border-indigo-400/30 px-1.5 rounded-full font-bold flex-shrink-0">YOU</span>}
                            {rank === 1 && <span className="text-[10px] text-yellow-400 flex-shrink-0">👑</span>}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{entry.field_of_study || entry.degree || "—"}</p>
                        </div>

                        {/* Tasks */}
                        <div className="flex items-center gap-1 text-xs">
                          <CheckSquare className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                          <span className={`font-semibold ${isMe ? 'text-cyan-300' : 'text-slate-300'}`}>{entry.tasks_completed ?? 0}</span>
                          <span className="text-slate-600">/ {TASKS_TOTAL}</span>
                        </div>

                        {/* Trend */}
                        <div>
                          <TrendBadge trend={entry.trend ?? "new"} delta={entry.trendDelta} />
                        </div>

                        {/* XP Bar */}
                        <XpBar xp={entry.xp} maxXp={maxXp} />

                        {/* XP number */}
                        <div className="text-right">
                          <span className={`text-sm font-bold ${rank <= 3 ? 'text-indigo-200' : isMe ? 'text-indigo-200' : 'text-slate-200'}`}>
                            {entry.xp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Rewards */}
        <div>
          <div className="rounded-2xl overflow-hidden sticky top-6"
            style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 40px rgba(99,102,241,0.08)' }}>
            <div className="px-6 pt-6 pb-4 border-b border-indigo-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400 blur-md opacity-40"></div>
                  <Trophy className="relative w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest">Semester</p>
                  <h2 className="text-xl font-black text-white">Rewards</h2>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Top 10 at semester end earn bonus XP and exclusive achievement badges.
              </p>
            </div>

            <div className="p-4 space-y-2">
              {REWARDS.map(({ place, suffix, bonusXP, color, topThree }) => {
                const isMyRank = myRank === place;
                return (
                  <div key={place}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                      isMyRank
                        ? 'bg-indigo-500/25 border-2 border-indigo-400/70 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
                        : topThree
                        ? 'bg-slate-800/60 border border-slate-600/40'
                        : 'bg-slate-900/40 border border-slate-800/40'
                    }`}
                  >
                    <div className="flex items-baseline gap-0.5">
                      <span className="font-black text-xl" style={{ color }}>{place}</span>
                      <span className="text-slate-400 text-xs">{suffix}</span>
                      <span className="text-slate-500 text-xs ml-1">place</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="font-black text-white">+{bonusXP.toLocaleString()}</span>
                      <span className="text-slate-400 text-[10px]">XP</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 pb-6">
              <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-xl p-3 text-center">
                <p className="text-indigo-300 text-xs">🏆 Rankings reset monthly — keep grinding!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}