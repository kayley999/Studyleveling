import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../contexts/UserContext";
import supabase from "../../supabaseClient";

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "What is the time complexity of binary search on a sorted array of n elements?",
    options: [
      "O(n)",
      "O(n²)",
      "O(log n)",
      "O(n log n)",
    ],
    correct: 2,
  },
  {
    id: 2,
    text: "Which data structure operates on a Last-In, First-Out (LIFO) principle?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Hash Table",
    ],
    correct: 1,
  },
  {
    id: 3,
    text: "In object-oriented programming, what does 'encapsulation' mean?",
    options: [
      "A class inheriting properties from another class",
      "A function calling itself recursively",
      "Bundling data and methods that operate on that data within a single unit",
      "One interface having multiple implementations",
    ],
    correct: 2,
  },
  {
    id: 4,
    text: "What does SQL stand for?",
    options: [
      "Structured Question Language",
      "Simple Query Logic",
      "Sequential Query Language",
      "Structured Query Language",
    ],
    correct: 3,
  },
];

const XP_REWARD = 150;
const COURSE_CODE = "FIT2004 - T1 - 2026";
const QUIZ_TITLE = "Homework Quiz 1 – Foundations of Algorithms and Data Structures";

export function DemoMoodlePage() {
  const navigate = useNavigate();
  const { user, profile, addXP, refreshProfile } = useUser();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(false);

  const allAnswered = QUIZ_QUESTIONS.every(q => answers[q.id] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    // Calculate score
    const correct = QUIZ_QUESTIONS.filter(q => answers[q.id] === q.correct).length;
    const grade = Math.round((correct / QUIZ_QUESTIONS.length) * 10 * 100) / 100;
    setScore(grade);

    // Award XP if user is logged in
    if (user) {
      try {
        // Record as a special "moodle" task (id 9001 to avoid collision)
        await supabase.from("completed_tasks").insert({
          user_id: user.id,
          task_id: 9001,
          xp_gained: XP_REWARD,
        }).single();
        await addXP(XP_REWARD);
        await refreshProfile();
        setXpAwarded(true);
      } catch {
        // Already submitted before — still show success
        setXpAwarded(false);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReturn = () => {
    navigate("/portal?moodle_xp=" + (xpAwarded ? XP_REWARD : 0));
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* ── MONASH NAVBAR ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Monash logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white text-xs font-black">M</span>
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-wide">MONASH College</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <span className="hover:text-gray-900 cursor-pointer">Key Info &amp; Support</span>
              <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
              <span className="hover:text-gray-900 cursor-pointer">My courses</span>
              <span className="hover:text-gray-900 cursor-pointer">My Media</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
              {(profile?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* ── SIDEBAR ── */}
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 min-h-screen p-4 hidden lg:block">
          <div className="space-y-1 text-sm">
            {[
              "Lecture 2 – Wednesday...",
              "Lecture 3 – Wednesday 8a...",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-gray-500 py-1">
                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}

            <div className="flex items-center gap-1 font-semibold text-gray-700 py-2 mt-2">
              <span className="text-xs">▼</span> Week 1
            </div>
            {[
              "Lecture Slides – Thinking lik...",
              "Tutorial Worksheet Week 1",
              "Getting Started",
              "Economics in the Media – T...",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-gray-500 py-1 ml-3">
                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                <span className="truncate text-xs">{item}</span>
              </div>
            ))}

            {/* Active item */}
            <div className="flex items-center gap-2 bg-blue-600 text-white rounded py-1.5 px-2 ml-3">
              <div className="w-3 h-3 rounded-full bg-green-400 flex-shrink-0" />
              <span className="truncate text-xs font-medium">Homework Quiz 1 – Foundat...</span>
            </div>

            {[
              "Test 1 – Practice Quiz (Topi...",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-gray-500 py-1 ml-3">
                <div className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0" />
                <span className="truncate text-xs">{item}</span>
              </div>
            ))}

            <div className="flex items-center gap-1 font-semibold text-gray-700 py-2 mt-1">
              <span className="text-xs">▼</span> Week 2
            </div>
            {[
              "Lecture Slides – Market forc...",
              "Lecture Quiz 1 – Found... 🔒",
              "Crossword puzzle – We... 🔒",
              "Tutorial Worksheets – Foun...",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-gray-500 py-1 ml-3">
                <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                <span className="truncate text-xs">{item}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 p-8 max-w-4xl">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
            <span className="text-blue-600 hover:underline cursor-pointer">{COURSE_CODE}</span>
            <span>/</span>
            <span className="text-blue-600 hover:underline cursor-pointer">Week 1</span>
            <span>/</span>
            <span className="text-gray-600 truncate">Homework Quiz 1 – Foundations of Economics and Gains from Trade</span>
          </div>

          {/* Title */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded bg-pink-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{QUIZ_TITLE}</h1>
          </div>

          {/* ── SUBMITTED STATE ── */}
          {submitted ? (
            <div>
              {/* Done badge */}
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span>✓ Done:</span> <span>Receive a grade</span>
              </div>

              {/* Meta */}
              <div className="text-sm text-gray-600 space-y-1 mb-8 border-b border-gray-200 pb-6">
                <p><span className="font-medium">Opened:</span> Friday, 27 February 2026, 9:00 AM</p>
                <p><span className="font-medium">Closed:</span> Sunday, 1 March 2026, 11:55 PM</p>
                <p className="mt-2"><span className="font-medium">Time limit:</span> 15 mins</p>
                <p><span className="font-medium">Grading method:</span> Highest grade</p>
              </div>

              {/* Attempts table */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary of your previous attempts</h2>
              <table className="w-full border-collapse border border-gray-200 text-sm mb-8">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">Attempt</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold">State</th>
                    <th className="border border-gray-200 px-4 py-2 text-right font-semibold">Grade / 10.00</th>
                    <th className="border border-gray-200 px-4 py-2 text-right font-semibold">Review</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 text-center">1</td>
                    <td className="border border-gray-200 px-4 py-3">
                      <span className="font-medium">Finished</span>
                      <br />
                      <span className="text-gray-500">Submitted {new Date().toLocaleString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-right font-semibold">{score.toFixed(2)}</td>
                    <td className="border border-gray-200 px-4 py-3 text-right">
                      <span className="text-blue-600 cursor-pointer hover:underline">Review</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="text-lg font-bold text-gray-900 text-center mb-6">
                Your final grade for this quiz is {score.toFixed(2)}/10.00.
              </p>

              {/* XP Banner — the Study Leveling integration moment */}
              {xpAwarded && (
                <div className="mb-6 rounded-xl overflow-hidden border-2 border-cyan-400/60"
                  style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", boxShadow: "0 0 30px rgba(99,102,241,0.3)" }}>
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-50 rounded-full"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-2xl">⚡</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-white font-black text-lg">+{XP_REWARD} XP earned on Study Leveling!</p>
                        <p className="text-cyan-400 text-sm">Moodle submission detected — your rank is updating now</p>
                      </div>
                    </div>
                    <button
                      onClick={handleReturn}
                      className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                    >
                      View Leaderboard →
                    </button>
                  </div>
                </div>
              )}

              {!xpAwarded && user && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                  XP already awarded for this quiz — check your Study Leveling profile!
                </div>
              )}

              {!user && (
                <div className="mb-6 rounded-xl border-2 border-indigo-300/40 bg-indigo-50 p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-indigo-900">Link your Study Leveling account to earn XP automatically!</p>
                    <p className="text-indigo-600 text-sm mt-0.5">Every Moodle submission earns you XP and boosts your rank.</p>
                  </div>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-sm ml-4"
                  >
                    Connect Account
                  </button>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={handleReturn}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-all"
                >
                  Back to the course
                </button>
              </div>
            </div>
          ) : (
            /* ── QUIZ STATE ── */
            <div>
              <div className="text-sm text-gray-600 space-y-1 mb-6 border-b border-gray-200 pb-4">
                <p><span className="font-medium">Opened:</span> Friday, 27 February 2026, 9:00 AM</p>
                <p><span className="font-medium">Closed:</span> Sunday, 1 March 2026, 11:55 PM</p>
                <p className="mt-2"><span className="font-medium">Time limit:</span> 15 mins</p>
                <p><span className="font-medium">Grading method:</span> Highest grade</p>
              </div>

              {/* Integration notice */}
              <div className="mb-6 p-4 rounded-lg border flex items-center gap-3 text-sm"
                style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", borderColor: "#7dd3fc" }}>
                <span className="text-2xl flex-shrink-0">⚡</span>
                <div>
                  <span className="font-semibold text-blue-900">Study Leveling connected</span>
                  <span className="text-blue-700"> — completing this quiz will award you </span>
                  <span className="font-bold text-indigo-700">+{XP_REWARD} XP</span>
                  <span className="text-blue-700"> on your leaderboard.</span>
                  {profile && <span className="text-blue-600"> Logged in as <strong>{profile.name}</strong>.</span>}
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {QUIZ_QUESTIONS.map((q, qi) => (
                  <div key={q.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                    <p className="font-semibold text-gray-900 mb-4">
                      <span className="text-blue-600 font-bold mr-2">Question {qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="space-y-2.5">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          answers[q.id] === oi
                            ? "bg-blue-50 border-blue-400"
                            : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                        }`}>
                          <input
                            type="radio"
                            name={`q${q.id}`}
                            value={oi}
                            checked={answers[q.id] === oi}
                            onChange={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                            className="mt-0.5 accent-blue-600 flex-shrink-0"
                          />
                          <span className="text-sm text-gray-800 leading-relaxed">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="mt-8 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {Object.keys(answers).length} / {QUIZ_QUESTIONS.length} answered
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitting}
                  className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all ${
                    allAnswered
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : "Submit all and finish"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}