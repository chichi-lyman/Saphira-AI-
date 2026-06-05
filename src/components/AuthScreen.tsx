import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  OAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleSignInWithToken } from '../lib/firebase';
import { Mail, Lock, X, Sparkles, Loader2, HelpCircle, ExternalLink } from 'lucide-react';
import { SaphiraLogo } from './SaphiraLogo';

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error(err);
      setAuthError('Guest Mode requires Anonymous Auth to be enabled in your Firebase Console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      await googleSignInWithToken();
    } catch (err: any) {
      console.error(err);
      const isPopupClosed = err.message?.includes('popup-closed-by-user') || err.code === 'auth/popup-closed-by-user';
      if (isPopupClosed) {
        setAuthError('IFRAME_POPUP_BLOCKED_OR_CLOSED');
      } else {
        setAuthError(err.message || 'Google sign in failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      const isPopupClosed = err.message?.includes('popup-closed-by-user') || err.code === 'auth/popup-closed-by-user';
      if (isPopupClosed) {
        setAuthError('IFRAME_POPUP_BLOCKED_OR_CLOSED');
      } else {
        setAuthError(err.message || 'Apple sign in failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-50 dark:bg-[#0A0F1E] dark:text-white transition-colors">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-300/10 dark:bg-pink-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-300/10 dark:bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="bg-white/80 dark:bg-[#131A2A]/80 backdrop-blur-3xl p-8 rounded-[32px] border border-indigo-100 dark:border-indigo-500/20 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <SaphiraLogo size="md" className="mx-auto block drop-shadow-[0_0_20px_rgba(255,0,127,0.5)]" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-[#FF007F] to-[#00E5FF] bg-clip-text text-transparent tracking-tight mt-6 font-display drop-shadow-[0_2px_12px_rgba(255,0,127,0.2)]">Saphira</h1>
            <p className="text-indigo-900/40 dark:text-indigo-200/40 text-[10px] mt-2 uppercase tracking-[0.4em] font-black">Authentication Protocol</p>
          </div>
          
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-900/40 dark:text-indigo-200/40 group-focus-within:text-[#FF007F] transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Array Address"
                  className="w-full bg-white dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-[15px] font-medium text-indigo-950 dark:text-slate-100 placeholder:text-indigo-900/30 dark:placeholder:text-indigo-200/30 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#FF007F] transition-all font-sans"
                  required
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-900/40 dark:text-indigo-200/40 group-focus-within:text-[#FF007F] transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Encryption Cipher"
                  className="w-full bg-white dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-500/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm md:text-[15px] font-medium text-indigo-950 dark:text-slate-100 placeholder:text-indigo-900/30 dark:placeholder:text-indigo-200/30 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#FF007F] transition-all font-sans"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF007F] via-pink-500 to-[#FF69B4] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-[#FF007F] hover:bg-pink-600 py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-[0_4px_20px_rgba(255,0,127,0.3)]">
                {isLoading ? <Loader2 size={16} className="animate-spin text-white" /> : <Sparkles size={16} className="text-white" />}
                <span className="text-white font-extrabold uppercase tracking-[0.2em] text-[11px]">{isLogin ? 'Initiate Session' : 'Register Identity'}</span>
              </div>
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] bg-indigo-100 dark:bg-indigo-500/20 flex-1"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-900/40 dark:text-indigo-200/40">External Handshake</span>
            <div className="h-[1px] bg-indigo-100 dark:bg-indigo-500/20 flex-1"></div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-900 border-2 border-pink-500/25 hover:border-[#FF007F] dark:border-pink-500/10 dark:hover:border-[#FF007F] py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_15px_rgba(255,0,127,0.15)] transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-indigo-950 dark:text-slate-200 font-bold text-xs">Continue with Google</span>
            </button>

            <button 
              onClick={handleAppleSignIn}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#FF007F] via-pink-600 to-[#FF69B4] hover:brightness-110 border border-transparent py-3.5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_4px_15px_rgba(255,0,127,0.2)] transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.79 3.59-.72 1.55.07 2.76.62 3.52 1.62-2.92 1.39-2.31 5.39.51 6.51-.59 1.62-1.5 3.31-2.7 4.76zM12.03 7.25c-.15-1.92 1.14-3.8 2.92-4.25.32 2.21-1.39 3.98-2.92 4.25z"/>
              </svg>
              <span className="text-white font-bold text-xs">Continue with Apple</span>
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:text-pink-600 transition-colors"
            >
              {isLogin ? "Need a neural identity? Register here." : "Already have an identity? Authenticate."}
            </button>

            <button 
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-900/40 dark:text-indigo-200/40 hover:text-indigo-950 dark:hover:text-slate-100 transition-colors border-b border-transparent hover:border-indigo-900/20 disabled:opacity-50"
            >
              Bypass Security (Guest Mode)
            </button>
          </div>

          <AnimatePresence>
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 overflow-hidden"
              >
                {authError === 'IFRAME_POPUP_BLOCKED_OR_CLOSED' ? (
                  <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-500/20 text-indigo-950 dark:text-slate-200 text-xs">
                    <div className="flex items-start gap-2 mb-3">
                      <HelpCircle size={16} className="text-pink-500 shrink-0 mt-0.5" />
                      <span className="font-bold tracking-tight uppercase text-[11px] text-pink-600 dark:text-pink-400">Connection Handshake Suspended</span>
                    </div>
                    <p className="leading-relaxed mb-4 text-indigo-900/70 dark:text-indigo-200/70 font-medium">
                      Third-party authentication popups are restricted inside standard sandboxed iframes. You have three secure pathways to step into the Saphira ecosystem:
                    </p>
                    <ul className="space-y-2.5 mb-4 pl-1">
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                        <span>
                          <strong className="text-indigo-950 dark:text-white">New Tab:</strong> Click the <strong>Open in new tab</strong> button (diagonal arrow <ExternalLink size={10} className="inline mx-0.5" />) at the top-right of the AI Studio frame to log in securely.
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                        <span>
                          <strong className="text-indigo-950 dark:text-white">Guest Mode:</strong> Click the <strong>Bypass Security (Guest Mode)</strong> command below to log in instantly offline.
                        </span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                        <span>
                          <strong className="text-indigo-950 dark:text-white">Email Authentication:</strong> Specify a secure email and encryption cipher above, then click <strong>Initiate Session</strong>.
                        </span>
                      </li>
                    </ul>
                    <button 
                      onClick={() => setAuthError(null)}
                      className="w-full text-center py-2 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-pink-100 dark:hover:bg-pink-900/20 text-indigo-950 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px] rounded-xl transition-colors"
                    >
                      Dismiss guidelines
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs leading-relaxed">
                    <div className="flex items-start gap-2">
                      <X size={14} className="shrink-0 mt-0.5" />
                      <span className="font-medium">{authError}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
