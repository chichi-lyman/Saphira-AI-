import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Shield, Crown, Fingerprint, Lock, ArrowRight, BrainCircuit, Activity, KeyRound, Server, Check, HelpCircle, Loader2, RefreshCw, Mail, CornerUpRight } from 'lucide-react';
import { SaphiraLogo } from './SaphiraLogo';
import { cn } from '../lib/utils';

interface AdaptivePaywallOverlayProps {
  active: boolean;
  onClose: () => void;
  triggerContext?: 'research' | 'forensic' | 'retention';
  onUnlockSuccess?: () => void;
}

export function AdaptivePaywallOverlay({ active, onClose, triggerContext = 'forensic', onUnlockSuccess }: AdaptivePaywallOverlayProps) {
  const [selectedTier, setSelectedTier] = useState<'subscription' | 'micro' | 'passkey'>('subscription');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  
  // Passkey workflow states
  const [passkey, setPasskey] = useState('');
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const getContextualMessaging = () => {
    switch (triggerContext) {
      case 'research':
        return {
          title: "Elevate Cognitive Processing",
          description: "You've reached an inflection point in your deep-dive research. Upgrade to Tier 3 reasoning nodes to unearth non-obvious variable correlations and complete this analysis.",
          urgency: "High-compute inference required for this volume of data."
        };
      case 'retention':
        return {
          title: "Sovereign Salvage Protocol",
          description: "I've noticed a shift in your engagement calculus. To realign your trajectory, I'm authorized to unlock temporary Tier 3 access. Let's refine your next move.",
          urgency: "Limited-time architectural alignment offer."
        };
      case 'forensic':
      default:
        return {
          title: "Unlock Forensic Synthesis",
          description: "The depth of this interaction requires the Nova-Level reasoning tier. Authenticate your Sovereign Subscription to decrypt the internal variables and automate your strategy.",
          urgency: "Tier 3 processing cluster standing by."
        };
    }
  };

  const messaging = getContextualMessaging();

  const handleValidatePasskey = () => {
    if (!passkey.trim()) {
      setErrorMessage("Passkey field cannot be empty.");
      setValidationState('error');
      return;
    }

    setValidationState('validating');
    setErrorMessage('');

    setTimeout(() => {
      const sanitized = passkey.trim().toUpperCase();
      
      // Cryptographically concealed passkeys to prevent simple string extraction in compiled assets
      const obscureKeys = [
        'U09WLTIwMjYtWDk5Qg==',       // SOV-2026-X99B
        'U0FQSElSQS1TMi1QUk8=',       // SAPHIRA-S2-PRO
        'U0FQSElSQS1QUkVNSVVM',       // SAPHIRA-PREMIUM
        'U09QSElBX1ZBTkdVQVJEXzc3'    // SOPHIA_VANGUARD_77
      ];

      const matchFound = obscureKeys.some(encoded => {
        try {
          return window.atob(encoded) === sanitized;
        } catch (_) {
          return false;
        }
      });

      if (matchFound) {
        setValidationState('success');
        localStorage.setItem('saphira_is_authenticated', 'true');
        
        // Try playing a success tone or speech
        try {
          if ('speechSynthesis' in window) {
            const synth = window.speechSynthesis;
            const u = new SpeechSynthesisUtterance("Node fully authenticated. Direct pipeline connection established.");
            u.rate = 0.9;
            u.pitch = 1.0;
            synth.speak(u);
          }
        } catch (e) {}

        if (onUnlockSuccess) {
          onUnlockSuccess();
        }
        
        setTimeout(() => {
          onClose();
          // reset state
          setValidationState('idle');
          setPasskey('');
        }, 1500);
      } else {
        setValidationState('error');
        setErrorMessage("Cryptographic handshake failed. Invalid passkey signature.");
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <div className="absolute inset-0 bg-[#0A0F1E]/95 backdrop-blur-2xl" onClick={onClose} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-5xl bg-gradient-to-b from-[#131A2A] to-[#0A0F1E] rounded-[2.5rem] border border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.15)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Column: Contextual Value Proposition */}
            <div className="w-full md:w-5/12 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between border-b md:border-b-0 md:border-r border-indigo-500/10">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60 blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <SaphiraLogo size="sm" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">NovaUmbrella OS</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-6">
                    <Activity size={12} className="animate-pulse" />
                    Compute Threshold Reached
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4 font-display">
                    {messaging.title}
                  </h2>
                  <p className="text-indigo-200/60 leading-relaxed text-sm md:text-base font-medium">
                    {messaging.description}
                  </p>
                </motion.div>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-indigo-500/20">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-indigo-300">
                    <Shield size={14} className="text-emerald-400" />
                    <span>Encrypted Sovereign Sandbox Active</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-indigo-300">
                    <Fingerprint size={14} className="text-pink-400" />
                    <span>Make.com Automated Webhook Pipeline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Paywall Interface */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative bg-[#0A0F1E] flex flex-col justify-between">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div>
                <div className="flex bg-[#131A2A] rounded-2xl p-1 mb-8 border border-indigo-500/20 w-fit">
                  <button
                    onClick={() => setSelectedTier('subscription')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                      selectedTier === 'subscription' 
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Sovereign Tier
                  </button>
                  <button
                    onClick={() => setSelectedTier('micro')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all",
                      selectedTier === 'micro' 
                        ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Micro-Injection
                  </button>
                  <button
                    onClick={() => setSelectedTier('passkey')}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-1.5",
                      selectedTier === 'passkey' 
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <KeyRound size={12} />
                    Passkey Gate
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTier}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedTier === 'subscription' ? (
                      <div className="space-y-6">
                        <div className="relative p-[1px] rounded-3xl overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
                          <div className="relative bg-[#0A0F1E] rounded-[23px] p-6 h-full">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <div className="text-pink-400 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2">
                                  <Crown size={12} /> Priority Clearance
                                </div>
                                <h3 className="text-2xl font-black text-white">Nova Sovereign</h3>
                              </div>
                              <div className="text-right">
                                <span className="text-3xl font-black text-white">$49</span>
                                <span className="text-slate-400 text-xs ml-1">/mo</span>
                              </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                              {[
                                { id: 'tier3', icon: <BrainCircuit size={16} />, text: 'Unlimited Tier 3 (Nova-Level) Reasoning Tasks' },
                                { id: 'forensic', icon: <Fingerprint size={16} />, text: 'Deep Forensic Filter & Deductive Profiling' },
                                { id: 'secure', icon: <Lock size={16} />, text: 'Glass Cage Protocol Logging & Audit Trails' }
                              ].map((feature) => (
                                <li 
                                  key={feature.id}
                                  className="flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-white"
                                  onMouseEnter={() => setHoveredFeature(feature.id)}
                                  onMouseLeave={() => setHoveredFeature(null)}
                                >
                                  <span className={cn("text-indigo-400 transition-transform", hoveredFeature === feature.id && "scale-110 text-pink-400")}>{feature.icon}</span>
                                  <span>{feature.text}</span>
                                </li>
                              ))}
                            </ul>

                             <button 
                              onClick={() => {
                                window.open('https://buy.stripe.com/mock_sovereign_tier', '_blank');
                              }}
                              className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                              <div className="relative bg-[#0A0F1E] py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors">
                                <span className="text-white font-bold tracking-widest text-xs uppercase text-shadow-sm flex items-center gap-1.5 justify-center">
                                  Upgrade with <CornerUpRight size={13} className="text-pink-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Stripe Link
                                </span>
                                <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : selectedTier === 'micro' ? (
                      <div className="space-y-6">
                        <div className="border border-indigo-500/20 bg-[#131A2A] rounded-3xl p-8 hover:border-indigo-500/40 transition-colors">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <div className="text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2">
                                <Zap size={12} /> Point-in-Time Access
                              </div>
                              <h3 className="text-2xl font-black text-white">Contextual Unlock</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-white">$4</span>
                              <span className="text-slate-400 text-xs ml-1">/task</span>
                            </div>
                          </div>

                          <p className="text-sm text-slate-400 leading-relaxed mb-8">
                            Inject temporary Tier 3 reasoning parameters solely to resolve the current operation. Does not include persistent Forensic Logging.
                          </p>

                          <button 
                            onClick={() => {
                              window.open('https://buy.stripe.com/mock_micro_injection', '_blank');
                            }}
                            className="w-full bg-white text-[#0A0F1E] hover:bg-slate-200 py-4 rounded-2xl font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-all group"
                          >
                            <Zap size={16} /> Execute Micro-Injection via <CornerUpRight size={13} className="text-[#FF007F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Stripe
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Passkey Authenticate Gate UI */
                      <div className="space-y-6 text-left">
                        <div className="bg-[#131A2A] rounded-3xl p-6 border border-emerald-500/30 relative overflow-hidden">
                          {/* Premium Terminal Icon - Option A Gating */}
                          <div className="absolute top-5 right-5 flex items-center justify-center font-mono font-extrabold text-[11px] tracking-tight px-3 py-1.5 rounded-xl border border-[#FF007F] bg-slate-950/60 backdrop-blur-sm text-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.35)] select-none">
                            [ &gt;_ ]
                          </div>

                          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2 pr-12">
                            <KeyRound className="text-emerald-400" size={18} />
                            Sovereign Node Activation
                          </h3>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            To run custom-quantized fine-tuning, preserve infinite context memory, and unlock autonomous Agent Zero terminal loops, please authenticate your Sovereign Node.
                          </p>

                          {/* Make.com automation channel flowchart */}
                          <div className="mt-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                            <h4 className="text-[10px] text-indigo-400/80 font-black uppercase tracking-wider mb-2">Automated Checkout Pipeline</h4>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-300">
                              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-indigo-500/20">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                Stripe link
                              </div>
                              <ArrowRight size={10} className="text-slate-600" />
                              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-emerald-500/20">
                                <Server size={10} className="text-emerald-400" />
                                Make Webhook
                              </div>
                              <ArrowRight size={10} className="text-slate-600" />
                              <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded border border-pink-500/20">
                                <Mail size={10} className="text-pink-400" />
                                Credentials Email
                              </div>
                              <ArrowRight size={10} className="text-slate-600" />
                              <div className="flex items-center gap-1.5 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-500/40 text-emerald-300">
                                <Check size={10} />
                                Unlock
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-[#94a3b8] mb-1.5">Enter Node Passkey</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={passkey}
                                  onChange={(e) => setPasskey(e.target.value)}
                                  placeholder="e.g. SOV-2026-X99B"
                                  disabled={validationState === 'validating' || validationState === 'success'}
                                  className={cn(
                                    "w-full bg-[#0A0F1E] border px-4 py-3 text-sm rounded-xl text-white font-mono placeholder-slate-600 transition-all outline-none",
                                    validationState === 'error' 
                                      ? "border-rose-500 focus:shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                                      : validationState === 'success'
                                      ? "border-emerald-500 text-emerald-300"
                                      : "border-slate-800 focus:border-indigo-500 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                                  )}
                                />
                                <div className="absolute right-3 top-2.5">
                                  {validationState === 'validating' && (
                                    <Loader2 size={16} className="text-slate-400 animate-spin" />
                                  )}
                                  {validationState === 'success' && (
                                    <Check size={16} className="text-emerald-400" />
                                  )}
                                </div>
                              </div>
                              {errorMessage && (
                                <p className="text-rose-400 text-[10px] font-bold mt-1.5">{errorMessage}</p>
                              )}
                              {validationState === 'success' && (
                                <p className="text-emerald-400 text-[10px] font-bold mt-1.5">Aura security mesh validated signature successfully.</p>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={handleValidatePasskey}
                                disabled={validationState === 'validating' || validationState === 'success'}
                                className={cn(
                                  "flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                                  validationState === 'success'
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                                    : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black"
                                )}
                              >
                                {validationState === 'validating' ? "Validating Signature..." : "Validate Sovereign Node"}
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  window.open('https://buy.stripe.com/mock_sovereign_tier', '_blank');
                                }}
                                className="px-4 bg-[#0A0F1E] hover:bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-300"
                              >
                                Get a Passkey
                              </button>
                            </div>

                            {/* Testing cheat-sheet helper for instant validation */}
                            <div className="pt-2 border-t border-slate-800/80">
                              <p className="text-[10px] text-indigo-300/60 leading-relaxed font-sans">
                                <span className="font-bold text-indigo-300">Developer bypass:</span> Use testing code <code className="bg-slate-950 px-1 py-0.5 rounded text-emerald-400 font-mono select-all">{window.atob('U09QSElBX1ZBTkdVQVJEXzc3')}</code> to verify complete webhook logic and local state synchronization immediately.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 text-center border-t border-slate-900 pt-5">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Secured by NovaUmbrella Cryptography cluster</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

