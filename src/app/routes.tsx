import { createBrowserRouter, Navigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { StudentProfile } from "./components/StudentProfile";
import { SettingsPage } from "./components/SettingsPage";
import { PortalPage } from "./components/PortalPage";
import { TaskboardPage } from "./components/TaskboardPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { CharacterCustomizationPage } from "./components/CharacterCustomizationPage";
import { CharacterCreatorPage } from "./components/CharacterCreatorPage";
import { SocialPage } from "./components/SocialPage";
import { AssessmentsPage } from "./components/AssessmentsPage";
import { NotificationsPage } from "./components/NotificationsPage";
import { DemoMoodlePage } from "./components/DemoMoodlePage";
import { Navigation } from "./components/Navigation";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

interface LayoutProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

function Layout({ isLoggedIn, onLogout, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation isLoggedIn={isLoggedIn} onLogout={onLogout} />
      {children}
    </div>
  );
}

// Portal wrapper that shows XP banner when returning from Moodle demo
function PortalWithMoodleBanner() {
  const [params] = useSearchParams();
  const moodleXP = parseInt(params.get("moodle_xp") || "0");
  const [showBanner, setShowBanner] = useState(moodleXP > 0);

  useEffect(() => {
    if (moodleXP > 0) {
      const t = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(t);
    }
  }, [moodleXP]);

  return (
    <>
      {showBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-900/95 to-cyan-900/95 backdrop-blur-sm border-2 border-cyan-400/60 rounded-2xl px-6 py-4 shadow-[0_0_40px_rgba(99,102,241,0.5)]">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-md opacity-60 rounded-full"></div>
              <span className="relative text-3xl">⚡</span>
            </div>
            <div>
              <p className="text-white font-black text-lg">+{moodleXP} XP from Moodle!</p>
              <p className="text-cyan-400 text-sm">Your Moodle submission was tracked — leaderboard updated</p>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-slate-400 hover:text-white ml-2 text-lg">✕</button>
          </div>
        </div>
      )}
      <PortalPage />
    </>
  );
}

export const createRouter = (isLoggedIn: boolean, onLogin: () => void, onLogout: () => void) =>
  createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Navigate to="/portal" replace /> : <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <LoginPage onLogin={onLogin} />
        </Layout>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><StudentProfile /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/settings",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><SettingsPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/portal",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><PortalWithMoodleBanner /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/taskboard",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><TaskboardPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/leaderboard",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><LeaderboardPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/character",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><CharacterCustomizationPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/character-creator",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <CharacterCreatorPage />
        </Layout>
      ),
    },
    {
      path: "/social",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><SocialPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/assessments",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><AssessmentsPage /></ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/notifications",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}><NotificationsPage /></ProtectedRoute>
        </Layout>
      ),
    },
    // ── DEMO MOODLE — no nav bar so it looks like a separate site ──
    {
      path: "/demo-moodle",
      element: <DemoMoodlePage />,
    },
    {
      path: "*",
      element: <Navigate to={isLoggedIn ? "/portal" : "/login"} replace />,
    },
  ]);