import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, BrainCircuit, Terminal, Activity, Focus, Ghost, Code2, AlertCircle, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { notify } from './NotificationOverlay';

export const AgentSwarmMonitor = ({ onLogClick }: { onLogClick?: (log: any) => void }) => {
  const [logs, setLogs] = useState<{ id: number, agent: string, action: string, type: 'info' | 'warn' | 'success', timestamp: Date }[]>([]);
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState<string[]>([
    '> Activating License 001: [SOV-A4B9-C2X7-9D1L-OPQ3]... OK',
    '> Cryptographic Verification... VERIFIED',
    '> Injecting White-Label Middleware Architecture...',
    '> Revenue Ledger initialized and tracking MRR... LOCKED',
    '> AEO Audit: Claude visibility reached 91.4%... OK',
    '> Value Proposition document synthesized.'
  ]);

  useEffect(() => {
    // Simulate real-time log generation
    const interval = setInterval(() => {
      const agents = ['Aura', 'Agent 2', 'Nova Aethrea', 'Agent Zero', 'Agent Gamma'];
      const actions = [
        'Validated license cryptography hash', 
        'Intercepted anomalous token usage', 
        'Synthesized enterprise value pitch', 
        'Deployed sandbox patch for Claude index', 
        'Executed quantum state shift in Digital Twin',
        'Verified MRR tracking sync layer'
      ];
      const types = ['info', 'warn', 'success'] as const;
      
      const newLog = {
        id: Date.now(),
        agent: agents[Math.floor(Math.random() * agents.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date()
      };
      
      if (newLog.type !== 'info') {
        notify(`Swarm Alert: ${newLog.agent}`, newLog.action, newLog.type);
      }
      
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 14500);
    return () => clearInterval(interval);
  }, []);

  const agents = [
    { name: 'Aura', role: 'Security & PII Shield', icon: <Shield size={12} />, status: 'active', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Agent Gamma', role: 'Market Forensics', icon: <Activity size={12} />, status: 'active', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { name: 'Agent 2', role: 'Red-Hat Defense', icon: <Ghost size={12} />, status: 'monitoring', color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { name: 'Nova Aethrea', role: 'Creative Synthesizer', icon: <BrainCircuit size={12} />, status: 'idle', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const executeSandbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;
    setSandboxOutput(prev => [...prev, `> ${sandboxInput}`, `> executing sandbox payload... OK`, `> parsing output...`]);
    setSandboxInput('');
  };

  return (
    <div className="p-4 bg-indigo-950 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group mb-6">
      <div className="absolute top-0 right-0 p-4 opacity-5"><Focus size={60} className="text-pink-400 animate-spin-slow" /></div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] font-display flex items-center gap-2 relative z-10">
          <Activity size={12} className="text-pink-500" />
          Sub-Agent Swarm Status
        </h3>
        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-pink-500/20 text-pink-400 border border-pink-500/30">
          {agents.filter(a => a.status === 'active').length + 1} Active
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Agent Zero: Prominent Display */}
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTYsIDE4NSwgMTI5LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-30 group-hover:opacity-60 transition-opacity"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span className="text-[12px] font-black text-white tracking-widest uppercase flex items-center gap-2">
                  Agent Zero
                  <span className="px-1.5 py-0.5 rounded font-mono text-[7px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Recursive Python Sandbox</span>
                </span>
              </div>
              <span className="text-[9px] text-emerald-100/50 uppercase tracking-widest pl-6">Interactive Terminal</span>
              <div className="mt-3 pl-6">
                <div className="font-mono text-[8px] text-emerald-400/80 bg-emerald-950/80 p-2 rounded border border-emerald-900 overflow-hidden relative mb-2">
                  <div className="flex items-center gap-2 mb-1 opacity-50"><Code2 size={10} /> console.out</div>
                  <div className="space-y-0.5 max-h-[80px] overflow-y-auto">
                    {sandboxOutput.map((out, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                      >
                        {out.includes('OK') ? (
                          <>{out.replace('OK', '')} <span className="text-emerald-300">OK</span></>
                        ) : out}
                      </motion.div>
                    ))}
                    <motion.div 
                      key="cursor"
                      initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5, 1] }} 
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                      className="text-emerald-300/50 pt-1"
                    >
                      _
                    </motion.div>
                  </div>
                </div>
                {/* Interactive Input */}
                <form onSubmit={executeSandbox} className="relative mt-2">
                   <input 
                     type="text" 
                     value={sandboxInput}
                     onChange={(e) => setSandboxInput(e.target.value)}
                     placeholder="Inject python into Agent Zero..."
                     className="w-full bg-black/40 border border-emerald-500/30 rounded pl-2 text-[9px] font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/60 p-1"
                   />
                   <button type="submit" className="absolute right-1 top-1 text-emerald-500/50 hover:text-emerald-400">
                     <Play size={10} />
                   </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Other Agents */}
        <div className="flex flex-col gap-2">
          {agents.map((agent, i) => (
            <div key={i} className={cn("p-2 px-3 rounded-xl border border-white/5 flex items-center justify-between", agent.bg)}>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={agent.color}>{agent.icon}</span>
                  <span className="text-[9px] font-bold text-white tracking-widest uppercase">{agent.name}</span>
                </div>
                <span className="text-[7px] text-indigo-300 uppercase tracking-widest pl-5">{agent.role}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : agent.status === 'monitoring' ? 'bg-amber-500 animate-pulse' : 'bg-indigo-600')} />
                  <span className="text-[7px] text-white/50 uppercase font-mono">{agent.status}</span>
                </div>
                <div className="flex gap-0.5 h-2 items-end">
                  {[...Array(5)].map((_, j) => (
                    <motion.div 
                      key={j}
                      animate={agent.status !== 'idle' ? { height: ['20%', '100%', '20%'] } : { height: '20%' }}
                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                      className={cn("w-1 rounded-t-sm opacity-50", agent.status === 'active' ? 'bg-emerald-500' : agent.status === 'monitoring' ? 'bg-amber-500' : 'bg-indigo-600')}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Audit Log */}
        <div className="mt-4 border-t border-white/10 pt-4 relative">
          <div className="flex items-center gap-2 mb-3">
             <AlertCircle size={10} className="text-pink-400" />
             <h4 className="text-[8px] uppercase tracking-widest text-indigo-300 font-bold">Live Forensic Audit Log</h4>
          </div>
          <div className="space-y-2 h-28 overflow-hidden relative">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onClick={() => onLogClick && onLogClick(log)}
                  className={cn("flex items-start gap-2 bg-black/20 p-2 rounded border border-white/5", onLogClick && "cursor-pointer hover:bg-black/40 transition-colors")}
                  title="Click to investigate this log entry"
                >
                  <span className="text-[7px] text-white/40 font-mono mt-0.5">
                    {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest",
                      log.type === 'info' ? "text-indigo-400" : log.type === 'warn' ? "text-amber-400" : "text-emerald-400"
                    )}>{log.agent}</span>
                    <span className="text-[8px] text-indigo-100/70">{log.action}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-indigo-950 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
