import { useState, useEffect } from "react";
import { CheckCircle, Circle, ExternalLink, Sparkles, X, Loader2, TrendingUp, Plus, Trash2, RefreshCw } from "lucide-react";
import { useUser } from "../contexts/UserContext";
import supabase from "../../supabaseClient";

interface Task {
  id: number;
  unit: string;
  title: string;
  description: string;
  xp: number;
  link: string;
  completed: boolean;
  isAnimating: boolean;
  isCustom?: boolean;
}

// IDs 1-4 are reserved system tasks; custom tasks start from 1000+
const SYSTEM_TASKS: Omit<Task, "completed" | "isAnimating">[] = [
  { id: 1, unit: "FIT2004", title: "Algorithm Analysis Assignment", description: "Implement and analyze time complexity of sorting algorithms", xp: 250, link: "https://edstem.org" },
  { id: 2, unit: "FIT3170", title: "Software Requirements Document", description: "Create comprehensive SRS for your team project", xp: 300, link: "https://moodle.vle.monash.edu" },
  { id: 3, unit: "FIT3171", title: "Database Design Project", description: "Design and implement a normalized database schema", xp: 350, link: "https://moodle.vle.monash.edu" },
  { id: 4, unit: "FIT3152", title: "Data Visualization Report", description: "Create interactive dashboards using Python libraries", xp: 200, link: "https://ontrack.deakin.edu.au" },
];

