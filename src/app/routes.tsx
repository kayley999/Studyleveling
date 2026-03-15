import { createBrowserRouter, Navigate } from "react-router";
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
import { Navigation } from "./components/Navigation";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: React.ReactNode;
}

function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

interface LayoutProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

function Layout({ isLoggedIn, onLogin, onLogout, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation isLoggedIn={isLoggedIn} onLogout={onLogout} />
      {children}
    </div>
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
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <StudentProfile />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/settings",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <SettingsPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/portal",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <PortalPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/taskboard",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <TaskboardPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/leaderboard",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <LeaderboardPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/character",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <CharacterCustomizationPage />
          </ProtectedRoute>
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
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <SocialPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/assessments",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AssessmentsPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "/notifications",
      element: (
        <Layout isLoggedIn={isLoggedIn} onLogin={onLogin} onLogout={onLogout}>
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <NotificationsPage />
          </ProtectedRoute>
        </Layout>
      ),
    },
    {
      path: "*",
      element: <Navigate to={isLoggedIn ? "/portal" : "/login"} replace />,
    },
  ]);