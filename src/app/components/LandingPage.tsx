import { useNavigate } from "react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"about" | "who" | "resources">("about");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Glowing orbs */}
      <div className="absolute top-40 left-40 w-96 h-96 bg-cyan-500 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
      <div className="absolute bottom-40 right-40 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 mt-20"
        >
          <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tight">
            STUDY LEVELING
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="relative inline-block">
            {/* Glow effect behind text */}
            <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-60 animate-pulse"></div>
            <h2 className="relative text-3xl md:text-4xl font-semibold text-cyan-400 tracking-wide" style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.5)' }}>
              "The Elevated Study Experience"
            </h2>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto"
        >
          Experience education like never before. Complete quests, earn XP, unlock achievements, 
          and rise through the ranks as you master your subjects in this gamified learning platform.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <button
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg transition-all hover:scale-105"
          >
            <span className="relative z-10 uppercase tracking-wider">Begin Your Journey</span>
            <ArrowRight className="relative z-10 w-6 h-6 transition-transform group-hover:translate-x-1" />
            
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></div>
            <div className="absolute inset-0 bg-white opacity-10 blur-lg animate-pulse"></div>
          </button>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-24 pt-12 border-t border-cyan-500/20"
        >
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("about")}
              className={`px-6 py-3 font-semibold uppercase tracking-wider transition-all ${
                activeTab === "about"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab("who")}
              className={`px-6 py-3 font-semibold uppercase tracking-wider transition-all ${
                activeTab === "who"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              Who We Are
            </button>
            <button
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-3 font-semibold uppercase tracking-wider transition-all ${
                activeTab === "resources"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-cyan-300"
              }`}
            >
              Resources
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="max-w-3xl mx-auto min-h-[300px]">
            {activeTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-8 text-slate-300 text-lg leading-relaxed"
              >
                <p>
                  For many students, studying is a very important and prevalent aspect of daily life — with the weight of their future, success and achievements weighing on academic performances. 
                  The idea of even just <strong className="text-cyan-400">BEGINNING</strong> to study… or <strong className="text-cyan-400">WHERE</strong> to start studying… or <strong className="text-cyan-400">WHAT</strong> to study, can already be a tiresome burden on a student's shoulders. 
                  <strong className="text-cyan-400"> STUDY LEVELLING</strong> is a platform designed to help students stay organised and motivated, fostering a connected environment with a flare of competition and fun, in a game-like manner!
                </p>
                
                <p>
                  Rather than a neverending list of assignments to do; study levelling reframes any pessimistic attitudes towards studying to <strong className="text-cyan-400">ONE</strong> where growth and progress can <strong className="text-cyan-400">TRULY</strong> be felt. 
                  The platform curates daily bit-sized tasks that feel less daunting and updates a progress bar in each unit for students to <strong className="text-cyan-400">VISUALLY</strong> see and feel their development.
                </p>
                
                <p>
                  Every assignment, quiz, and study session, no matter how big or small, is deemed as a fruitful achievement that earns users XP to level up their character and unlock special features within the web app! 
                  Watch your progress <strong className="text-cyan-400">IN REAL TIME</strong>, farming your levels, climbing ranks on the leaderboard and collaborating in study guilds with peers and friends to enhance your educational journeys.
                </p>
                
                <p>
                  Naturally, Study Levelling appeals to the competitive and motivated drive of students, making studying and learning feel like a fun, productive game!
                </p>
              </motion.div>
            )}

            {activeTab === "who" && (
              <motion.div
                key="who"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6 text-slate-300 text-lg leading-relaxed"
              >
                <p>
                  We are a team of educators and game developers who believe that <strong className="text-cyan-400">learning should be as exciting as gaming</strong>. 
                  Our diverse backgrounds span educational technology, game design, and psychology—all united by a single mission: making education engaging for the next generation.
                </p>
                
                <p>
                  Founded by former educators who witnessed firsthand how students light up when playing games but struggle to find that same excitement in traditional classrooms, 
                  Study Leveling was born from a simple question: <em className="text-cyan-300">"What if we could harness that gaming enthusiasm for learning?"</em>
                </p>
                
                <p>
                  Today, our platform serves thousands of students worldwide, helping them discover that learning can be just as thrilling as defeating a final boss or reaching a new level. 
                  We're constantly evolving, listening to student feedback, and adding new features that make education feel less like work and more like an <strong className="text-cyan-400">epic quest worth conquering</strong>.
                </p>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="text-left space-y-6 text-slate-300 text-lg leading-relaxed"
              >
                <p>
                  Study Leveling provides a comprehensive suite of tools designed to enhance your learning experience:
                </p>
                
                <ul className="space-y-4 ml-6 list-none">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">⚔️</span>
                    <div>
                      <strong className="text-cyan-400">Quest System:</strong> Access hundreds of pre-built educational quests across all subjects, or create custom challenges tailored to your curriculum.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">📊</span>
                    <div>
                      <strong className="text-cyan-400">Analytics Dashboard:</strong> Track your progress with detailed statistics, identify weak areas, and celebrate your victories with visual progress reports.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">🏆</span>
                    <div>
                      <strong className="text-cyan-400">Achievement Library:</strong> Browse over 500 unique badges and titles to unlock as you master different skills and subjects.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">👥</span>
                    <div>
                      <strong className="text-cyan-400">Study Guilds:</strong> Join or create study groups, compete in team challenges, and share resources with fellow students on the same learning path.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 font-bold">📚</span>
                    <div>
                      <strong className="text-cyan-400">Resource Hub:</strong> Access study guides, practice problems, video tutorials, and community-created content to support your learning journey.
                    </div>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}