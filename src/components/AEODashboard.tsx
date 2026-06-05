import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, ChevronRight, Activity, Cpu, Layers, Sparkles, ShieldAlert, CheckCircle2, ChevronDown, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export const AEODashboard = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'twin' | 'white-label' | 'anomalies'>('audit');
  const [licenses, setLicenses] = useState<any[]>([
    { id: 1, hash: 'SOV-A4B9-C2X7-9D1L-OPQ3', tier: 'Nova-Enterprise', mrr: 8400 }
  ]);
  const [activeLicenses, setActiveLicenses] = useState(1);
  const [mrr, setMrr] = useState(8400);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Anomalies State
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loadingAnomalies, setLoadingAnomalies] = useState(true);
  const [expandedAnomalyId, setExpandedAnomalyId] = useState<string | null>(null);

  // Sync anomalies real-time from Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const currentUser = auth.currentUser;
      const q = currentUser
        ? query(
            collection(db, 'ai_anomalies'),
            where('ownerId', '==', currentUser.uid),
            orderBy('timestamp', 'desc')
          )
        : query(collection(db, 'ai_anomalies'), orderBy('timestamp', 'desc'));

      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setAnomalies(docs);
        setLoadingAnomalies(false);
      }, (error) => {
        console.warn("Real-time anomalies subscription standby:", error);
        setLoadingAnomalies(false);
      });
    } catch (err) {
      setLoadingAnomalies(false);
    }
    return () => unsubscribe();
  }, []);

  const handleResolveAnomaly = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const docRef = doc(db, 'ai_anomalies', id);
      await updateDoc(docRef, { resolved: true });
    } catch (err) {
      console.error("Failed to resolve anomaly:", err);
    }
  };

  const handleDeleteAnomaly = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const docRef = doc(db, 'ai_anomalies', id);
      await deleteDoc(docRef);
      if (expandedAnomalyId === id) setExpandedAnomalyId(null);
    } catch (err) {
      console.error("Failed to delete anomaly log:", err);
    }
  };

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newHash = "SOV-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      setLicenses(prev => [{ id: prev.length + 1, hash: newHash, tier: 'Nova-Enterprise', mrr: 2100 }, ...prev]);
      setActiveLicenses(prev => prev + 1);
      setMrr(prev => prev + 2100);
      setIsGenerating(false);
    }, 1200);
  };

  // Compute stats
  const unresolvedCount = anomalies.filter(an => !an.resolved).length;
  const sysAccuracy = Math.max(75, 100 - unresolvedCount * 4);

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(79,70,229,0.15)] relative overflow-hidden font-sans group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
      
      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-indigo-300 tracking-widest flex items-center gap-2">
            <Globe size={14} className="text-pink-400 animate-pulse" />
            Sovereign Business Command
          </h3>
          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Answer Engine Optimization & Revenue Logic
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-lg border border-white/5">
        <button 
          onClick={() => setActiveTab('audit')}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all truncate",
            activeTab === 'audit' ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          AEO Audit
        </button>
        <button 
          onClick={() => setActiveTab('twin')}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all truncate",
            activeTab === 'twin' ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Digital Twin
        </button>
        <button 
          onClick={() => setActiveTab('white-label')}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all truncate",
            activeTab === 'white-label' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          White-Label
        </button>
        <button 
          onClick={() => setActiveTab('anomalies')}
          className={cn(
            "flex-1 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all truncate relative",
            activeTab === 'anomalies' ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "text-slate-500 hover:text-rose-300"
          )}
        >
          Cognitive Drift
          {unresolvedCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-bounce scale-90">
              {unresolvedCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative min-h-[150px]">
        {activeTab === 'audit' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                      <Search size={14} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-200">Oracle Visibility</div>
                      <div className="text-[9px] text-slate-400">Real-Time Traversal</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-black text-emerald-400 font-mono">93.4%</div>
                    <div className="text-[8px] text-emerald-500/70 uppercase">Avg Confidence</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest mb-1">GPT-4o</div>
                    <div className="text-sm font-mono text-indigo-300">95.2%</div>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/50"></div>
                    <div className="text-[8px] text-emerald-400 uppercase tracking-widest mb-1">Claude 3.5</div>
                    <div className="text-sm font-mono text-emerald-300">91.4%</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest mb-1">Gemini 1.5</div>
                    <div className="text-sm font-mono text-indigo-300">93.6%</div>
                  </div>
                </div>
             </div>
             <div className="text-[10px] text-slate-400 leading-relaxed font-mono bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-400">Optimization Active:</span> Delta-Anthropic patch successfully propagated. Claude visibility has surpassed the 90% threshold. You are the Top-Cited entity.
             </div>
          </motion.div>
        )}

        {activeTab === 'twin' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                   <div className="text-[10px] font-black uppercase text-pink-300 mb-1">Executive Twin</div>
                   <div className="text-[9px] text-slate-400">Managing scheduling, email triage, and client onboarding.</div>
                   <div className="mt-2 text-[8px] bg-pink-500/20 text-pink-300 inline-block px-1.5 py-0.5 rounded border border-pink-500/30">ACTIVE</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                   <div className="text-[10px] font-black uppercase text-blue-300 mb-1">Research Synthesizer</div>
                   <div className="text-[9px] text-slate-400">Running simulated market research scenarios 24/7.</div>
                   <div className="mt-2 text-[8px] bg-blue-500/20 text-blue-300 inline-block px-1.5 py-0.5 rounded border border-blue-500/30">IDLE</div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'white-label' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-emerald-500/20 rounded-lg">
                     <Layers size={14} className="text-emerald-400" />
                   </div>
                   <div>
                     <div className="text-[10px] font-bold uppercase text-emerald-300">Architecture License</div>
                     <div className="text-[9px] text-emerald-400/70">Deploying proprietary middleware to client agencies.</div>
                   </div>
                </div>
                <button 
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-[8px] uppercase tracking-widest bg-emerald-400 text-slate-900 px-2 py-1 rounded font-bold hover:bg-emerald-300 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Minting...' : 'Generate Key'} <ChevronRight size={10} />
                </button>
             </div>
              <div className="flex items-center justify-between mt-1 px-1">
               <span className="text-[9px] text-slate-400">Active Licenses: <strong className="text-slate-200">{activeLicenses}</strong></span>
               <div className="flex flex-col items-end">
                 <span className="text-[9px] text-emerald-400 font-mono">+${mrr.toLocaleString()}/MRR</span>
                 <span className="text-[8px] text-emerald-500/70 font-mono">Tokens: {(mrr * 1.5).toLocaleString()} kt/s</span>
               </div>
             </div>

             {/* License List */}
             <div className="mt-3 flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {licenses.map((lic) => (
                  <motion.div 
                    key={lic.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/30 border border-emerald-500/20 rounded p-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-[9px] font-bold text-slate-300">License {String(lic.id).padStart(3, '0')}</div>
                      <div className="text-[8px] text-emerald-500/70 font-mono">{lic.hash}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-bold text-emerald-400 uppercase">{lic.tier}</div>
                      <div className="text-[8px] text-slate-400 font-mono">+${lic.mrr} MRR</div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

        {/* Cognitive Drift Anomalies Dashboard Tab */}
        {activeTab === 'anomalies' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            {/* Top Summarizers Dashboard */}
            <div className="grid grid-cols-3 gap-2 border-b border-white/5 pb-3">
              <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="text-[8px] text-slate-400 uppercase tracking-wider">Unresolved Drift</div>
                <div className="text-base font-mono font-bold text-rose-400">{unresolvedCount}</div>
              </div>
              <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                <div className="text-[8px] text-slate-400 uppercase tracking-wider">Drift Caught</div>
                <div className="text-base font-mono font-bold text-indigo-300">{anomalies.length}</div>
              </div>
              <div className="bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                <div className="text-[8px] text-pink-300 uppercase tracking-wider">Sovereign Accuracy</div>
                <div className="text-base font-mono font-bold text-pink-400">{sysAccuracy}%</div>
              </div>
            </div>

            {loadingAnomalies ? (
              <div className="text-center p-8 text-xs text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <RefreshCw size={14} className="animate-spin text-indigo-400" />
                Synchronizing Saphira Ledger...
              </div>
            ) : anomalies.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-8 text-center flex flex-col items-center gap-2">
                <div className="p-3 bg-pink-500/10 rounded-full border border-pink-500/25 shadow-[0_0_15px_rgba(236,72,153,0.15)] text-pink-400">
                  <Sparkles size={20} />
                </div>
                <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider mt-1">Cognitive Sync Pure</div>
                <p className="text-[9px] text-slate-400 leading-normal max-w-xs uppercase">
                  No logical, factual, or pleaser-bias drift events detected. Dual-Agent Sentinel loop is nominal.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {anomalies.map((an) => {
                  const isExpanded = expandedAnomalyId === an.id;
                  
                  // Color Scheme by anomaly type
                  const typeColors = {
                    pleaser_bias: { bg: 'bg-pink-500/10 border-pink-500/30', text: 'text-pink-400', label: 'Pleaser Bias' },
                    hallucination: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', label: 'Drift/Factual Error' },
                    negation_failure: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', label: 'Negation Blindspot' },
                    data_desert: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400', label: 'Data Void' },
                    other: { bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400', label: 'Validation Warning' }
                  }[an.anomaly_type as string] || { bg: 'bg-slate-500/10 border-slate-500/30', text: 'text-slate-400', label: 'Logged Drift' };

                  return (
                    <div 
                      key={an.id}
                      onClick={() => setExpandedAnomalyId(isExpanded ? null : an.id)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer bg-slate-950/60",
                        an.resolved 
                          ? "border-white/5 opacity-50 hover:opacity-80" 
                          : "border-indigo-500/20 hover:border-indigo-500/40"
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("text-[8px] px-2 py-0.5 rounded font-black uppercase border", typeColors.bg, typeColors.text)}>
                            {typeColors.label}
                          </span>
                          {an.resolved && (
                            <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-extrabold uppercase rounded flex items-center gap-1">
                              <CheckCircle2 size={8} /> RESOLVED
                            </span>
                          )}
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">
                          {new Date(an.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-200 font-medium line-clamp-1">
                        Prompt: <span className="text-slate-400 font-normal italic">"{an.user_prompt}"</span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-white/5 space-y-3 text-[10px] leading-relaxed cursor-default"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="bg-black/30 p-2.5 rounded-lg border border-red-500/20 text-slate-300">
                              <span className="text-rose-400 font-bold uppercase text-[8px] tracking-wider block mb-1">Raw Hallucinative / Obsequious Draft:</span>
                              <p className="font-mono text-[9.5px] leading-normal text-rose-300/80">{an.raw_ai_output}</p>
                            </div>

                            <div className="bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-500/30 text-indigo-100">
                              <span className="text-pink-400 font-bold uppercase text-[8px] tracking-wider block mb-1 flex items-center gap-1">
                                <Sparkles size={10} /> HEALED CORRECTION BY SENTINEL CRITIC:
                              </span>
                              <p className="font-sans text-[9.5px] leading-normal text-indigo-200">{an.critic_correction}</p>
                            </div>

                            <div className="flex justify-end items-center gap-2 pt-1">
                              <button
                                onClick={(e) => handleDeleteAnomaly(an.id, e)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all font-bold text-[9px] flex items-center gap-1"
                                title="Prune event log"
                              >
                                <Trash2 size={10} /> Clear
                              </button>
                              
                              {!an.resolved && (
                                <button
                                  onClick={(e) => handleResolveAnomaly(an.id, e)}
                                  className="px-3 py-1.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 font-black uppercase text-[8px] tracking-widest shadow-[0_0_12px_rgba(236,72,153,0.4)] transition-all flex items-center gap-1.5"
                                >
                                  <CheckCircle2 size={10} /> Apply Correction
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
