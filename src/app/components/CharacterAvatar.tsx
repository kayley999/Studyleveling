import { useEffect, useRef } from "react";
import { useCharacter } from "../contexts/CharacterContext";

interface CharacterAvatarProps {
  size?: number; // Size of the container (will be square)
  className?: string;
}

export function CharacterAvatar({ size = 64, className = "" }: CharacterAvatarProps) {
  const { characterData } = useCharacter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Scale based on canvas size - we use 240x160 as base
    const scale = 40;

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

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
      <div 
        className="relative rounded-full border-4 border-cyan-400/50 overflow-hidden bg-slate-900 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <canvas
          ref={canvasRef}
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
          background: `repeating-linear-gradient(0deg, transparent, transparent ${Math.max(2, size / 32)}px, rgba(34, 211, 238, 0.05) ${Math.max(2, size / 32)}px, rgba(34, 211, 238, 0.05) ${Math.max(4, size / 16)}px), repeating-linear-gradient(90deg, transparent, transparent ${Math.max(2, size / 32)}px, rgba(34, 211, 238, 0.05) ${Math.max(2, size / 32)}px, rgba(34, 211, 238, 0.05) ${Math.max(4, size / 16)}px)`
        }}
      ></div>
    </div>
  );
}
