import { useState, useRef, useEffect } from "react";
import { Palette, User, Shirt, Eye, Pencil, Check, X } from "lucide-react";
import { useCharacter } from "../contexts/CharacterContext";
import { useUser } from "../contexts/UserContext";
import { motion } from "motion/react";

const SKIN_OPTIONS = [
  { id: 1, name: "Fair", color: "#FFDAB9" }, { id: 2, name: "Medium", color: "#DEB887" },
  { id: 3, name: "Tan", color: "#D2691E" }, { id: 4, name: "Deep", color: "#8B4513" },
];
const HAIR_OPTIONS = [
  { id: 1, name: "Black", color: "#1a1a1a" }, { id: 2, name: "Brown", color: "#654321" },
  { id: 3, name: "Blonde", color: "#F4D03F" }, { id: 4, name: "Red", color: "#DC143C" },
  { id: 5, name: "Blue", color: "#4169E1" }, { id: 6, name: "Pink", color: "#FF69B4" },
];
const OUTFIT_OPTIONS = [
  { id: 1, name: "Casual", color: "#3498db" }, { id: 2, name: "Formal", color: "#2c3e50" },
  { id: 3, name: "Athletic", color: "#e74c3c" }, { id: 4, name: "Tech", color: "#9b59b6" },
];
const EYE_OPTIONS = [
  { id: 1, name: "Brown", color: "#654321" }, { id: 2, name: "Blue", color: "#4169E1" },
  { id: 3, name: "Green", color: "#228B22" }, { id: 4, name: "Grey", color: "#808080" },
];

const TABS = [
  { id: "skin" as const, name: "Skin", icon: User, options: SKIN_OPTIONS },
  { id: "hair" as const, name: "Hair", icon: Palette, options: HAIR_OPTIONS },
  { id: "outfit" as const, name: "Outfit", icon: Shirt, options: OUTFIT_OPTIONS },
  { id: "eyes" as const, name: "Eyes", icon: Eye, options: EYE_OPTIONS },
];

type TabId = "skin" | "hair" | "outfit" | "eyes";

