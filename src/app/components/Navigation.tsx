import { Bell, MessageCircle, Home, LogIn, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { CharacterAvatar } from "./CharacterAvatar";
import { useState } from "react";

interface NavigationProps {
  isLoggedIn: boolean;
  onLogout?: () => void;
}

export function Navigation({ isLoggedIn, onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications] = useState(3); // Mock notification count
  const [unreadMessages] = useState(2); // Mock message count

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/portal');
  };

  // Determine if we should show the back button (not on login or portal pages)
  const showBackButton = isLoggedIn && location.pathname !== '/portal' && location.pathname !== '/login' && location.pathname !== '/';

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-cyan-400/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Logo/Title with Character + Notifications & Messages */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <CharacterAvatar size={48} />
            )}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50"></div>
                <h1 className="relative text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wider">
                  STUDY LEVELING
                </h1>
              </div>
            </button>

            {/* Notifications & Messages Buttons */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 ml-4">
                {/* Notifications Button */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2.5 rounded-lg border border-cyan-400/30 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800/80 transition-all group"
                >
                  <Bell className="w-5 h-5 text-cyan-400" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{unreadNotifications}</span>
                    </div>
                  )}
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/20 blur-md transition-all rounded-lg"></div>
                </button>

                {/* Messages Button */}
                <button
                  onClick={() => navigate('/social')}
                  className="relative p-2.5 rounded-lg border border-cyan-400/30 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800/80 transition-all group"
                >
                  <MessageCircle className="w-5 h-5 text-cyan-400" />
                  {unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{unreadMessages}</span>
                    </div>
                  )}
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/20 blur-md transition-all rounded-lg"></div>
                </button>
              </div>
            )}
          </div>

          {/* Right Section - Navigation Buttons + Back Button */}
          <div className="flex items-center gap-3">
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all bg-slate-800/50 border-cyan-400/40 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-semibold">Back</span>
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => navigate('/portal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  location.pathname === '/portal'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-400'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-semibold">Home</span>
              </button>
            )}

            {location.pathname !== '/login' && (
              <button
                onClick={isLoggedIn ? handleLogout : () => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all bg-slate-800/50 border-slate-700 text-slate-300 hover:border-cyan-400/50 hover:text-cyan-400"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-semibold">{isLoggedIn ? 'Logout' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}