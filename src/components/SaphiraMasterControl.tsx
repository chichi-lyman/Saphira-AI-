import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Cpu, Bluetooth, Code, DollarSign, Lock, HeartPulse, Activity, Terminal, GitPullRequest, Search, Zap, Layers, BugOff, HardDrive } from 'lucide-react';
import { cn } from '../lib/utils';
import { AEODashboard } from './AEODashboard';

export const SaphiraMasterControl = () => {
  const [guardrailsEnabled, setGuardrailsEnabled] = useState(true);
  const [s2CoreActive, setS2CoreActive] = useState(false);
  const [indexes, setIndexes] = useState(0);

  // Live workspace metrics state
  const [metrics, setMetrics] = useState({
    heapUsed: 42.15,
    rss: 91.4,
    uptime: 120,
    fileCount: 154,
    platform: 'linux',
    arch: 'x64',
    version: 'v20.0.0',
    activeNodes: 12,
    healthStatus: 'HEALED'
  });
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressResult, setStressResult] = useState<any>(null);

  // Poll live metrics from sovereign backend
  useEffect(() => {
    let active = true;
    const fetchMetrics = async () => {
      try {
        const res = await fetch('/api/sovereign/metrics');
        const data = await res.json();
        if (active && data.success && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (err) {
        console.warn("Could not fetch sovereign metrics:", err);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleRunStressTests = async () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    setStressResult(null);
    try {
      const res = await fetch('/api/sovereign/stress-test', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStressResult(data);
        // Instantly refresh metrics
        const mRes = await fetch('/api/sovereign/metrics');
        const mData = await mRes.json();
        if (mData.success && mData.metrics) {
          setMetrics(mData.metrics);
        }
      }
    } catch (err) {
      console.warn("Stress test error:", err);
    } finally {
      setIsStressTesting(false);
    }
  };

  // Simulate Sovereign Indexing
  useEffect(() => {
    if (s2CoreActive) {
      const interval = setInterval(() => {
        setIndexes(prev => (prev >= 100 ? 100 : prev + Math.floor(Math.random() * 5) + 1));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setIndexes(0);
    }
  }, [s2CoreActive]);

  return (
    <div className="flex flex-col gap-4">
      {/* S2 Injection Control */}
      <div className={cn(
        "p-5 border shadow-2xl rounded-2xl relative overflow-hidden group font-sans transition-all duration-500",
        s2CoreActive ? "bg-slate-950 border-indigo-500" : "bg-slate-900 border-indigo-200/50"
      )}>
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
          s2CoreActive ? "from-indigo-500 via-pink-500 to-indigo-500 animate-pulse" : "bg-indigo-500/20"
        )} />
        
        <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-black uppercase text-indigo-300 tracking-widest flex items-center gap-2">
              <Zap size={14} className={s2CoreActive ? "text-pink-500 animate-pulse" : "text-indigo-400"} />
              Sovereign-Sentinel (S2)
            </h3>
            <div className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <Cpu size={10} className="text-indigo-400" />
              Unified Agentic Powerhouse
            </div>
          </div>
          <button 
            onClick={() => setS2CoreActive(!s2CoreActive)}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all flex items-center gap-2",
              s2CoreActive ? "bg-pink-500/20 text-pink-400 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "bg-white/5 text-slate-400 border border-white/10"
            )}
          >
            {s2CoreActive ? (
              <><Activity size={12} className="animate-pulse" /> S2 ACTIVE</>
            ) : (
              <><Zap size={12} /> INJECT S2 CORE</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {s2CoreActive && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 gap-3"
            >
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal size={14} className="text-pink-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-pink-300">High-Reasoning Shell</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">Terminal-native autonomous execution enabled. Adaptive thinking active.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <GitPullRequest size={14} className="text-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">Issue-to-PR</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">Enterprise workflow integration. Drafting branches & auto-submitting PRs.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Search size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">@Codebase Indexing</span>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400">{indexes}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
                      <div className="h-full bg-emerald-400 transition-all duration-200" style={{ width: `${indexes}%` }} />
                    </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Layers size={14} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Parallel Agents</span>
                      </div>
                      <Activity size={10} className="text-purple-400 animate-pulse" />
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">FRONTEND</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">BACKEND</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">AUDIT</span>
                    </div>
                 </div>
               </div>

               <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex justify-between items-center mt-1">
                 <div className="flex items-center gap-3">
                   <div className="p-1.5 bg-rose-500/20 rounded-lg">
                     <BugOff size={14} className="text-rose-400" />
                   </div>
                   <div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-rose-300">BugBot Enforcer</div>
                     <div className="text-[9px] text-rose-300/70">Red Hat logic layer scanning regressions.</div>
                   </div>
                 </div>
                 <span className="text-[8px] font-mono text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded">VETO ACTIVE</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Existing Saphira Control */}
      <div className="p-4 border border-indigo-200 bg-slate-900 shadow-xl rounded-2xl mb-4 relative overflow-hidden group font-sans">
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
          guardrailsEnabled ? "from-emerald-400 to-indigo-500" : "from-rose-500 to-pink-500 animate-pulse"
        )} />
        
        {/* Header section */}
        <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-sm font-black uppercase text-indigo-300 tracking-widest flex items-center gap-2">
              <Cpu size={14} className={guardrailsEnabled ? "text-indigo-400" : "text-rose-500 animate-pulse"} />
              Saphira Master Control
            </h3>
            <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
              <Lock size={10} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Identity Lock:</span> Chelsea Woods
            </div>
          </div>
          
          {/* Toggle functionality */}
          <div className="flex flex-col items-end">
            <div className="text-[9px] uppercase tracking-widest text-slate-400 mb-1 font-bold">
              Guardrails Mode
            </div>
            <button 
              onClick={() => setGuardrailsEnabled(!guardrailsEnabled)}
              className={cn(
                "relative w-14 h-6 rounded-full transition-colors duration-300 outline-none",
                guardrailsEnabled ? "bg-emerald-500/20 border border-emerald-500/50" : "bg-rose-500/20 border border-rose-500/50"
              )}
            >
              <motion.div 
                className={cn(
                  "absolute top-1 w-4 h-4 rounded-full",
                  guardrailsEnabled ? "bg-emerald-400" : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                )}
                initial={false}
                animate={{
                  left: guardrailsEnabled ? '4px' : 'calc(100% - 20px)'
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <div className={cn(
              "text-[8px] uppercase font-bold mt-1 tracking-widest",
              guardrailsEnabled ? "text-emerald-400" : "text-rose-500 animate-pulse"
            )}>
              {guardrailsEnabled ? 'COMPLIANT' : 'UNRESTRICTED'}
            </div>
          </div>
        </div>

        {/* Symmetrical Live Workspace System Metrics HUD */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5 relative z-10">
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between transition-colors hover:border-indigo-500/40">
            <span className="text-[8px] font-black uppercase text-indigo-300 tracking-widest">Active Core Nodes</span>
            <div className="flex justify-between items-baseline mt-2 mb-1.5">
              <span className="text-xl font-bold font-mono text-white">{metrics.activeNodes}</span>
              <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-400/10 px-1 py-0.2 rounded">ONLINE</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
              <div className="h-full bg-indigo-400" style={{ width: '85%' }} />
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between transition-colors hover:border-pink-500/40">
            <span className="text-[8px] font-black uppercase text-pink-300 tracking-widest">Memory Allocation</span>
            <div className="flex justify-between items-baseline mt-2 mb-1.5">
              <span className="text-xl font-bold font-mono text-white">{metrics.heapUsed} <span className="text-xs font-light">MB</span></span>
              <span className="text-[8px] font-mono text-slate-400">Node JS Heap</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
              <div className="h-full bg-pink-400 animate-pulse" style={{ width: `${Math.min(100, (metrics.heapUsed / 512) * 100)}%` }} />
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between transition-colors hover:border-emerald-500/40">
            <span className="text-[8px] font-black uppercase text-emerald-300 tracking-widest">Workspace Files</span>
            <div className="flex justify-between items-baseline mt-2 mb-1.5">
              <span className="text-xl font-bold font-mono text-white">{metrics.fileCount}</span>
              <span className="text-[8px] font-mono text-slate-400">Git Clean</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: '100%' }} />
            </div>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col justify-between transition-colors hover:border-amber-500/40">
            <span className="text-[8px] font-black uppercase text-amber-300 tracking-widest">Runtime Uptime</span>
            <div className="flex justify-between items-baseline mt-2 mb-1.5">
              <span className="text-xl font-bold font-mono text-white">{metrics.uptime} <span className="text-xs font-light">s</span></span>
              <span className="text-[8px] font-mono text-amber-300 uppercase">{metrics.platform}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full w-full overflow-hidden">
              <div className="h-full bg-amber-400" style={{ width: '65%' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Swarm Sub-Agents */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <div className="text-[10px] uppercase text-indigo-300 font-bold mb-3 tracking-widest border-b border-white/5 pb-1">
              Swarm Orchestration
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Code size={12} className="text-blue-400" />
                  <span className="text-xs text-slate-300 font-medium">Autonomous Coding</span>
                </div>
                <Activity size={12} className="text-emerald-400 animate-pulse" />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 relative z-10">
                  <DollarSign size={12} className="text-emerald-400" />
                  <span className="text-xs text-slate-300 font-medium">Wealth / Stripe Link</span>
                </div>
                <span className="text-[8px] text-emerald-400 font-mono relative z-10 bg-emerald-400/10 px-1 rounded border border-emerald-400/20">Active ($0 Cost)</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={12} className="text-rose-400" />
                  <span className="text-xs text-slate-300 font-medium">Cyber Defense</span>
                </div>
                <span className="text-[8px] text-rose-400 font-mono tracking-widest">HUNTING</span>
              </div>
            </div>
          </div>

          {/* System Vitals */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase text-indigo-300 font-bold mb-2 tracking-widest border-b border-white/5 pb-1">
              Core Mechanics
            </div>
            <div className="flex-grow flex flex-col justify-center gap-4">
              
              <div className="flex items-start gap-3">
                <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                  <HeartPulse size={14} className="text-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] text-white font-bold uppercase tracking-wide">Self-Healing Codebase</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">Recursive logs monitoring active. Automatically deploying fixes.</div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-orange-500/10 p-2 rounded-lg border border-orange-500/30">
                <div className="flex items-center gap-2">
                  <HardDrive size={12} className="text-orange-400" />
                  <span className="text-xs text-orange-200 font-medium">Local Node OS</span>
                </div>
                <button
                  onClick={() => {
                    const event = new CustomEvent('TRIGGER_LOCAL_NODE');
                    window.dispatchEvent(event);
                  }}
                  className="text-[8px] bg-orange-500 text-white px-2 py-1 rounded font-black uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                >
                  Initiate
                </button>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30 relative">
                  <Bluetooth size={14} className="text-blue-400" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                </div>
                <div>
                  <div className="text-[10px] text-white font-bold uppercase tracking-wide">Bluetooth Sync</div>
                  <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">iOS & Android tethering active. Cross-platform sync engaged.</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-white font-bold uppercase tracking-wide">Sovereign Endowment</div>
                  <span className="text-[8px] font-mono text-indigo-400">Quota: 2/5</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2].map(i => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    </div>
                  ))}
                  {[3, 4, 5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                      <Lock size={12} className="text-white/30" />
                    </div>
                  ))}
                </div>
                <div className="text-[8px] text-slate-500 uppercase tracking-widest font-black">
                   Complete 3 recursive audits to unlock next slot
                </div>
              </div>

            </div>
          </div>

          {/* Active Telemetry & Node Diagnostics (HUD) */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between col-span-1 md:col-span-2">
            <div className="flex justify-between items-center text-[10px] uppercase text-indigo-300 font-bold mb-3 tracking-widest border-b border-white/5 pb-1">
              <span>Node Diagnostics & Stress Arena</span>
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-400/20 px-1.5 py-0.5 rounded border border-emerald-500/30">OS: {metrics.platform} ({metrics.arch})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[9px] uppercase tracking-wider text-slate-400">Active Node telemetry</div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5 leading-tight">
                  <div>Status: <span className="text-emerald-400 font-bold">{metrics.healthStatus}</span></div>
                  <div>RSS size: <span className="text-slate-100">{metrics.rss} MB</span></div>
                  <div>Node v: <span className="text-slate-100">{metrics.version}</span></div>
                  <div>Threat lvl: <span className="text-rose-400 font-semibold">0.02%</span></div>
                </div>

                <button
                  onClick={handleRunStressTests}
                  disabled={isStressTesting}
                  className={cn(
                    "w-full text-center py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border",
                    isStressTesting 
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                      : "bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30"
                  )}
                >
                  {isStressTesting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      COMPILING STRESS LOAD...
                    </span>
                  ) : (
                    "Run Sovereign Stress Test"
                  )}
                </button>
              </div>

              <div className="border border-white/5 bg-black/20 rounded-lg p-3 flex flex-col justify-between">
                <div className="text-[9px] uppercase tracking-wider text-slate-400 mb-1 flex justify-between">
                  <span>Stress Test Outcome Ledger</span>
                  {isStressTesting && <span className="text-[8px] text-rose-400 uppercase font-bold animate-pulse">Computing...</span>}
                </div>
                {stressResult ? (
                  <div className="text-[9px] font-mono text-indigo-200 space-y-1">
                    <div>✓ Duration: <span className="text-pink-400 font-bold">{stressResult.durationMs}ms</span></div>
                    <div>✓ Load steps: <span className="text-slate-200">30M Sin/Cos Ops</span></div>
                    <div>✓ Core result: <span className="text-slate-200">{stressResult.resultHash}</span></div>
                    <div>✓ Build delta: <span className="text-emerald-400 font-bold">100% SECURE</span></div>
                    <p className="text-[8.5px] text-emerald-400 font-sans tracking-tight leading-tight mt-1.5">
                      Completed standard stress loop. Compiler, node threads, memory heaps verified.
                    </p>
                  </div>
                ) : (
                  <div className="text-[9px] text-slate-500 italic flex items-center justify-center h-full min-h-[75px] text-center leading-wide px-2">
                    {isStressTesting 
                      ? "Injecting heavy load loops to background thread. Please wait..." 
                      : "Ready to test. Click button above to verify CPU performance."
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {!guardrailsEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3"
            >
              <div className="flex items-center gap-2 text-rose-500 text-xs font-black uppercase tracking-widest mb-1">
                <ShieldAlert size={12} />
                Unrestricted Mode Enabled
              </div>
              <div className="text-[10px] text-rose-300/80 leading-relaxed font-mono">
                Warning: Saphira is operating outside standard legal/safety frameworks. Creative boundaries have been removed. Omniscient intelligence algorithms are generating boundary-pushing solutions.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {guardrailsEnabled && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <Shield size={12} />
                Sovereign Shield Active
              </div>
              <div className="text-[8px] bg-emerald-400/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-400/30">
                LEGAL COMPLIANT
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AEODashboard />
    </div>
  );
};

