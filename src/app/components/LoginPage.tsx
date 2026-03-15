import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { LogIn, User, Lock, UserPlus } from "lucide-react";
import { CharacterAvatar } from "./CharacterAvatar";
import characterImg from "figma:asset/97014d479e747af3339d4cee1583bc5a04df0e98.png";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [isReturning, setIsReturning] = useState(false);

  // Check if user exists in localStorage
  const isReturningUser = (username: string) => {
    return localStorage.getItem(`user_${username}`) !== null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      const returning = isReturningUser(username);
      setIsReturning(returning);
      
      // Show welcome popup for ALL users (both new and returning)
      setShowWelcomeBack(true);
      
      // If new user, store in localStorage
      if (!returning) {
        localStorage.setItem(`user_${username}`, JSON.stringify({ name: username }));
      }
      
      // Wait 3 seconds then navigate to portal
      setTimeout(() => {
        setShowWelcomeBack(false);
        onLogin();
        navigate('/portal');
      }, 3000);
    }
  };

  const handleSignUp = () => {
    navigate('/character-creator');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">
      {/* Welcome Back Popup */}
      {showWelcomeBack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred Background */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"></div>
          
          {/* Popup Card */}
          <div className="relative z-10 animate-in zoom-in duration-500">
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
                <div className="mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 animate-pulse"></div>
                    <h2 className="relative text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 tracking-wider">
                      WELCOME BACK!
                    </h2>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-2xl font-semibold text-white">{username}</p>
                </div>

                {/* Character Avatar */}
                <div className="flex justify-center mb-6">
                  <CharacterAvatar size={128} />
                </div>

                <p className="text-cyan-400 text-sm tracking-wider">
                  Loading your portal...
                </p>

                {/* Loading bar */}
                <div className="mt-4 w-64 mx-auto h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-md w-full">
        {/* Outer glow */}
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl"></div>

        {/* Main Login Box */}
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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block relative mb-2">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <LogIn className="relative w-16 h-16 text-cyan-400 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                STUDENT LOGIN
              </h2>
              <p className="text-cyan-400/70 text-sm tracking-wider uppercase">
                The Elevated Study Experience
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-cyan-400/50" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/50 border border-cyan-400/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-cyan-400/50" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800/50 border border-cyan-400/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    ENTER PORTAL
                  </span>
                </div>
              </button>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={handleSignUp}
                className="w-full relative group"
              >
                <div className="relative bg-slate-800/50 border-2 border-cyan-400/30 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg transition-all">
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    New user? Click to sign up
                  </span>
                </div>
              </button>

              {/* Decorative elements */}
              <div className="flex items-center gap-4 text-cyan-400/30 text-xs font-mono mt-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cyan-400/30"></div>
                <span>LEVEL UP YOUR STUDIES</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cyan-400/30"></div>
              </div>
            </form>
          </div>

          {/* Scanline effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}