export function TaskboardPage() {
  const { user, profile, addXP, refreshProfile } = useUser();
  const [activeTab, setActiveTab] = useState<"todo" | "completed">("todo");
  const [notification, setNotification] = useState<{ show: boolean; xp: number; newTotal: number; levelUp: boolean }>({ show: false, xp: 0, newTotal: 0, levelUp: false });
  const [tasks, setTasks] = useState<Task[]>(SYSTEM_TASKS.map(t => ({ ...t, completed: false, isAnimating: false })));
  const [loadingInit, setLoadingInit] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);

  // Add task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ unit: "", title: "", description: "", xp: "100", link: "" });
  const [addError, setAddError] = useState<string | null>(null);

  // Load completed task IDs from Supabase
  useEffect(() => {
    if (!user) { setLoadingInit(false); return; }
    supabase
      .from('completed_tasks')
      .select('task_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data?.length) {
          const doneIds = new Set(data.map((r: any) => r.task_id));
          setTasks(prev => prev.map(t => ({ ...t, completed: doneIds.has(t.id) })));
        }
        setLoadingInit(false);
      });
  }, [user]);

  const handleSubmitTask = async (task: Task) => {
    if (!user || submitting !== null) return;
    setSubmitting(task.id);
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isAnimating: true } : t));

    try {
      // Save completion record
      await supabase.from('completed_tasks').insert({ user_id: user.id, task_id: task.id, xp_gained: task.xp });

      // Add XP to profile
      const oldLevel = profile?.level ?? 1;
      const { newXp, newLevel } = await addXP(task.xp);

      // Refresh so nav + leaderboard shows new value
      await refreshProfile();

      setNotification({ show: true, xp: task.xp, newTotal: newXp, levelUp: newLevel > oldLevel });
      setTimeout(() => setNotification(n => ({ ...n, show: false })), 4500);

      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true, isAnimating: false } : t));
      }, 550);
    } catch (err) {
      console.error("Submit error:", err);
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isAnimating: false } : t));
    } finally {
      setSubmitting(null);
    }
  };

  // Reset ONLY system tasks (delete completion records, restore local state)
  const handleResetDemo = async () => {
    if (!user || resetting) return;
    setResetting(true);
    try {
      const systemIds = SYSTEM_TASKS.map(t => t.id);
      await supabase
        .from('completed_tasks')
        .delete()
        .eq('user_id', user.id)
        .in('task_id', systemIds);

      setTasks(prev => prev.map(t => systemIds.includes(t.id) ? { ...t, completed: false, isAnimating: false } : t));
    } finally {
      setResetting(false);
    }
  };

  // Add a custom task (local only — custom tasks aren't stored in DB, just in component state)
  const handleAddTask = () => {
    setAddError(null);
    if (!newTask.unit.trim()) { setAddError("Unit code is required."); return; }
    if (!newTask.title.trim()) { setAddError("Task title is required."); return; }
    const xpVal = parseInt(newTask.xp);
    if (isNaN(xpVal) || xpVal < 1 || xpVal > 9999) { setAddError("XP must be 1–9999."); return; }

    const customId = 1000 + Date.now() % 100000;
    setTasks(prev => [...prev, {
      id: customId,
      unit: newTask.unit.trim().toUpperCase(),
      title: newTask.title.trim(),
      description: newTask.description.trim() || "Custom task",
      xp: xpVal,
      link: newTask.link.trim() || "#",
      completed: false,
      isAnimating: false,
      isCustom: true,
    }]);
    setNewTask({ unit: "", title: "", description: "", xp: "100", link: "" });
    setShowAddForm(false);
  };

  const handleRemoveCustomTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const todoTasks = tasks.filter(t => !t.completed && !t.isAnimating);
  const completedTasks = tasks.filter(t => t.completed);
  const totalXPAvailable = todoTasks.reduce((sum, t) => sum + t.xp, 0);
  const currentXp = profile?.xp ?? 0;
  const currentLevel = profile?.level ?? 1;
  const xpForNextLevel = currentLevel * 500;
  const xpForCurrentLevel = (currentLevel - 1) * 500;
  const xpProgress = currentXp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right duration-300">
          <div className="relative bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-sm border-2 border-green-400/80 rounded-xl p-5 min-w-[320px] shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <div className="absolute inset-0 bg-green-500/10 rounded-xl animate-pulse pointer-events-none"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="relative"><div className="absolute inset-0 bg-green-400 blur-md opacity-60"></div><CheckCircle className="relative w-7 h-7 text-green-400" /></div>
                  <span className="text-white font-bold text-lg">Task Complete!</span>
                </div>
                <button onClick={() => setNotification(n => ({ ...n, show: false }))} className="text-green-400/60 hover:text-green-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-400/30 rounded-lg px-3 py-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-black text-xl">+{notification.xp} XP</span>
                </div>
                <span className="text-slate-300 text-sm">Total: <span className="text-cyan-400 font-semibold">{notification.newTotal.toLocaleString()}</span></span>
              </div>
              {notification.levelUp && (
                <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-lg px-3 py-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-200 font-semibold text-sm">🎉 LEVEL UP! Now Level {currentLevel}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative mb-6">
        <div className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{ clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))', borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1', boxShadow: '0 0 40px rgba(59,130,246,0.3)' }}>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
          <div className="relative p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">TASKBOARD</h1>
              <p className="text-cyan-400 text-sm">Complete tasks to earn XP and climb the leaderboard</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-cyan-400 uppercase tracking-wider mb-0.5">XP Available</div>
                <div className="text-2xl font-bold text-white flex items-center gap-1.5"><Sparkles className="w-5 h-5 text-yellow-400" />{totalXPAvailable.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress Card */}
      <div className="mb-6 bg-slate-800/60 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border-2 border-cyan-400/40 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[9px] text-cyan-400/70 uppercase leading-none">Lv</span>
              <span className="text-xl font-black text-white leading-none">{currentLevel}</span>
            </div>
            <div>
              <p className="text-white font-semibold">{profile?.name || "Hunter"}</p>
              <p className="text-cyan-400 text-sm font-mono">{currentXp.toLocaleString()} XP total</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Reset demo button */}
            <button
              onClick={handleResetDemo}
              disabled={resetting || completedTasks.filter(t => !t.isCustom).length === 0}
              title="Reset system tasks for demo"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-orange-400/50 text-slate-400 hover:text-orange-400 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {resetting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Reset Tasks (Demo)
            </button>
            {/* Add task button */}
            <button
              onClick={() => { setShowAddForm(!showAddForm); setAddError(null); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 hover:border-cyan-400 text-cyan-400 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min((xpProgress / xpNeeded) * 100, 100)}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">{xpProgress} / {xpNeeded} XP to Level {currentLevel + 1}</p>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-6 bg-slate-800/70 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-5 animate-in slide-in-from-top duration-200">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-cyan-400" /> New Custom Task</h3>
          {addError && <p className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">{addError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold block mb-1">Unit Code *</label>
              <input className="w-full bg-slate-900/50 border border-slate-600 hover:border-cyan-400/50 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                placeholder="e.g. FIT3999" value={newTask.unit} onChange={e => setNewTask(p => ({ ...p, unit: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold block mb-1">XP Reward *</label>
              <input className="w-full bg-slate-900/50 border border-slate-600 hover:border-cyan-400/50 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                type="number" min="1" max="9999" placeholder="100" value={newTask.xp} onChange={e => setNewTask(p => ({ ...p, xp: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold block mb-1">Task Title *</label>
              <input className="w-full bg-slate-900/50 border border-slate-600 hover:border-cyan-400/50 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                placeholder="What needs to be done?" value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Description</label>
              <input className="w-full bg-slate-900/50 border border-slate-600 hover:border-cyan-400/50 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                placeholder="Optional details" value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Link (optional)</label>
              <input className="w-full bg-slate-900/50 border border-slate-600 hover:border-cyan-400/50 focus:border-cyan-400 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
                placeholder="https://..." value={newTask.link} onChange={e => setNewTask(p => ({ ...p, link: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAddTask}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-lg font-semibold text-sm transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Plus className="w-4 h-4" /> Add to Taskboard
            </button>
            <button onClick={() => { setShowAddForm(false); setAddError(null); }}
              className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["todo", "completed"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 rounded-xl border-2 font-semibold transition-all ${
              activeTab === tab
                ? tab === "todo" ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                                 : 'bg-green-500/20 border-green-400 text-green-400'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-cyan-400/40 hover:text-cyan-300'
            }`}>
            {tab === "todo" ? `To Do (${todoTasks.length})` : `Completed (${completedTasks.length})`}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {loadingInit ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {activeTab === "todo" && (
            <>
              {todoTasks.length === 0 && (
                <div className="text-center py-16">
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-30"></div>
                    <CheckCircle className="relative w-16 h-16 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">All Done!</h3>
                  <p className="text-slate-400 mb-4">Use "Reset Tasks (Demo)" to start again, or add a custom task.</p>
                  <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-cyan-500/15 border border-cyan-400/40 hover:border-cyan-400 text-cyan-400 rounded-lg text-sm font-semibold transition-all">
                    <Plus className="w-4 h-4" /> Add Custom Task
                  </button>
                </div>
              )}
              {todoTasks.map(task => (
                <div key={task.id}
                  className={`transition-all duration-500 ${task.isAnimating ? 'opacity-0 scale-95 -translate-y-3' : 'opacity-100'}`}>
                  <div className={`relative rounded-xl p-6 border-2 transition-all ${task.isAnimating ? 'border-green-500 bg-green-500/10' : task.isCustom ? 'bg-slate-800/40 border-cyan-400/20 hover:border-cyan-400/50' : 'bg-slate-800/50 border-slate-700/50 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]'}`}>
                    {task.isAnimating && <div className="absolute inset-0 bg-green-500/10 rounded-xl animate-pulse pointer-events-none"></div>}
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {task.isAnimating ? <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" /> : <Circle className="w-6 h-6 text-slate-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${task.isCustom ? 'text-cyan-300 bg-cyan-400/10 border-cyan-400/30' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30'}`}>{task.unit}</span>
                          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-400/20 rounded-md px-2 py-0.5">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold">+{task.xp} XP</span>
                          </div>
                          {task.isCustom && <span className="text-[10px] text-cyan-300/70 bg-cyan-500/10 border border-cyan-400/20 rounded px-1.5 py-0.5">Custom</span>}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-1">{task.title}</h3>
                        <p className="text-sm text-slate-400 mb-4">{task.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          {task.link && task.link !== "#" && (
                            <a href={task.link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 rounded-lg text-sm font-medium transition-all">
                              View Task <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => handleSubmitTask(task)}
                            disabled={!!task.isAnimating || submitting !== null || !user}
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                            {submitting === task.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Submit Task</>}
                          </button>
                          {task.isCustom && (
                            <button onClick={() => handleRemoveCustomTask(task.id)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 hover:border-red-400/40 text-red-400 rounded-lg text-sm transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "completed" && (
            <>
              {completedTasks.length === 0 && (
                <div className="text-center py-16">
                  <Circle className="w-14 h-14 text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Nothing completed yet</h3>
                  <p className="text-slate-500">Submit tasks from the To Do tab to earn XP.</p>
                </div>
              )}
              {completedTasks.map(task => (
                <div key={task.id} className="bg-slate-800/25 rounded-xl p-5 border border-green-500/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-green-400/70 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/15">{task.unit}</span>
                        <span className="text-xs text-yellow-400/70 flex items-center gap-1"><Sparkles className="w-3 h-3" />+{task.xp} XP</span>
                        <span className="text-xs text-green-400 ml-auto">✓ Done</span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-400 line-through">{task.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}