export function CharacterCustomizationPage() {
  const { characterData } = useCharacter();
  const { profile, updateProfile } = useUser();
  const [selectedTab, setSelectedTab] = useState<TabId>("skin");
  const [isWalkingOff, setIsWalkingOff] = useState(false);
  const [showFullCharacter, setShowFullCharacter] = useState(false);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullCharacterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [walkFrame, setWalkFrame] = useState(0);

  // Editable display name
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  const displayName = profile?.name || "Hunter";

  // Draw face preview
  useEffect(() => {
    const canvas = faceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    const s = 40;
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(2*s, 1*s, 2*s, 2*s);
    ctx.fillStyle = characterData.hairColor;
    ctx.fillRect(2*s, 1*s, 2*s, 1*s);
    ctx.fillStyle = characterData.eyeColor;
    ctx.fillRect(2*s, 2*s, 0.5*s, 0.5*s);
    ctx.fillRect(3.5*s, 2*s, 0.5*s, 0.5*s);
  }, [characterData]);

  // Draw full character for walk-off
  useEffect(() => {
    if (!showFullCharacter) return;
    const canvas = fullCharacterCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = 27;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    const legOffset = walkFrame === 1 || walkFrame === 3 ? 1 : 0;
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(7*s, 2*s, 2*s, 2*s);
    ctx.fillStyle = characterData.hairColor;
    ctx.fillRect(7*s, 2*s, 2*s, 1*s);
    ctx.fillStyle = characterData.eyeColor;
    ctx.fillRect(7*s, 3*s, 0.5*s, 0.5*s);
    ctx.fillRect(8.5*s, 3*s, 0.5*s, 0.5*s);
    ctx.fillStyle = characterData.outfit.shirtColor;
    ctx.fillRect(6*s, 4*s, 4*s, 3*s);
    ctx.fillRect(5*s, 4*s, 1*s, 2*s);
    ctx.fillRect(10*s, 4*s, 1*s, 2*s);
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(5*s, 6*s, 1*s, 1*s);
    ctx.fillRect(10*s, 6*s, 1*s, 1*s);
    ctx.fillStyle = characterData.outfit.pantsColor;
    ctx.fillRect(6*s, 7*s, 4*s, 3*s);
    if (legOffset === 0) {
      ctx.fillRect(6.5*s, 10*s, 1.5*s, 2*s);
      ctx.fillRect(8*s, 10*s, 1.5*s, 2*s);
    } else {
      ctx.fillRect(6.5*s, 10*s, 1.5*s, 2*s);
      ctx.fillRect(8*s, 10.5*s, 1.5*s, 1.5*s);
    }
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(6.5*s, 11.5*s, 1.5*s, 0.5*s);
    ctx.fillRect(8*s, 11.5*s, 1.5*s, 0.5*s);
  }, [walkFrame, characterData, showFullCharacter]);

  useEffect(() => {
    if (isWalkingOff) {
      const iv = setInterval(() => setWalkFrame(p => (p+1)%4), 200);
      return () => clearInterval(iv);
    }
  }, [isWalkingOff]);

  const handleSaveChanges = () => {
    setShowFullCharacter(true);
    setIsWalkingOff(true);
    setTimeout(() => { setShowFullCharacter(false); setIsWalkingOff(false); }, 3200);
  };

  const handleSaveName = async () => {
    if (!nameValue.trim()) return;
    setSavingName(true);
    await updateProfile({ name: nameValue.trim() });
    setSavingName(false);
    setEditingName(false);
  };

  const currentTabData = TABS.find(t => t.id === selectedTab);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 relative overflow-hidden">
      {/* Walk off animation */}
      {showFullCharacter && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center"
          initial={{ x: "50vw" }}
          animate={{ x: "150vw" }}
          transition={{ duration: 3, ease: "linear" }}
        >
          <canvas ref={fullCharacterCanvasRef} width={432} height={432} />
        </motion.div>
      )}

      {/* Header */}
      <div className="relative mb-8">
        <div className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{ clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))', borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1', boxShadow: '0 0 40px rgba(59,130,246,0.3)' }}>
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
          <div className="relative p-8">
            <h1 className="text-3xl font-bold text-white mb-2">CHARACTER CUSTOMIZATION</h1>
            <p className="text-cyan-400 text-sm">Personalize your student avatar</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            Preview
          </h2>

          <div className="flex flex-col items-center">
            {/* Face preview */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-60 h-60 rounded-full border-4 border-cyan-400/50 overflow-hidden bg-slate-900 flex items-center justify-center">
                <canvas ref={faceCanvasRef} width={240} height={160} className="scale-150" style={{ imageRendering: 'pixelated' }} />
              </div>
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(34, 211, 238, 0.04) 4px, rgba(34, 211, 238, 0.04) 8px), repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(34, 211, 238, 0.04) 4px, rgba(34, 211, 238, 0.04) 8px)' }} />
            </div>

            {/* Editable name */}
            <div className="text-center space-y-2 mb-6">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    className="bg-slate-800/50 border border-cyan-400/50 rounded-lg px-3 py-1.5 text-white text-xl font-bold text-center focus:outline-none focus:border-cyan-400 w-48"
                    value={nameValue}
                    onChange={e => setNameValue(e.target.value)}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                  />
                  <button onClick={handleSaveName} disabled={savingName} className="p-1.5 bg-green-500/20 border border-green-400/30 rounded text-green-400 hover:bg-green-500/30 transition-all">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingName(false)} className="p-1.5 bg-red-500/20 border border-red-400/30 rounded text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <h3 className="text-2xl font-bold text-white">{displayName}</h3>
                  <button onClick={() => { setNameValue(displayName); setEditingName(true); }} className="p-1 text-slate-500 hover:text-cyan-400 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-mono">
                  LEVEL {profile?.level ?? 1}
                </span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-sm font-mono">
                  {(profile?.xp ?? 0).toLocaleString()} XP
                </span>
              </div>
            </div>

            <button onClick={handleSaveChanges} disabled={isWalkingOff}
              className="w-full relative group disabled:opacity-50">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                {isWalkingOff ? "Saving..." : "Save Changes"}
              </div>
            </button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            Customize
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-cyan-400/50'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Color grid */}
          <div>
            <h3 className="text-sm text-cyan-400 uppercase tracking-wider font-semibold mb-4">
              Select {selectedTab}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {currentTabData?.options.map(option => (
                <button key={option.id}
                  className="group bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-cyan-400/50 rounded-lg p-4 transition-all text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 group-hover:border-cyan-400/60 transition-all flex-shrink-0"
                      style={{ backgroundColor: option.color }}></div>
                    <div>
                      <div className="text-white font-semibold text-sm">{option.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{option.color}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
            <p className="text-sm text-cyan-400">
              💡 Tip: Unlock more customization options by leveling up and completing special tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}