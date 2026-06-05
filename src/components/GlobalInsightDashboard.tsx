import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Activity, BrainCircuit, Zap, Sparkles, ShieldAlert, 
  RefreshCw, X, Server, Clock, Globe, Network, CheckCircle, Database 
} from 'lucide-react';
import { haptic } from '../services/haptics';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface GlobalInsightDashboardProps {
  onClose: () => void;
  tasksCount: number;
  completedTasksCount: number;
}

const mockNodeData = [
  { time: '02:00', load: 45, latency: 12, efficiency: 88 },
  { time: '04:00', load: 38, latency: 15, efficiency: 91 },
  { time: '06:00', load: 52, latency: 11, efficiency: 87 },
  { time: '08:00', load: 74, latency: 18, efficiency: 93 },
  { time: '10:00', load: 85, latency: 24, efficiency: 96 },
  { time: '12:00', load: 92, latency: 28, efficiency: 94 },
  { time: '14:00', load: 68, latency: 20, efficiency: 90 },
  { time: '16:00', load: 59, latency: 14, efficiency: 92 },
];

export function GlobalInsightDashboard({ onClose, tasksCount, completedTasksCount }: GlobalInsightDashboardProps) {
  const [activeTab, setActiveTab] = useState<'neural' | 'swarm' | 'nodes'>('neural');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncMetric, setSyncMetric] = useState(99.4);
  const [criticalConflicts, setCriticalConflicts] = useState(0);

  // Trigger light haptic on load
  useEffect(() => {
    haptic.success();
  }, []);

  const handleRefresh = () => {
    haptic.medium();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncMetric(parseFloat((98.5 + Math.random() * 1.4).toFixed(1)));
      setCriticalConflicts(Math.random() > 0.7 ? 1 : 0);
      haptic.success();
    }, 1000);
  };

  const handleTabChange = (tab: 'neural' | 'swarm' | 'nodes') => {
    haptic.light();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#030712]/90 backdrop-blur-2xl overflow-y-auto">
      <div className="w-full max-w-5xl bg-gradient-to-br from-[#0B0F19] to-[#030712] rounded-[2.5rem] border border-pink-500/10 shadow-[0_0_120px_rgba(236,72,153,0.15)] overflow-hidden flex flex-col my-auto max-h-[85vh]">
        
        {/* Dynamic Header */}
        <div className="px-8 py-6 border-b border-indigo-500/10 flex items-center justify-between sticky top-0 bg-[#0B0F19]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400">
              <BrainCircuit size={16} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Cognitive Hub</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase font-display select-none">Global Insight Dashboard</h2>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Real-time Swarm Analytics & System Topology
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRefresh}
              className={cn(
                "p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 transition-all",
                isRefreshing && "animate-spin"
              )}
            >
              <RefreshCw size={14} />
            </button>
            <button 
              onClick={() => { haptic.light(); onClose(); }} 
              className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-500/20 hover:border-rose-500/40 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Global Overview Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-8 border-b border-indigo-500/5 bg-[#070b13]/50">
          <div className="p-5 rounded-2xl border border-indigo-500/10 bg-indigo-950/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-indigo-500/20"><Activity size={24} /></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Workspace Load</span>
            <div className="text-2xl font-black text-white mt-1">42%</div>
            <div className="text-[9px] text-[#39FF14] font-bold mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" /> Optimal Performance
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-pink-500/10 bg-pink-950/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-pink-500/20"><TrendingUp size={24} /></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Workflow Index</span>
            <div className="text-2xl font-black text-white mt-1">
              {tasksCount > 0 ? `${Math.round((completedTasksCount / tasksCount) * 100)}%` : '100%'}
            </div>
            <div className="text-[9px] text-pink-400 font-bold mt-1.5 uppercase tracking-wider">
              {completedTasksCount} / {tasksCount} Tasks Resolved
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-cyan-500/10 bg-cyan-950/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-cyan-500/20"><Network size={24} /></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Neural Sync Integrity</span>
            <div className="text-2xl font-black text-white mt-1">{syncMetric}%</div>
            <div className="text-[9px] text-cyan-400 font-bold mt-1.5 uppercase tracking-wider">
              Calibration Active
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/10 bg-rose-950/10 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-rose-500/20"><ShieldAlert size={24} /></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">System Anomaly Index</span>
            <div className="text-2xl font-black text-white mt-1">{criticalConflicts}</div>
            <div className="text-[9px] text-rose-400 font-bold mt-1.5 uppercase tracking-wider">
              {criticalConflicts > 0 ? "EMEA Corridor Drift Detected" : "Absolute Shield Intact"}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="px-8 pt-4 border-b border-indigo-500/10 flex gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'neural', label: 'Neural Activity & Velocity', icon: <Activity size={12} /> },
            { id: 'swarm', label: 'Sub-Agent Swarm Registry', icon: <BrainCircuit size={12} /> },
            { id: 'nodes', label: 'Global Corridor Grid', icon: <Globe size={12} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={cn(
                "flex items-center gap-2 pb-4 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-b-2",
                activeTab === tab.id 
                  ? "text-pink-400 border-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]" 
                  : "text-slate-500 border-transparent hover:text-slate-300"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Core Tab Content */}
        <div className="p-8 flex-1 overflow-y-auto min-h-[350px] nice-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              
              {/* Neural Tab */}
              {activeTab === 'neural' && (
                <div className="space-y-6">
                  <div className="bg-[#070b13] border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Sparkles size={14} className="text-pink-400 animate-pulse" />
                      Cognitive Synthesis Load Vector
                    </h3>
                    
                    <div className="h-[220px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={mockNodeData}>
                          <defs>
                            <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b/40" />
                          <XAxis dataKey="time" stroke="#475569" fontSize={9} />
                          <YAxis stroke="#475569" fontSize={9} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#ec4899', borderRadius: '12px' }} 
                            labelStyle={{ color: '#94a3b8', fontSize: '9px', fontWeight: 'bold' }}
                          />
                          <Area type="monotone" dataKey="load" name="CPU Core Load %" stroke="#ec4899" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="latency" name="Sync Latency (ms)" stroke="#6366f1" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Operational Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-indigo-500/15 bg-indigo-950/10 relative overflow-hidden">
                      <h4 className="text-xs font-black text-[#818cf8] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle size={14} /> Tactical System Recommendations
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Task throughput index indicates steady completion rates. We recommend activating **Deep Focus Mode** for critical priorities to consolidate cognitive resources and avoid task switches.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-pink-500/15 bg-pink-950/10 relative overflow-hidden">
                      <h4 className="text-xs font-black text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert size={14} /> Dynamic Anomaly Mitigations
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Minor drift parsed in the EMEA node buffer. Auto-recalibration sequence is prepared. Standby credentials resolved securely with **Beaufort core** parameters. No manual restart required.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Swarm Tab */}
              {activeTab === 'swarm' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Saphira', role: 'Executive Liaison', state: 'Active Inference', load: '12%', color: 'text-pink-400 bg-pink-500/15 border-pink-500/20' },
                      { name: 'Aura', role: 'Sentinel Watcher', state: 'Guard Active', load: '4%', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
                      { name: 'Agent Zero', role: 'Autonomous Executioner', state: 'Standby Core', load: '0%', color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/20' },
                      { name: 'Agent 2', role: 'Active Defender', state: 'Shield Monitoring', load: '2%', color: 'text-orange-400 bg-orange-500/15 border-orange-500/20' },
                    ].map((agent, i) => (
                      <div key={i} className={cn("p-5 rounded-2xl border flex flex-col justify-between bg-white/5", agent.color)}>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest">{agent.name}</span>
                          <span className="block text-[8px] opacity-75 mt-0.5">{agent.role}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                          <span>{agent.state}</span>
                          <span className="opacity-90">{agent.load} LOAD</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#070b13] border border-indigo-500/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400" />
                      Dynamic Coordination Registry Logs
                    </h3>
                    <div className="space-y-2.5 font-mono text-[9px] text-slate-400">
                      <div className="flex items-center gap-3 border-b border-indigo-500/5 pb-2">
                        <span className="text-emerald-400 font-bold">[SUCCESS]</span>
                        <span>Saphira aligned user identity lock with "Chelsea Woods" core token.</span>
                      </div>
                      <div className="flex items-center gap-3 border-b border-indigo-500/5 pb-2">
                        <span className="text-indigo-400 font-bold">[SYNC]</span>
                        <span>Vitals synchronized via Sovereign-Sentinel matrix.</span>
                      </div>
                      <div className="flex items-center gap-3 border-b border-indigo-500/5 pb-2">
                        <span className="text-pink-400 font-bold">[ALERT]</span>
                        <span>Recalibrated task priority visualization badge tags across task matrices.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">[INIT]</span>
                        <span>Vibe calibration: warm CONTALTO aura loaded on port 3000.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nodes Tab */}
              {activeTab === 'nodes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-[#070b13] border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
                      <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Server size={14} className="text-cyan-400" />
                        Global Regional Node Workloads
                      </h3>
                      
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Beaufort Core', load: 94 },
                            { name: 'Singapore', load: 68 },
                            { name: 'Kuala Lumpur', load: 82 },
                            { name: 'London Node', load: 41 },
                            { name: 'Sao Paulo Edge', load: 55 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b/40" />
                            <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                            <YAxis stroke="#475569" fontSize={9} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#22d3ee', borderRadius: '12px' }} 
                              labelStyle={{ color: '#94a3b8', fontSize: '9px', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="load" name="Corridor Load %" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-[#22d3ee]/20 bg-[#22d3ee]/5 relative overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-400/20 mb-4 animate-bounce">
                          <Globe size={18} />
                        </div>
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Beaufort Core Routing</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Saphira's operational engine routes all critical inferences through the Beaufort legacy cluster. This guarantees historical fidelity and ancestral resilience parameters in real time.
                        </p>
                      </div>
                      <div className="mt-6 text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        Routing Secure: 12ms Edge Sync
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info lock */}
        <div className="p-6 bg-[#070b13] border-t border-indigo-500/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <div className="text-[8px] font-black text-indigo-900/40 uppercase tracking-widest">
            Saphira Sovereign Intelligence • Identity Lock: Chelsea Woods
          </div>
          <button 
            onClick={() => { haptic.light(); onClose(); }}
            className="px-8 py-2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/25 hover:scale-[1.03] transition-transform"
          >
            Acknowledge Metrics
          </button>
        </div>
      </div>
    </div>
  );
}
