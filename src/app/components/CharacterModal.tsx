import { X } from "lucide-react";

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterImage: string;
  characterName: string;
}

export function CharacterModal({ isOpen, onClose, characterImage, characterName }: CharacterModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400/50 rounded-lg p-8 max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 40px rgba(34, 211, 238, 0.4), inset 0 0 60px rgba(34, 211, 238, 0.1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400/60 transition-all"
        >
          <X className="w-5 h-5 text-cyan-400" />
        </button>

        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-100 tracking-widest">
            &lt;STATS&gt;
          </h2>
        </div>

        {/* Character Display */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-64 h-64 rounded-full border-4 border-cyan-400/50 overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={characterImage}
                alt={characterName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pixel grid overlay */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(34, 211, 238, 0.05) 4px, rgba(34, 211, 238, 0.05) 8px), repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(34, 211, 238, 0.05) 4px, rgba(34, 211, 238, 0.05) 8px)'
              }}
            ></div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-white">{characterName}</h3>
            <div className="flex gap-2 justify-center">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-mono">
                COMPUTER SCIENCE
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-mono">
                MONASH STUDENT
              </span>
            </div>
          </div>

          {/* Stats Display */}
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="bg-slate-700/30 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Level</div>
              <div className="text-2xl font-bold text-white">12</div>
            </div>
            <div className="bg-slate-700/30 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Rank</div>
              <div className="text-2xl font-bold text-white">95</div>
            </div>
            <div className="bg-slate-700/30 border border-cyan-400/30 rounded-lg p-4 text-center">
              <div className="text-xs text-cyan-400 uppercase tracking-wide mb-1">Age</div>
              <div className="text-2xl font-bold text-white">88</div>
            </div>
          </div>
        </div>

        {/* Glowing particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}