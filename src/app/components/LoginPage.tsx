import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, Mail, Lock, UserPlus, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import supabase from '../../supabaseClient';
import characterImg from "../../assets/characterPlaceholder";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setNeedsConfirmation(false);
    setResendDone(false);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (authError) {
      const msg = authError.message.toLowerCase();

      if (msg.includes("email not confirmed")) {
        setNeedsConfirmation(true);
        return;
      }

      if (msg.includes("invalid login credentials") || msg.includes("invalid")) {
        setError("Wrong email or password. Double-check your details and try again.");
        return;
      }

      setError(authError.message);
      return;
    }

    const displayName =
      data.user?.user_metadata?.name ||
      data.user?.email?.split("@")[0] ||
      "Hunter";

    setUserName(displayName);
    setShowWelcomeBack(true);

    setTimeout(() => {
      setShowWelcomeBack(false);
      navigate("/portal");
    }, 2500);
  };

  const handleResend = async () => {
    if (!email || resendLoading) return;
    setResendLoading(true);
    await supabase.auth.resend({ type: "signup", email: email.trim() });
    setResendLoading(false);
    setResendDone(true);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative">

      {/* Welcome Back overlay */}
      {showWelcomeBack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"></div>
          <div className="relative z-10 animate-in zoom-in duration-500">
            <div
              className="relative bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-900/90 backdrop-blur-sm border-2 overflow-hidden"
              style={{
                clipPath: "polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))",
                borderImage: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1",
                boxShadow: "0 0 60px rgba(59, 130, 246, 0.5), inset 0 0 80px rgba(59, 130, 246, 0.2)",
              }}
            >
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
                <p className="text-2xl font-semibold text-white mb-6">{userName}</p>
                <div className="relative w-32 h-32 mx-auto mb-8 rounded-full border-4 border-cyan-400/50 overflow-hidden bg-slate-900 shadow-[0_0_50px_rgba(34,211,238,0.4)]">
                  <div className="absolute inset-0 bg-cyan-500/20 blur-sm animate-pulse"></div>
                  <img src={characterImg} alt="Character" className="relative w-full h-full" style={{ imageRendering: "pixelated", objectFit: "contain" }} />
                </div>
                <p className="text-cyan-400 text-sm tracking-wider">Loading your portal...</p>
                <div className="mt-4 w-64 mx-auto h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" style={{ width: "100%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-md w-full">
        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl"></div>
        <div
          className="relative bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-blue-900/40 backdrop-blur-sm border-2 overflow-hidden"
          style={{
            clipPath: "polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))",
            borderImage: "linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb, #60a5fa) 1",
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.3), inset 0 0 60px rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Corner decorations */}
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

          <div className="absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute bottom-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>

          <div className="relative p-8">
            <div className="text-center mb-8">
              <div className="inline-block relative mb-2">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <LogIn className="relative w-16 h-16 text-cyan-400 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">STUDENT LOGIN</h2>
              <p className="text-cyan-400/70 text-sm tracking-wider uppercase">The Elevated Study Experience</p>
            </div>

            {/* Email not confirmed */}
            {needsConfirmation && (
              <div className="mb-5 p-4 bg-yellow-500/10 border border-yellow-400/40 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 font-semibold text-sm">Email not confirmed</p>
                    <p className="text-yellow-200/80 text-xs mt-1 leading-relaxed">
                      Check your inbox for a confirmation link from Supabase. Also check your spam folder.
                    </p>
                  </div>
                </div>

                {resendDone ? (
                  <div className="flex items-center gap-2 text-green-400 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    Confirmation email resent — check your inbox!
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading || !email}
                    className="flex items-center gap-2 text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 hover:border-yellow-400 px-3 py-1.5 rounded transition-all disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendLoading ? "animate-spin" : ""}`} />
                    {resendLoading ? "Sending..." : "Resend confirmation email"}
                  </button>
                )}

                <div className="pt-2 border-t border-yellow-400/20">
                  <p className="text-yellow-200/60 text-xs leading-relaxed">
                    💡 <strong className="text-yellow-300">Fastest fix for development:</strong> Open your{" "}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-yellow-200"
                    >
                      Supabase dashboard
                    </a>
                    {" → "}Authentication → Providers → Email, then <strong>disable "Confirm email"</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Wrong credentials */}
            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-cyan-400/50" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null); setNeedsConfirmation(false); }}
                    className="w-full bg-slate-800/50 border border-cyan-400/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-semibold">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-cyan-400/50" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    className="w-full bg-slate-800/50 border border-cyan-400/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg border-2 border-cyan-400 hover:border-cyan-300 transition-all">
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing in...
                      </>
                    ) : (
                      <><LogIn className="w-5 h-5" /> ENTER PORTAL</>
                    )}
                  </span>
                </div>
              </button>

              <button type="button" onClick={() => navigate("/character-creator")} className="w-full relative group">
                <div className="relative bg-slate-800/50 border-2 border-cyan-400/30 hover:border-cyan-400 text-cyan-400 font-semibold py-3 px-6 rounded-lg transition-all">
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    New user? Click to sign up
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-4 text-cyan-400/30 text-xs font-mono mt-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-cyan-400/30"></div>
                <span>LEVEL UP YOUR STUDIES</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-cyan-400/30"></div>
              </div>
            </form>
          </div>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)" }}
          ></div>
        </div>
      </div>
    </div>
  );
}