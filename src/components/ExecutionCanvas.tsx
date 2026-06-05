import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ShieldAlert, Activity, Cpu, ShieldCheck } from 'lucide-react';

type ExecutionState = 'idle' | 'running' | 'success' | 'circuit_tripped' | 'throttled';

export function ExecutionCanvas() {
  const [executionState, setExecutionState] = useState<ExecutionState>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [loopCount, setLoopCount] = useState(0);

  const simulateExecution = () => {
    setExecutionState('running');
    setLogs(['[+] Launching Pipeline for Task: Autonomous Patch']);
    setLoopCount(0);
    
    let currentLoop = 0;
    const interval = setInterval(() => {
      currentLoop++;
      setLoopCount(currentLoop);
      if (currentLoop < 5) {
        setLogs(prev => [...prev, `[!] Iteration Fault #${currentLoop}. Trace: Logic flaw detected.`, `[*] Recursive Loop: Patch applied. Re-entering sandbox...`]);
      } else {
        clearInterval(interval);
        setExecutionState('circuit_tripped');
        setLogs(prev => [...prev, `[-] HALT: Circuit broken. Reason: Recursive loop exceeded maximum threshold of 5 attempts.`]);
      }
    }, 1500);
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-950 overflow-hidden rounded-xl border border-white/10 p-6 flex flex-col font-mono">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 z-10">
        <div className="flex items-center space-x-3">
          <Cpu className="text-white/70 w-5 h-5" />
          <h2 className="text-white font-medium tracking-widest text-sm uppercase">Saphira Visual Canvas</h2>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-white/40">MEMORY ENGINE:</span>
          <span className="text-emerald-400">ONLINE</span>
        </div>
      </div>

      {/* Main Glassmorphism Panel */}
      <div className={cn(
        "flex-1 relative z-10 rounded-lg border backdrop-blur-xl transition-colors duration-500 overflow-hidden flex flex-col",
        executionState === 'circuit_tripped' ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.15)]' : 
        executionState === 'running' ? 'bg-white/5 border-blue-500/30' : 'bg-white/[0.02] border-white/10'
      )}>

        {/* Status HUD Header */}
        <div className="h-14 border-b border-white/10 flex items-center px-4 justify-between bg-black/20">
          <div className="flex items-center space-x-3">
             {executionState === 'circuit_tripped' ? (
                <ShieldAlert className="text-pink-500 w-5 h-5 animate-pulse" />
             ) : executionState === 'running' ? (
                <Activity className="text-blue-400 w-5 h-5 animate-pulse" />
             ) : (
                <ShieldCheck className="text-white/50 w-5 h-5" />
             )}
             <span className={cn(
               "text-xs font-semibold tracking-wider",
               executionState === 'circuit_tripped' ? 'text-pink-500' : 'text-white/70'
             )}>
                {executionState === 'circuit_tripped' ? 'NEON_PINK_ALERT_PANEL' : 'SYSTEM_IDLE'}
             </span>
          </div>

          <div className="flex space-x-1">
             {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={cn(
                  "w-8 h-1.5 rounded-full transition-colors duration-300",
                  i <= loopCount ? (executionState === 'circuit_tripped' ? 'bg-pink-500' : 'bg-blue-400') : 'bg-white/10'
                )} />
             ))}
          </div>
        </div>

        {/* Logs Terminal */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
           <AnimatePresence>
             {logs.map((log, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "text-xs",
                    log.includes('[-]') || log.includes('HALT') ? 'text-pink-400' :
                    log.includes('[!]') ? 'text-yellow-400' : 
                    log.includes('[+]') ? 'text-emerald-400' : 'text-white/60'
                  )}
                >
                  {log}
                </motion.div>
             ))}
           </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
           <button 
             onClick={simulateExecution}
             disabled={executionState === 'running'}
             className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-xs tracking-widest font-medium rounded transition-all"
           >
             {executionState === 'running' ? 'EXECUTING AUTONOMOUS PATCH...' : 'INITIALIZE SANDBOX EXECUTION'}
           </button>
        </div>
      </div>
    </div>
  );
}
