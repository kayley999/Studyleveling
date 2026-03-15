import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCharacter } from "../contexts/CharacterContext";

interface OutfitVariation {
  shirtColor: string;
  pantsColor: string;
  name: string;
}

const outfitVariations: OutfitVariation[] = [
  { shirtColor: '#FFFFFF', pantsColor: '#3B82F6', name: 'Classic' },
  { shirtColor: '#EF4444', pantsColor: '#1F2937', name: 'Bold Red' },
  { shirtColor: '#22C55E', pantsColor: '#92400E', name: 'Forest' },
  { shirtColor: '#A855F7', pantsColor: '#334155', name: 'Royal' },
  { shirtColor: '#F59E0B', pantsColor: '#065F46', name: 'Autumn' },
];

export function CharacterCreatorPage() {
  const navigate = useNavigate();
  const { setCharacterData } = useCharacter();
  const [animationStage, setAnimationStage] = useState<"walking-in" | "stopped" | "customizing" | "celebrating" | "walking-out" | "complete">("walking-in");
  const [characterPosition, setCharacterPosition] = useState(-10);
  const [isZooming, setIsZooming] = useState(false);
  const [characterScale, setCharacterScale] = useState(1);
  const [arrowBounce, setArrowBounce] = useState<'left' | 'right' | null>(null);
  const [walkFrame, setWalkFrame] = useState(0);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sequential popup states
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [isPopupFadingOut, setIsPopupFadingOut] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showGreetingPopup, setShowGreetingPopup] = useState(false);
  const [isGreetingFadingOut, setIsGreetingFadingOut] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [hasChangedOutfit, setHasChangedOutfit] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Show welcome popup after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcomePopup(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handlePopupClick = () => {
    setIsPopupFadingOut(true);
    
    setTimeout(() => {
      setShowWelcomePopup(false);
      setShowSignUpForm(true); // Show sign-up form instead of character
    }, 500); // Match fade-out duration
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim() && password.trim()) {
      setShowSignUpForm(false);
      setShowGreetingPopup(true);
    }
  };

  const handleGreetingClick = () => {
    setIsGreetingFadingOut(true);
    
    setTimeout(() => {
      setShowGreetingPopup(false);
      setShowCharacter(true);
      setAnimationStage("walking-in"); // Start walking animation
    }, 500);
  };

  // Walking animation frames
  useEffect(() => {
    if (animationStage === "walking-in" || animationStage === "walking-out") {
      const frameInterval = setInterval(() => {
        setWalkFrame(prev => (prev + 1) % 4);
      }, 200);

      return () => clearInterval(frameInterval);
    }
  }, [animationStage]);

  useEffect(() => {
    // Stage 1: Character walks in from left
    if (animationStage === "walking-in") {
      const walkInterval = setInterval(() => {
        setCharacterPosition(prev => {
          if (prev >= 50) {
            clearInterval(walkInterval);
            setTimeout(() => {
              setAnimationStage("stopped");
              setWalkFrame(0);
              
              // Show "It seems you're new here" with blur (wait for user click)
              setShowArrows(true);
            }, 300);
            return 50;
          }
          return prev + 0.8;
        });
      }, 30);

      return () => clearInterval(walkInterval);
    }
    
    // Walk off screen to the right
    if (animationStage === "walking-out") {
      const walkInterval = setInterval(() => {
        setCharacterPosition(prev => {
          if (prev >= 150) {
            clearInterval(walkInterval);
            return 150;
          }
          return prev + 1.2;
        });
      }, 30);

      return () => clearInterval(walkInterval);
    }
  }, [animationStage]);

  // Draw pixelated character on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 27;
    const outfit = outfitVariations[currentOutfitIndex];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Determine animation
    const isWalking = animationStage === "walking-in" || animationStage === "walking-out";
    const legOffset = isWalking && (walkFrame === 1 || walkFrame === 3) ? 1 : 0;

    // Skin color
    ctx.fillStyle = '#FFDBAC';

    // Head
    ctx.fillRect(7 * scale, 2 * scale, 2 * scale, 2 * scale);

    // Hair (dark brown)
    ctx.fillStyle = '#4A3728';
    ctx.fillRect(7 * scale, 2 * scale, 2 * scale, 1 * scale);

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(7 * scale, 3 * scale, 0.5 * scale, 0.5 * scale);
    ctx.fillRect(8.5 * scale, 3 * scale, 0.5 * scale, 0.5 * scale);

    // Shirt
    ctx.fillStyle = outfit.shirtColor;
    ctx.fillRect(6 * scale, 4 * scale, 4 * scale, 3 * scale);

    // Arms
    ctx.fillRect(5 * scale, 4 * scale, 1 * scale, 2 * scale);
    ctx.fillRect(10 * scale, 4 * scale, 1 * scale, 2 * scale);

    // Hands
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(5 * scale, 6 * scale, 1 * scale, 1 * scale);
    ctx.fillRect(10 * scale, 6 * scale, 1 * scale, 1 * scale);

    // Pants
    ctx.fillStyle = outfit.pantsColor;
    ctx.fillRect(6 * scale, 7 * scale, 4 * scale, 3 * scale);

    // Legs with walking animation
    if (legOffset === 0) {
      // Both legs together
      ctx.fillRect(6.5 * scale, 10 * scale, 1.5 * scale, 2 * scale);
      ctx.fillRect(8 * scale, 10 * scale, 1.5 * scale, 2 * scale);
    } else {
      // Legs apart (walking)
      ctx.fillRect(6.5 * scale, 10 * scale, 1.5 * scale, 2 * scale);
      ctx.fillRect(8 * scale, 10.5 * scale, 1.5 * scale, 1.5 * scale);
    }

    // Shoes (black)
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(6.5 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    if (legOffset === 0) {
      ctx.fillRect(8 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    } else {
      ctx.fillRect(8 * scale, 11.5 * scale, 1.5 * scale, 0.5 * scale);
    }

  }, [walkFrame, animationStage, currentOutfitIndex, isZooming]);

  const handlePreviousOutfit = () => {
    setCurrentOutfitIndex(prev => (prev - 1 + outfitVariations.length) % outfitVariations.length);
    setHasChangedOutfit(true);
    
    // Make character pop up when changing outfit
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300);
    setArrowBounce('left');
    setTimeout(() => setArrowBounce(null), 300);
  };

  const handleNextOutfit = () => {
    setCurrentOutfitIndex(prev => (prev + 1) % outfitVariations.length);
    setHasChangedOutfit(true);
    
    // Make character pop up when changing outfit
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 300);
    setArrowBounce('right');
    setTimeout(() => setArrowBounce(null), 300);
  };

  const handleConfirmAvatar = () => {
    setIsConfirmed(true);
    setShowArrows(false);
    
    // Save character data to context
    setCharacterData({
      skinColor: '#FFDBAC',
      hairColor: '#4A3728',
      eyeColor: '#000000',
      outfit: outfitVariations[currentOutfitIndex]
    });
    
    setAnimationStage("celebrating");
    
    // Jump animation - but keep character in place
    setIsZooming(true);
    setTimeout(() => {
      setIsZooming(false);
    }, 600);

    // Wait 1 second after celebration, then shrink and walk off
    setTimeout(() => {
      setCharacterScale(0.5);
      setAnimationStage("walking-out");
      setWalkFrame(0);
    }, 1600); // 600ms celebration + 1000ms wait

    // After walking out, show complete
    setTimeout(() => {
      setAnimationStage("complete");
    }, 4500); // Extra time for smaller character to walk off
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Grid */}
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

      {/* Character - Stays in center, no movement */}
      {showCharacter && animationStage !== "complete" && (
        <>
          {/* Character Container with zoom effect */}
          <div 
            className="fixed top-1/2 z-50"
            style={{ 
              left: animationStage === "walking-out" ? `${characterPosition}vw` : '50%',
              transform: `translate(-50%, -50%) scale(${animationStage === "walking-out" ? characterScale : (isZooming ? 1.1 : 1)})`,
              transition: animationStage === "walking-out" ? 'transform 100ms, left 0ms' : 'transform 150ms',
              marginTop: '30px'
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Character Canvas */}
              <div className="relative">
                {/* Glow effect */}
                {animationStage === "celebrating" && (
                  <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-50 animate-pulse scale-150"></div>
                )}
                
                <canvas
                  ref={canvasRef}
                  width={432}
                  height={432}
                  className="relative"
                />

                {/* Celebration sparkles */}
                {animationStage === "celebrating" && (
                  <>
                    <div className="absolute -top-12 left-1/4 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/4 -right-12 w-6 h-6 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="absolute bottom-1/4 -left-12 w-6 h-6 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                    <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  </>
                )}
              </div>

              {/* Shadow */}
              <div className="w-64 h-8 mt-4 bg-black/30 rounded-full blur-md"></div>
            </div>
          </div>

          {/* Arrows Container - Separate from character, positioned at center, won't jump */}
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            style={{ 
              width: '900px',
              height: '432px'
            }}
          >
            {/* Left Arrow - Fixed position, won't zoom with character */}
            {showArrows && !isConfirmed && (
              <div 
                className={`absolute top-1/2 -translate-y-1/2 animate-in zoom-in duration-500 transition-transform pointer-events-auto ${ 
                  arrowBounce === 'left' ? 'scale-90' : 'scale-100'
                }`}
                style={{ 
                  transitionDuration: '150ms',
                  left: '0px'
                }}
              >
                <button
                  onClick={handlePreviousOutfit}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-slate-800/80 border-2 border-cyan-400/50 hover:border-cyan-400 rounded-lg p-4 transition-all">
                    <ChevronLeft className="w-12 h-12 text-cyan-400" />
                  </div>
                </button>
              </div>
            )}

            {/* Right Arrow - Fixed position, won't zoom with character */}
            {showArrows && !isConfirmed && (
              <div 
                className={`absolute top-1/2 -translate-y-1/2 animate-in zoom-in duration-500 transition-transform pointer-events-auto ${
                  arrowBounce === 'right' ? 'scale-90' : 'scale-100'
                }`}
                style={{ 
                  transitionDuration: '150ms',
                  right: '0px'
                }}
              >
                <button
                  onClick={handleNextOutfit}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative bg-slate-800/80 border-2 border-cyan-400/50 hover:border-cyan-400 rounded-lg p-4 transition-all">
                    <ChevronRight className="w-12 h-12 text-cyan-400" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirm Button - Positioned below character */}
      {hasChangedOutfit && showArrows && !isConfirmed && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 animate-in zoom-in duration-500"
          style={{ top: 'calc(50% + 270px)' }}
        >
          <button
            onClick={handleConfirmAvatar}
            className="relative group"
          >
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all hover:scale-110 active:scale-95">
              <span className="flex items-center justify-center gap-2 text-base">
                <Check className="w-5 h-5" />
                Confirm Avatar
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Back to Login Button */}
      {animationStage === "complete" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-in zoom-in duration-500">
          <div 
            className="relative bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90 backdrop-blur-sm border-2 overflow-hidden"
            style={{
              clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
              borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 80px rgba(59, 130, 246, 0.2)'
            }}
          >
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

            <div className="relative p-12 text-center">
              <div className="mb-8">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-50 animate-pulse"></div>
                  <Check className="relative w-20 h-20 text-green-400" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Avatar Created Successfully!
                </h2>
                <p className="text-cyan-400 text-lg">
                  You're all set to begin your study journey
                </p>
              </div>

              <button
                onClick={handleBackToLogin}
                className="relative group"
              >
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                  <span className="flex items-center justify-center gap-2">
                    Back to Login
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Popup */}
      {showWelcomePopup && (
        <div 
          className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-500 ${
            isPopupFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handlePopupClick}
        >
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          
          {/* Popup Message with fade-in animation */}
          <div className="relative z-50 animate-in fade-in duration-700">
            <div className="text-center px-8">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">
                It looks like it's your first time here!
              </h1>
              <p className="text-2xl text-cyan-400 animate-pulse">
                Click anywhere to continue
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sign-Up Form */}
      {showSignUpForm && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          
          {/* Sign-Up Form with pop-up animation */}
          <div className="relative z-50 animate-in zoom-in duration-700" style={{ animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div 
              className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95 backdrop-blur-sm border-2 p-12 overflow-hidden"
              style={{
                clipPath: 'polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                borderImage: 'linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1',
                boxShadow: '0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 80px rgba(59, 130, 246, 0.2)',
                width: '500px'
              }}
            >
              {/* Corner Decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

              {/* Circuit Lines */}
              <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>

              <div className="relative">
                <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                  CREATE ACCOUNT
                </h2>
                
                <form onSubmit={handleSignUpSubmit}>
                  <div className="mb-6">
                    <label className="block text-cyan-400 text-sm font-bold mb-3" htmlFor="username">
                      USERNAME
                    </label>
                    <input
                      className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-cyan-400 text-sm font-bold mb-3" htmlFor="password">
                      PASSWORD
                    </label>
                    <input
                      className="w-full bg-slate-800/50 border-2 border-cyan-500/50 rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all"
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      className="relative group"
                      type="submit"
                    >
                      <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-12 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all hover:scale-105 active:scale-95">
                        CREATE ACCOUNT
                      </div>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Greeting Popup */}
      {showGreetingPopup && (
        <div 
          className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-500 ${
            isGreetingFadingOut ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleGreetingClick}
        >
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          
          {/* Popup Message with pop-up animation */}
          <div className="relative z-50 animate-in zoom-in duration-700" style={{ animationTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div className="text-center px-8">
              <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]">
                Hi {username}!
              </h1>
              <p className="text-3xl text-cyan-400 mb-6 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                Time to create your avatar
              </p>
              <p className="text-xl text-cyan-400 animate-pulse">
                Click anywhere to continue
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}