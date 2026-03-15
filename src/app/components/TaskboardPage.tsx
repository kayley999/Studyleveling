import { useState } from "react";
import { CheckCircle, Circle, ExternalLink, Sparkles, X } from "lucide-react";

interface Task {
  id: number;
  unit: string;
  title: string;
  description: string;
  xp: number;
  link: string;
  completed: boolean;
  isAnimating: boolean;
}

export function TaskboardPage() {
  const [activeTab, setActiveTab] = useState<"todo" | "completed">("todo");
  const [showNotification, setShowNotification] = useState(false);
  const [gainedXP, setGainedXP] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      unit: "FIT2004",
      title: "Algorithm Analysis Assignment",
      description: "Implement and analyze time complexity of sorting algorithms",
      xp: 250,
      link: "https://edstem.org",
      completed: false,
      isAnimating: false
    },
    {
      id: 2,
      unit: "FIT3170",
      title: "Software Requirements Document",
      description: "Create comprehensive SRS for your team project",
      xp: 300,
      link: "https://moodle.vle.monash.edu",
      completed: false,
      isAnimating: false
    },
    {
      id: 3,
      unit: "FIT3171",
      title: "Database Design Project",
      description: "Design and implement a normalized database schema",
      xp: 350,
      link: "https://moodle.vle.monash.edu",
      completed: false,
      isAnimating: false
    },
    {
      id: 4,
      unit: "FIT3152",
      title: "Data Visualization Report",
      description: "Create interactive dashboards using Python libraries",
      xp: 200,
      link: "https://ontrack.deakin.edu.au",
      completed: false,
      isAnimating: false
    }
  ]);

  const handleSubmitTask = (task: Task) => {
    // Show notification
    setGainedXP(task.xp);
    setShowNotification(true);

    // Start animation
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === task.id 
          ? { ...t, isAnimating: true }
          : t
      )
    );

    // After animation, mark as completed
    setTimeout(() => {
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id 
            ? { ...t, completed: true, isAnimating: false }
            : t
        )
      );
    }, 600);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const todoTasks = tasks.filter(t => !t.completed && !t.isAnimating);
  const completedTasks = tasks.filter(t => t.completed);
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* XP Gain Notification */}
      {showNotification && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right">
          <div className="relative bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-sm border-2 border-green-400 rounded-lg p-4 min-w-[300px]">
            <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse"></div>
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 blur-lg opacity-50"></div>
                <CheckCircle className="relative w-8 h-8 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1">Task Completed!</h3>
                <p className="text-green-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">+{gainedXP} XP</span>
                  gained
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">TASKBOARD</h1>
                <p className="text-cyan-400 text-sm">Complete tasks to earn XP and level up</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-cyan-400 mb-1">Available XP</div>
                <div className="text-3xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  {todoTasks.reduce((sum, task) => sum + task.xp, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Progress */}
      <div className="mb-6 bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300">Progress</span>
          <span className="text-cyan-400 font-semibold">{completedCount} / {totalTasks} Tasks Completed</span>
        </div>
        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${(completedCount / totalTasks) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("todo")}
          className={`flex-1 px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
            activeTab === "todo"
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-300'
          }`}
        >
          To Do ({todoTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 px-6 py-3 rounded-lg border-2 font-semibold transition-all ${
            activeTab === "completed"
              ? 'bg-green-500/20 border-green-400 text-green-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-green-400/50 hover:text-green-300'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {activeTab === "todo" && (
          <>
            {todoTasks.map((task) => (
              <div
                key={task.id}
                className={`relative transition-all duration-500 ${
                  task.isAnimating 
                    ? 'opacity-0 scale-95 -translate-y-4' 
                    : 'opacity-100 scale-100 translate-y-0'
                }`}
              >
                <div 
                  className={`relative bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 ${
                    task.isAnimating
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-700/50 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      {task.isAnimating ? (
                        <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-500" />
                      )}
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/30">
                              {task.unit}
                            </span>
                            <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              +{task.xp} XP
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {task.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {task.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <a
                          href={task.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded text-sm font-semibold transition-all"
                        >
                          View Task
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleSubmitTask(task)}
                          disabled={task.isAnimating}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {task.isAnimating ? 'Submitting...' : 'Submit Task'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Green flash effect on completion */}
                  {task.isAnimating && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State for To Do */}
            {todoTasks.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block relative mb-4">
                  <div className="absolute inset-0 bg-green-500 blur-xl opacity-50"></div>
                  <CheckCircle className="relative w-20 h-20 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">All Tasks Completed!</h3>
                <p className="text-slate-400">Great job! Check back later for more tasks.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "completed" && (
          <>
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="relative"
              >
                <div className="relative bg-slate-800/30 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/30">
                          {task.unit}
                        </span>
                        <span className="text-xs font-semibold text-yellow-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          +{task.xp} XP
                        </span>
                        <span className="text-xs text-green-400 ml-auto">✓ Completed</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white/80 mb-1 line-through">
                        {task.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State for Completed */}
            {completedTasks.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-block relative mb-4">
                  <Circle className="w-20 h-20 text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Completed Tasks Yet</h3>
                <p className="text-slate-400">Start completing tasks to see them here!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
