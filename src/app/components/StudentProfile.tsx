import { useState } from "react";
import { CharacterModal } from "./CharacterModal";
import { BookOpen, Award, ExternalLink, Target } from "lucide-react";
import characterImg from "figma:asset/97014d479e747af3339d4cee1583bc5a04df0e98.png";

export function StudentProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const student = {
    name: "Kayley",
    school: "Monash University",
    photo: characterImg,
    studentId: "#07866767",
    gpa: "3.95",
    major: "Computer Science & Mathematics",
    achievements: [
      "National Merit Scholar Finalist",
      "Science Olympiad Gold Medalist",
      "Programming Competition Winner"
    ],
    units: [
      { 
        code: "FIT2004",
        name: "Algorithms and Data Structures", 
        grade: "A",
        links: [
          { name: "Ed", url: "https://edstem.org" },
          { name: "Moodle", url: "https://moodle.vle.monash.edu" }
        ]
      },
      { 
        code: "FIT3170",
        name: "Software Engineering Practice", 
        grade: "A+",
        links: [
          { name: "Ed", url: "https://edstem.org" },
          { name: "Moodle", url: "https://moodle.vle.monash.edu" }
        ]
      },
      { 
        code: "FIT3171",
        name: "Databases", 
        grade: "A",
        links: [
          { name: "Ed", url: "https://edstem.org" },
          { name: "OnTrack", url: "https://ontrack.deakin.edu.au" }
        ]
      },
      { 
        code: "FIT3152",
        name: "Data Analytics", 
        grade: "A-",
        links: [
          { name: "Moodle", url: "https://moodle.vle.monash.edu" },
          { name: "OnTrack", url: "https://ontrack.deakin.edu.au" }
        ]
      }
    ]
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Solo Leveling Style Character Summary Box */}
      <div className="relative mb-8">
        {/* Main Box */}
        <div 
          className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{
            clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
            borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)'
          }}
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-1 left-6 w-8 h-0.5 bg-cyan-400"></div>
            <div className="absolute top-6 left-1 w-0.5 h-8 bg-cyan-400"></div>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16">
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute top-1 right-6 w-8 h-0.5 bg-cyan-400"></div>
            <div className="absolute top-6 right-1 w-0.5 h-8 bg-cyan-400"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16">
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-1 left-6 w-8 h-0.5 bg-cyan-400"></div>
            <div className="absolute bottom-6 left-1 w-0.5 h-8 bg-cyan-400"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16">
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-1 right-6 w-8 h-0.5 bg-cyan-400"></div>
            <div className="absolute bottom-6 right-1 w-0.5 h-8 bg-cyan-400"></div>
          </div>

          {/* Circuit lines */}
          <div className="absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>

          {/* Content */}
          <div className="relative p-8">
            <div className="flex items-center gap-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <button className="group relative w-40 h-40 mx-auto mb-6">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  
                  {/* Circular photo container */}
                  <div className="relative w-40 h-40 rounded-full border-4 border-cyan-400/50 group-hover:border-cyan-400 overflow-hidden bg-slate-900 transition-all flex items-center justify-center">
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Pixel grid overlay */}
                  <div 
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(34, 211, 238, 0.05) 3px, rgba(34, 211, 238, 0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(34, 211, 238, 0.05) 3px, rgba(34, 211, 238, 0.05) 6px)'
                    }}
                  ></div>
                </button>
              </div>

              {/* Student Info */}
              <div className="flex-1 space-y-3 text-white">
                <div className="flex items-baseline gap-3">
                  <span className="text-lg">{student.name}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-mono">{student.studentId}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-lg">{student.school}</span>
                </div>
              </div>

              {/* Right side decorative elements */}
              <div className="hidden lg:flex flex-col gap-2 text-cyan-400">
                <div className="flex gap-1">
                  <div className="w-3 h-3 border border-cyan-400"></div>
                  <div className="w-3 h-3 border border-cyan-400"></div>
                  <div className="w-3 h-3 border border-cyan-400"></div>
                </div>
                <div className="text-xs font-mono text-right opacity-60">ID: {student.studentId.replace('#', '')}</div>
              </div>
            </div>
            
            {/* XP Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center text-xs text-cyan-400">
                <span className="font-semibold tracking-wider uppercase">Experience</span>
                <span className="font-mono">2,450 / 3,000 XP</span>
              </div>
              <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-400/30">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: '81.67%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-lg">LEVEL 12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
            }}
          ></div>
        </div>

        {/* Outer glow */}
        <div 
          className="absolute inset-0 bg-blue-500/20 blur-2xl -z-10"
          style={{
            clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))'
          }}
        ></div>
      </div>

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Academic Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Academic Stats */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              Academic Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">GPA</span>
                <span className="text-2xl font-bold text-cyan-400">{student.gpa}</span>
              </div>
              <div className="flex items-start gap-3 text-slate-300">
                <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400 mb-1">Major</div>
                  <div className="text-sm">{student.major}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Courses and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Units */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              Current Units
            </h2>
            <div className="space-y-3">
              {student.units.map((unit, index) => (
                <div
                  key={index}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <BookOpen className="w-5 h-5 text-blue-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-cyan-400 font-mono text-sm font-semibold">{unit.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            unit.grade.startsWith('A') 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {unit.grade}
                          </span>
                        </div>
                        <span className="text-slate-200">{unit.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-8">
                    {unit.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded text-xs font-semibold transition-all"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {student.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <Award className="w-6 h-6 text-yellow-400 mb-2" />
                  <div className="text-sm text-slate-200">{achievement}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Character Modal */}
      <CharacterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        characterImage={student.photo}
        characterName={student.name}
      />
    </div>
  );
}