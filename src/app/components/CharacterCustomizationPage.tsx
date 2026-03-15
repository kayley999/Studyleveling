import { useState, useRef, useEffect } from "react";
import { Palette, User, Shirt, Eye } from "lucide-react";
import { useCharacter } from "../contexts/CharacterContext";
import { motion } from "motion/react";

export function CharacterCustomizationPage() {
  const { characterData, updateCharacter } = useCharacter();
  const [selectedTab, setSelectedTab] = useState<"skin" | "hair" | "outfit" | "eyes">("skin");
  const [isWalkingOff, setIsWalkingOff] = useState(false);
  const [showFullCharacter, setShowFullCharacter] = useState(false);
  const faceCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullCharacterCanvasRef = useRef<HTMLCanvasElement>(null);
  const [walkFrame, setWalkFrame] = useState(0);

  const customizationOptions = {
    skin: [
      { id: 1, name: "Fair", color: "#FFDAB9" },
      { id: 2, name: "Medium", color: "#DEB887" },
      { id: 3, name: "Tan", color: "#D2691E" },
      { id: 4, name: "Deep", color: "#8B4513" },
    ],
    hair: [
      { id: 1, name: "Black", color: "#1a1a1a" },
      { id: 2, name: "Brown", color: "#654321" },
      { id: 3, name: "Blonde", color: "#F4D03F" },
      { id: 4, name: "Red", color: "#DC143C" },
      { id: 5, name: "Blue", color: "#4169E1" },
      { id: 6, name: "Pink", color: "#FF69B4" },
    ],
    outfit: [
      { id: 1, name: "Casual", color: "#3498db" },
      { id: 2, name: "Formal", color: "#2c3e50" },
      { id: 3, name: "Athletic", color: "#e74c3c" },
      { id: 4, name: "Tech", color: "#9b59b6" },
    ],
    eyes: [
      { id: 1, name: "Brown", color: "#654321" },
      { id: 2, name: "Blue", color: "#4169E1" },
      { id: 3, name: "Green", color: "#228B22" },
      { id: 4, name: "Grey", color: "#808080" },
    ],
  };

  const tabs = [
    { id: "skin" as const, name: "Skin", icon: User },
    { id: "hair" as const, name: "Hair", icon: Palette },
    { id: "outfit" as const, name: "Outfit", icon: Shirt },
    { id: "eyes" as const, name: "Eyes", icon: Eye },
  ];

  // Draw character face in circle
  useEffect(() => {
    const canvas = faceCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const scale = 40; // Larger scale for face-only view

    // Skin color - Head
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(2 * scale, 1 * scale, 2 * scale, 2 * scale);

    // Hair
    ctx.fillStyle = characterData.hairColor;
    ctx.fillRect(2 * scale, 1 * scale, 2 * scale, 1 * scale);

    // Eyes
    ctx.fillStyle = characterData.eyeColor;
    ctx.fillRect(2 * scale, 2 * scale, 0.5 * scale, 0.5 * scale);
    ctx.fillRect(3.5 * scale, 2 * scale, 0.5 * scale, 0.5 * scale);
  }, [characterData]);

  // Draw full character for walk-off animation
  useEffect(() => {
    if (!showFullCharacter) return;
    
    const canvas = fullCharacterCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = 27;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const legOffset = walkFrame === 1 || walkFrame === 3 ? 1 : 0;

    // Skin color - Head
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(7 * scale, 2 * scale, 2 * scale, 2 * scale);

    // Hair
    ctx.fillStyle = characterData.hairColor;
    ctx.fillRect(7 * scale, 2 * scale, 2 * scale, 1 * scale);

    // Eyes
    ctx.fillStyle = characterData.eyeColor;
    ctx.fillRect(7 * scale, 3 * scale, 0.5 * scale, 0.5 * scale);
    ctx.fillRect(8.5 * scale, 3 * scale, 0.5 * scale, 0.5 * scale);

    // Shirt
    ctx.fillStyle = characterData.outfit.shirtColor;
    ctx.fillRect(6 * scale, 4 * scale, 4 * scale, 3 * scale);

    // Arms
    ctx.fillRect(5 * scale, 4 * scale, 1 * scale, 2 * scale);
    ctx.fillRect(10 * scale, 4 * scale, 1 * scale, 2 * scale);

    // Hands
    ctx.fillStyle = characterData.skinColor;
    ctx.fillRect(5 * scale, 6 * scale, 1 * scale, 1 * scale);
    ctx.fillRect(10 * scale, 6 * scale, 1 * scale, 1 * scale);

    // Pants
    ctx.fillStyle = characterData.outfit.pantsColor;
    ctx.fillRect(6 * scale, 7 * scale, 4 * scale, 3 * scale);

    // Legs with walking animation
    if (legOffset === 0) {
      ctx.fillRect(6.5 * scale, 10 * scale, 1.5 * scale, 2 * scale);
      ctx.fillRect(8 * scale, 10 * scale, 1.5 * scale, 2 * scale);
    } else {
      ctx.fillRect(6.5 * scale, 10 * scale, 1.5 * scale, 2 * scale);
      ctx.fillRect(8 * scale, 10.5 * scale, 1.5 * scale, 1.5 * scale);
    }

    // Shoes
    ctx.fillStyle = "#1F2937";
    ctx.fillRect(6.5 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    if (legOffset === 0) {
      ctx.fillRect(8 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    } else {
      ctx.fillRect(8 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    }
  }, [walkFrame, characterData, showFullCharacter]);

  // Walking animation frames
  useEffect(() => {
    if (isWalkingOff) {
      const interval = setInterval(() => {
        setWalkFrame((prev) => (prev + 1) % 4);
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isWalkingOff]);

  const handleSaveChanges = () => {
    setShowFullCharacter(true);
    setIsWalkingOff(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 relative overflow-hidden">
      {/* Full Character Walking Off */}
      {showFullCharacter && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center"
          initial={{ x: "50vw" }}
          animate={{ x: "150vw" }}
          transition={{ duration: 3, ease: "linear" }}
        >
          <div className="relative">
            <canvas
              ref={fullCharacterCanvasRef}
              width={432}
              height={432}
              className="relative"
            />
            {/* Shadow */}
            <div className="w-64 h-8 mt-4 bg-black/30 rounded-full blur-md mx-auto"></div>
          </div>
        </motion.div>
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
            <h1 className="text-3xl font-bold text-white mb-2">CHARACTER CUSTOMIZATION</h1>
            <p className="text-cyan-400 text-sm">Personalize your student avatar</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Preview */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            Preview
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-64 h-64 rounded-full border-4 border-cyan-400/50 overflow-hidden bg-slate-900 flex items-center justify-center">
                <canvas
                  ref={faceCanvasRef}
                  width={240}
                  height={160}
                  className="scale-150"
                  style={{
                    imageRendering: 'pixelated'
                  }}
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
              <h3 className="text-2xl font-bold text-white">Kayley</h3>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm font-mono">
                  LEVEL 12
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSaveChanges}
              className="mt-8 w-full relative group"
              disabled={isWalkingOff}
            >
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
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
                    selectedTab === tab.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            <h3 className="text-sm text-cyan-400 uppercase tracking-wider font-semibold mb-3">
              Select {selectedTab}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {customizationOptions[selectedTab].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (selectedTab === 'skin') {
                      updateCharacter({ skinColor: option.color });
                    } else if (selectedTab === 'hair') {
                      updateCharacter({ hairColor: option.color });
                    } else if (selectedTab === 'eyes') {
                      updateCharacter({ eyeColor: option.color });
                    } else if (selectedTab === 'outfit') {
                      updateCharacter({ 
                        outfit: { 
                          ...characterData.outfit,
                          shirtColor: option.color 
                        } 
                      });
                    }
                  }}
                  className="group relative bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 hover:border-cyan-400/50 rounded-lg p-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-colors"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <div className="text-left">
                      <div className="text-white font-semibold">{option.name}</div>
                      <div className="text-xs text-slate-400 font-mono">{option.color}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Info */}
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