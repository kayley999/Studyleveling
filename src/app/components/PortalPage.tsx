import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { User, CheckSquare, Trophy, BookOpen, MessageSquare, FileText, Settings } from "lucide-react";
import { CharacterAvatar } from "./CharacterAvatar";
import characterImg from "figma:asset/97014d479e747af3339d4cee1583bc5a04df0e98.png";

export function PortalPage() {
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState<string | null>(null);
  const [isHoveringCenter, setIsHoveringCenter] = useState(false);

  const handleNavigate = (path: string, id: string) => {
    setClickedButton(id);
    setTimeout(() => {
      navigate(path);
      setClickedButton(null);
    }, 400);
  };

  const portalBoxes = [
    { id: "dashboard", title: "Dashboard", path: "/dashboard", icon: User },
    { id: "taskboard", title: "Taskboard", path: "/taskboard", icon: CheckSquare },
    { id: "leaderboard", title: "Leaderboard", path: "/leaderboard", icon: Trophy },
    { id: "character", title: "Character", path: "/character", icon: BookOpen },
    { id: "social", title: "Social", path: "/social", icon: MessageSquare },
    { id: "assessments", title: "Assessments", path: "/assessments", icon: FileText },
    { id: "units", title: "Units", path: "/dashboard", icon: BookOpen },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden p-6">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[900px] h-[900px] rounded-full border border-cyan-500/10 animate-pulse"></div>
        <div className="absolute w-[700px] h-[700px] rounded-full border border-cyan-500/20" 
          style={{ animation: 'pulse 3s ease-in-out infinite' }}></div>
        <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/30"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}></div>
      </div>

      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 animate-pulse"></div>
            <h1 className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 tracking-wider mb-4">
              STUDENT PORTAL
            </h1>
          </div>
        </div>

        {/* Daily Challenges Banner */}
        <div className="mb-4 flex justify-center px-8">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30 blur-xl group-hover:blur-2xl transition-all"></div>
            <div 
              className="relative w-full h-[200px] bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-sm border-2 border-cyan-400/60 overflow-hidden shadow-[inset_0_0_40px_rgba(34,211,238,0.3)] group hover:shadow-[inset_0_0_60px_rgba(34,211,238,0.5),0_0_40px_rgba(34,211,238,0.6)] hover:border-cyan-400 transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))'
              }}
            >
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70"></div>

              {/* Animated circuit lines */}
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>

              <div className="relative h-full flex items-center justify-between px-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                    <CheckSquare className="w-7 h-7 text-cyan-300" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 tracking-wider uppercase mb-1">
                      Daily Challenges
                    </h3>
                    <p className="text-cyan-400/70 text-sm tracking-wide mb-3">
                      Complete tasks to earn bonus XP
                    </p>
                    
                    {/* Task Previews */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-cyan-300/80">
                        <div className="w-3 h-3 rounded border border-cyan-400/50"></div>
                        <span>Complete 5 FIT2004 tasks</span>
                        <span className="text-yellow-400 ml-auto">+50 XP</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-cyan-300/80">
                        <div className="w-3 h-3 rounded border border-cyan-400/50"></div>
                        <span>Submit 3 assessments</span>
                        <span className="text-yellow-400 ml-auto">+75 XP</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-cyan-300/80">
                        <div className="w-3 h-3 rounded border border-cyan-400/50"></div>
                        <span>Reach daily study goal</span>
                        <span className="text-yellow-400 ml-auto">+100 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleNavigate("/taskboard", "daily-challenges")}
                  className="group flex items-center gap-3 transition-all duration-300 hover:scale-105 flex-shrink-0"
                >
                  <div className="text-right">
                    <p className="text-xs text-cyan-400/60 uppercase tracking-widest">Available</p>
                    <p className="text-xl font-bold text-cyan-300">3 Tasks</p>
                  </div>
                  <div className="w-10 h-10 rounded border border-cyan-400/60 flex items-center justify-center group-hover:bg-cyan-400/20 group-hover:border-cyan-400 transition-all">
                    <span className="text-cyan-300 text-xl font-bold">→</span>
                  </div>
                </button>
              </div>
              
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.05) 2px, rgba(59, 130, 246, 0.05) 4px)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Select Your Destination text */}
        <div className="text-center" style={{ marginTop: '15px', marginBottom: '8px' }}>
          <p className="text-cyan-400/70 text-sm tracking-widest uppercase">
            Select Your Destination
          </p>
        </div>

        {/* Radial Circle Layout with Uniform Solo Leveling Boxes */}
        <div className="relative w-[900px] h-[700px] mx-auto">
          {/* SVG for connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Connection lines from center to each button */}
            {/* Top Left - Dashboard */}
            <line x1="450" y1="350" x2="180" y2="200" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Top Center - Taskboard */}
            <line x1="450" y1="350" x2="450" y2="150" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Top Right - Leaderboard */}
            <line x1="450" y1="350" x2="720" y2="200" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Middle Left - Character (straight line) */}
            <line x1="450" y1="350" x2="140" y2="305" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Middle Right - Social (straight line) */}
            <line x1="450" y1="350" x2="760" y2="305" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Middle Left Bottom - Assessments */}
            <line x1="450" y1="350" x2="50" y2="450" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Middle Right Bottom - Units */}
            <line x1="450" y1="350" x2="850" y2="450" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
            {/* Bottom Center - Settings */}
            <line x1="450" y1="350" x2="450" y2="550" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="2" filter="url(#glow)" />
          </svg>

          {/* Center Circle - Interactive with Character Face */}
          <button
            onClick={() => navigate("/character")}
            onMouseEnter={() => setIsHoveringCenter(true)}
            onMouseLeave={() => setIsHoveringCenter(false)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ zIndex: 10 }}
          >
            <CharacterAvatar size={208} />
          </button>

          {/* Top Left - Dashboard */}
          <div className="absolute" style={{ top: '150px', left: '50px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/dashboard", "dashboard")}
              className={`group relative transition-all duration-300 ${clickedButton === "dashboard" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <User className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Dashboard
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Top Center - Taskboard */}
          <div className="absolute" style={{ top: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/taskboard", "taskboard")}
              className={`group relative transition-all duration-300 ${clickedButton === "taskboard" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <CheckSquare className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Taskboard
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Top Right - Leaderboard */}
          <div className="absolute" style={{ top: '150px', right: '50px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/leaderboard", "leaderboard")}
              className={`group relative transition-all duration-300 ${clickedButton === "leaderboard" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <Trophy className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Leaderboard
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Middle Left - Character (straight line) */}
          <div className="absolute" style={{ top: '260px', left: '20px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/character", "character")}
              className={`group relative transition-all duration-300 ${clickedButton === "character" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <BookOpen className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Character
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Middle Right - Social (straight line) */}
          <div className="absolute" style={{ top: '260px', right: '20px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/social", "social")}
              className={`group relative transition-all duration-300 ${clickedButton === "social" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <MessageSquare className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Social
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Middle Left Bottom - Assessments */}
          <div className="absolute" style={{ top: '400px', left: '0px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/assessments", "assessments")}
              className={`group relative transition-all duration-300 ${clickedButton === "assessments" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <FileText className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Assessments
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Middle Right Bottom - Units */}
          <div className="absolute" style={{ top: '400px', right: '0px', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/dashboard", "units")}
              className={`group relative transition-all duration-300 ${clickedButton === "units" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <BookOpen className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Units
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>

          {/* Bottom Center - Settings */}
          <div className="absolute" style={{ top: '500px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
            <button
              onClick={() => handleNavigate("/settings", "settings")}
              className={`group relative transition-all duration-300 ${clickedButton === "settings" ? 'scale-105' : ''}`}
            >
              <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-500/40 blur-xl transition-all"></div>
              <div 
                className="relative w-[240px] h-[90px] bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border-2 border-cyan-400/60 group-hover:border-cyan-400 transition-all overflow-hidden shadow-[inset_0_0_30px_rgba(34,211,238,0.2)]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

                <div className="relative h-full flex items-center justify-center px-6">
                  <Settings className="w-6 h-6 text-cyan-300 mr-3" />
                  <span className="text-white font-semibold tracking-wider uppercase">
                    Settings
                  </span>
                </div>
                
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
                  }}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}