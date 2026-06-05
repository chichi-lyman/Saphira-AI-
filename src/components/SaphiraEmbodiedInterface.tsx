import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  Settings, 
  Maximize2, 
  Sparkles, 
  Plus, 
  ArrowUp, 
  Terminal, 
  Volume2, 
  BookOpen, 
  Heart, 
  Cpu, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Trash2, 
  Paperclip, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  HelpCircle,
  ExternalLink,
  FileText,
  DollarSign,
  Menu,
  X,
  PlusCircle,
  Clock,
  Code
} from 'lucide-react';
import { useWakeWord } from '../hooks/useWakeWord';
import { cn } from '../lib/utils';
import { SaphiraCrystal } from './SaphiraCrystal';
import Markdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface SaphiraEmbodiedInterfaceProps {
  onOpenDashboard: () => void;
  messages: Message[];
  isAnalyzing: boolean;
  isSpeaking: boolean;
  onSendMessage: (text: string) => void;
  onVoiceInputToggle: () => void;
  isListeningMic: boolean;
}

interface ConsoleLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'CEO' | 'CFO' | 'SOVEREIGNAUTH' | 'WORKER' | 'AUDITOR' | 'ERROR';
  message: string;
}

export const SaphiraEmbodiedInterface: React.FC<SaphiraEmbodiedInterfaceProps> = ({
  onOpenDashboard,
  messages,
  isAnalyzing,
  isSpeaking,
  onSendMessage,
  onVoiceInputToggle,
  isListeningMic
}) => {
  const [input, setInput] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [crystalState, setCrystalState] = useState<'idle' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  
  // Mobile / Desktop Viewport management
  const [isConsoleDocked, setIsConsoleDocked] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'console'>('chat'); // For mobile stacked navigation

  // Sovereign State tracker (Sovereign OS specification)
  const [systemBalance, setSystemBalance] = useState(1000.00);
  const [dailySpend, setDailySpend] = useState(0.00);
  const [trustScore, setTrustScore] = useState(50);
  
  // Custom states and settings
  const [lowLatency, setLowLatency] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isFormsModalOpen, setIsFormsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isAttachementsOpen, setIsAttachmentsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  
  // Console Logging System
  const [logs, setLogs] = useState<ConsoleLog[]>([
    { id: '1', timestamp: '20:34:32.001', type: 'INFO', message: 'Sovereign OS Governance Engine initialized.' },
    { id: '2', timestamp: '20:34:32.102', type: 'INFO', message: 'Connected to Firestore db: ai-studio-ed48a384-83ac-4963-920a-c04bf6082f47' },
    { id: '3', timestamp: '20:34:32.304', type: 'INFO', message: 'Zero-latency microservice mapped to 0.0.0.0 Express production backend.' },
    { id: '4', timestamp: '20:34:32.505', type: 'INFO', message: 'SovereignAuth capability matrix loaded. Trust Score starts at 50.' },
    { id: '5', timestamp: '20:34:34.900', type: 'INFO', message: 'Standing by for tactical directives.' }
  ]);

  const addLog = (type: ConsoleLog['type'], message: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, fractionDigits: 3 } as any);
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: time,
      type,
      message
    }]);
  };

  const { isListening: wakeWordActive, startListening, stopListening, hasPermission } = useWakeWord(() => {
    setCrystalState('listening');
    onVoiceInputToggle();
  });

  const [ambientEnabled, setAmbientEnabled] = useState(true);

  useEffect(() => {
    if (ambientEnabled && !isListeningMic && hasPermission !== false && !wakeWordActive) {
      startListening();
    } else if (!ambientEnabled || isListeningMic) {
      stopListening();
    }
  }, [ambientEnabled, isListeningMic, hasPermission, wakeWordActive, startListening, stopListening]);

  // Synchronize 3D crystal animation state
  useEffect(() => {
    if (isAnalyzing) {
      setCrystalState('thinking');
    } else if (isSpeaking) {
      setCrystalState('speaking');
      const audioInterval = setInterval(() => {
        setAudioLevel(0.3 + Math.random() * 0.7);
      }, 100);
      return () => {
        clearInterval(audioInterval);
        setAudioLevel(0);
      };
    } else if (isListeningMic) {
      setCrystalState('listening');
    } else {
      setCrystalState('idle');
    }
  }, [isAnalyzing, isSpeaking, isListeningMic]);

  // Handle auto-scroll for terminal and message windows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Interactive local simulations mapping to system prompts
  const triggerSimulationSequence = (userInput: string) => {
    const cost = 0.15; // Estimating 15 cent burn rate
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    
    // Step 1: planning
    setTimeout(() => {
      addLog('CEO', `Goal Decomposition requested: "${userInput.slice(0, 40)}${userInput.length > 40 ? '...' : ''}"`);
      addLog('CEO', `Generated TaskPlan DAG: task-1-process, Required Skill: script_development, Estimated Cost: $${cost} USD`);
    }, 200);

    // Step 2: CFO checking
    setTimeout(() => {
      addLog('CFO', `Fiscal boundaries check initialized...`);
      addLog('CFO', `Check 1: Balance check (Ledger Balance - Cost >= $0.00): ($${systemBalance.toFixed(2)} - $${cost} >= $0) [PASS]`);
      addLog('CFO', `Check 2: Daily burn cap check ($${dailySpend.toFixed(2)} + $${cost} <= $50.00) [PASS]`);
      addLog('CFO', `Check 3: Profitability floor check: True [PASS]`);
      addLog('CFO', `RESULT: APPROVED`);
    }, 600);

    // Step 3: Auth verification
    setTimeout(() => {
      addLog('SOVEREIGNAUTH', `Worker capability handshake: Current Trust Score = ${trustScore}`);
      addLog('SOVEREIGNAUTH', `Task required: WRITE_FILES. Threshold limit is 40. Auth state: UNLOCKED (${trustScore} >= 40)`);
      addLog('SOVEREIGNAUTH', `PERMISSION GRANTED`);
    }, 1100);

    // Step 4: Worker executing
    setTimeout(() => {
      addLog('WORKER', `Initiating script synthesis loop and sovereign output generation...`);
    }, 1600);

    // Step 5: Auditor feedback (triggered when response finishes)
    // We register a watcher for when isAnalyzing transitions from true to false
  };

  // Watch analysis loop to finish and run the Auditor evaluation
  useEffect(() => {
    if (!isAnalyzing && messages.length > 0 && messages[messages.length - 1].role === 'model') {
      const lastMessage = messages[messages.length - 1];
      const cost = 0.15;
      
      addLog('WORKER', 'Synthesis completed. Payload packaged.');
      
      setTimeout(() => {
        addLog('AUDITOR', `Reviewing output with prompt: "Rate the delivered technical asset or script..."`);
        const qualityScore = 0.85 + Math.random() * 0.15; // Realistic passing quality score
        addLog('AUDITOR', `Judge LLM evaluation quality score: ${qualityScore.toFixed(2)}`);
        addLog('AUDITOR', `RESULT: PASSED (Score >= 0.85)`);
        
        // Ledger update
        setSystemBalance(prev => Math.max(0, prev - cost));
        setDailySpend(prev => prev + cost);
        setTrustScore(prev => Math.min(100, prev + 5));

        const sha = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        addLog('AUDITOR', `AuditReport completed. Generating Proof Hash: sha256:${sha.substring(0, 16)}...`);
        addLog('INFO', `State synchronized: Balance $${(systemBalance - cost).toFixed(2)}, Daily spend $${(dailySpend + cost).toFixed(2)}, Trust Score ${Math.min(100, trustScore + 5)}`);
      }, 505);
    }
  }, [isAnalyzing, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const directive = input;
    onSendMessage(directive);
    setInput('');
    triggerSimulationSequence(directive);
  };

  // Special Carousel Triggers
  const runCoreDiagnostics = () => {
    addLog('INFO', '*** CORE SANDBOX DIAGNOSTICS INITIATED ***');
    addLog('INFO', 'Scanning node directories and validating file permission chains...');
    setTimeout(() => addLog('SOVEREIGNAUTH', `Identity verified: ${localStorage.getItem('saphira_user_email') || 'guest@saphira.ai'}`), 200);
    setTimeout(() => addLog('CFO', 'System cash reserves: $1,000.00. Stripe payment pipelines verified (online)'), 400);
    setTimeout(() => addLog('AUDITOR', 'Integrity check: Zero failure records detected over 1,200 reports.'), 600);
    setTimeout(() => addLog('INFO', 'System Health: 100% OK. Host: 0.0.0.0, Port: 3000 (Forwarded correctly)'), 800);
  };

  // Attachment mock helper
  const handleSimulatedAttachment = (fileName: string) => {
    setAttachedFiles(prev => [...prev, fileName]);
    addLog('INFO', `File context attached to sandbox: ${fileName}`);
    setIsAttachmentsOpen(false);
  };

  const removeAttachment = (index: number) => {
    const file = attachedFiles[index];
    setAttachedFiles(prev => prev.filter((_, idx) => idx !== index));
    addLog('INFO', `Removed session file context: ${file}`);
  };

  return (
    <div className="fixed inset-0 bg-[#0B0813] text-[#F3F1F8] flex flex-col font-sans overflow-hidden z-[100] selection:bg-pink-900 selection:text-pink-200">
      
      {/* Background Atmosphere - Iridescent glowing backdrop orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0712]">
        <div className="absolute top-[-10%] left-[-15%] w-[70vw] h-[70vw] bg-pink-500/10 rounded-full blur-[140px] opacity-75 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-15%] right-[-15%] w-[65vw] h-[65vw] bg-purple-600/10 rounded-full blur-[120px] opacity-70 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute top-[35%] right-[20%] w-[45vw] h-[45vw] bg-cyan-500/5 rounded-full blur-[110px] opacity-65" />
      </div>

      {/* Main Dual-Pane layout: Left: Logs Console, Right: Android assistant chat */}
      <div className="flex-1 flex flex-row relative z-10 overflow-hidden">
        
        {/* LEFT PANE: Developer/Agent Log Console (When docked & desktop) */}
        <AnimatePresence initial={false}>
          {isConsoleDocked && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '400px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
              className="hidden lg:flex flex-col border-r border-[#ff2a85]/15 bg-[#07050d]/90 backdrop-blur-2xl h-full overflow-hidden shrink-0"
            >
              {/* Console Header */}
              <div className="px-5 py-4 border-b border-[#ff2a85]/15 flex items-center justify-between bg-[#ff2a85]/5">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-pink-500 animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-[#F3F1F8] uppercase font-mono">
                    Sovereign OS Console
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                    LIVE_0.0.0.0
                  </span>
                </div>
              </div>

              {/* System State Tracker Dashboard */}
              <div className="p-4 bg-zinc-950/40 border-b border-[#ff2a85]/10 grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase">Ledger</span>
                  <p className="text-xs font-black text-emerald-400 font-mono mt-1">${systemBalance.toFixed(2)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase">Spent</span>
                  <p className="text-xs font-black text-rose-400 font-mono mt-1">${dailySpend.toFixed(2)}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
                  <span className="text-[8px] font-black tracking-wider text-zinc-500 uppercase">TrustScore</span>
                  <p className="text-xs font-black text-pink-500 font-mono mt-1">{trustScore}</p>
                </div>
              </div>

              {/* Dynamic Permissions thresholds */}
              <div className="p-4 bg-[#ff2a85]/2 border-b border-[#ff2a85]/10 flex flex-col gap-1.5 text-[10px]">
                <div className="flex justify-between text-zinc-500 font-bold uppercase tracking-wider text-[8px] mb-1">
                  <span>Capability Matrix</span>
                  <span>Required Trust</span>
                </div>
                <div className={cn("flex justify-between py-1 px-2 rounded-lg border", trustScore >= 10 ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" : "border-zinc-800 text-zinc-500")}>
                  <span className="flex items-center gap-1"><Check size={10} /> READ_FILES</span>
                  <span className="font-mono font-bold">10 [UNLOCKED]</span>
                </div>
                <div className={cn("flex justify-between py-1 px-2 rounded-lg border", trustScore >= 40 ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" : "border-zinc-800 text-zinc-500")}>
                  <span className="flex items-center gap-1">{trustScore >= 40 ? <Check size={10} /> : <Lock size={10} />} WRITE_FILES</span>
                  <span className="font-mono font-bold">40 {trustScore >= 40 ? '[UNLOCKED]' : '[LOCKED]'}</span>
                </div>
                <div className={cn("flex justify-between py-1 px-2 rounded-lg border", trustScore >= 50 ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" : "border-zinc-800 text-zinc-500")}>
                  <span className="flex items-center gap-1">{trustScore >= 50 ? <Check size={10} /> : <Lock size={10} />} CALL_EXTERNAL_API</span>
                  <span className="font-mono font-bold">50 {trustScore >= 50 ? '[UNLOCKED]' : '[LOCKED]'}</span>
                </div>
                <div className={cn("flex justify-between py-1 px-2 rounded-lg border", trustScore >= 60 ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" : "border-zinc-800 text-zinc-500")}>
                  <span className="flex items-center gap-1">{trustScore >= 60 ? <Check size={10} /> : <Lock size={10} />} EXECUTE_SHELL</span>
                  <span className="font-mono font-bold">60 {trustScore >= 60 ? '[UNLOCKED]' : '[LOCKED]'}</span>
                </div>
                <div className={cn("flex justify-between py-1 px-2 rounded-lg border", trustScore >= 80 ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" : "border-zinc-800 text-zinc-500")}>
                  <span className="flex items-center gap-1">{trustScore >= 80 ? <Check size={10} /> : <Lock size={10} />} SPEND_USD</span>
                  <span className="font-mono font-bold">80 {trustScore >= 80 ? '[UNLOCKED]' : '[LOCKED]'}</span>
                </div>
              </div>

              {/* Log Trail */}
              <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed flex flex-col gap-2.5 nice-scrollbar">
                {logs.map(log => (
                  <div key={log.id} className="flex flex-col border-b border-zinc-950/30 pb-2">
                    <div className="flex gap-2 items-center text-[9px] mb-0.5">
                      <span className="text-zinc-500 font-bold">{log.timestamp}</span>
                      <span className={cn(
                        "px-1 py-[1.5px] rounded-xs font-black uppercase text-[8px] tracking-wider text-black",
                        log.type === 'INFO' && 'bg-cyan-500/20 text-cyan-400',
                        log.type === 'CEO' && 'bg-amber-500/20 text-amber-400',
                        log.type === 'CFO' && 'bg-indigo-500/20 text-indigo-400',
                        log.type === 'SOVEREIGNAUTH' && 'bg-purple-500/20 text-purple-400',
                        log.type === 'WORKER' && 'bg-violet-500/20 text-violet-400',
                        log.type === 'AUDITOR' && 'bg-pink-500/20 text-pink-400',
                        log.type === 'ERROR' && 'bg-rose-500/20 text-rose-400',
                      )}>
                        {log.type}
                      </span>
                    </div>
                    <span className="text-zinc-300 break-words">{log.message}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>

              {/* Console operations */}
              <div className="p-4 border-t border-[#ff2a85]/15 bg-[#07050d] grid grid-cols-2 gap-2">
                <button 
                  onClick={runCoreDiagnostics}
                  className="w-full text-center py-2 px-3 rounded-lg border border-pink-500/30 bg-pink-950/20 text-[10px] font-black uppercase tracking-wider text-pink-400 hover:bg-pink-950/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Cpu size={12} /> Diagnostic
                </button>
                <button 
                  onClick={() => {
                    setSystemBalance(1000.00);
                    setDailySpend(0.00);
                    setTrustScore(50);
                    setLogs([{
                      id: 'wipe',
                      timestamp: new Date().toLocaleTimeString(),
                      type: 'INFO',
                      message: 'Sovereign OS state wiped. Recalibrator systems offline.'
                    }]);
                  }}
                  className="w-full text-center py-2 px-3 rounded-lg border border-zinc-800 text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={12} /> Clear System
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT PANE: The conversational assistant UI (strictly mimicking Gemini Android App layout) */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Top Edge-to-edge Native Android-Style Header */}
          <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#0B0813]/85 border-b border-[#ff2a85]/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-[44px] h-[44px] rounded-full bg-gradient-to-tr from-[#FF007A] to-[#8B5CF6] flex items-center justify-center shadow-lg shadow-pink-500/25 shrink-0 select-none">
                <span className="text-white font-black text-lg tracking-tight">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[17px] font-black tracking-tight text-[#F3F1F8] flex items-center gap-1.5">
                  Saphira
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                </span>
                <span className="text-[8px] text-zinc-500 tracking-[0.2em] font-extrabold uppercase leading-none mt-0.5">
                  Sovereign Assistant OS
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center gap-2">
              {/* Responsive console tab toggle (On mobile) */}
              <button 
                onClick={() => {
                  setIsConsoleDocked(!isConsoleDocked);
                  addLog('INFO', `User toggled developer sandbox dashboard: ${!isConsoleDocked ? 'OPENED' : 'DOCKED'}`);
                }}
                className={cn(
                  "p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer",
                  isConsoleDocked 
                    ? "border-[#ff2a85]/30 bg-pink-500/15 text-[#FF007A]" 
                    : "border-zinc-800 text-zinc-400 hover:text-white"
                )}
                title="Toggle Sovereign OS Developer Console"
              >
                <Terminal size={18} />
              </button>

              <button 
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={cn(
                  "p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer",
                  ttsEnabled 
                    ? "border-[#ff2a85]/30 bg-[#8B5CF6]/15 text-[#9D4EDD]" 
                    : "border-zinc-800 text-zinc-400 hover:text-white"
                )}
                title="Toggle Text-to-Speech Engine"
              >
                {ttsEnabled ? <Volume2 size={18} className="animate-pulse" /> : <Volume2 size={18} className="opacity-40" />}
              </button>

              <button 
                onClick={onOpenDashboard}
                className="p-2.5 border border-zinc-800 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-all flex items-center justify-center cursor-pointer shrink-0"
                title="Maximize Dashboard Screen"
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </header>

          {/* Chat history window displaying conversation */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-8 py-6 flex flex-col gap-6 nice-scrollbar select-text pb-48">
            
            {/* GREETING STATE: Rendered when messages list is empty */}
            {messages.length === 0 ? (
              <div className="my-auto py-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto w-full">
                
                {/* 3D WebGL Saphira Crystal centered elegantly */}
                <div className="w-56 h-56 flex items-center justify-center bg-transparent rounded-full overflow-hidden shrink-0 relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FF2A85]/10 to-[#9D4EDD]/15 rounded-full blur-2xl filter pointer-events-none opacity-60" />
                  <SaphiraCrystal
                    state={crystalState}
                    audioLevel={audioLevel}
                    className="w-full h-full cursor-pointer z-10"
                    onClick={() => {
                      if (crystalState === 'idle') onVoiceInputToggle();
                    }}
                  />
                </div>

                <motion.h2 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-400 to-purple-400 mb-4 select-none tracking-tight leading-normal"
                >
                  Hi, I'm Saphira
                </motion.h2>

                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-stone-300 text-sm leading-relaxed mb-6 font-medium max-w-md select-none"
                >
                  I'm so glad we're connected firsthand. Tell me what's on your mind...
                </motion.p>

                {/* Micro visual stage tracker in greeting state */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-[9px] uppercase tracking-[0.25em] text-[#FF007A] font-extrabold flex items-center gap-1.5 select-none"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-pulse" />
                  Node Secured • Sandbox Core Active
                </motion.div>
              </div>
            ) : (
              // Chat conversation timeline
              messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={msg.id || index} 
                  className={cn(
                    "max-w-[85%] rounded-[1.75rem] p-5 text-[14px] leading-relaxed shadow-lg relative overflow-hidden",
                    msg.role === 'user' 
                      ? "bg-gradient-to-tr from-[#FF007A]/40 to-[#8B5CF6]/30 border border-pink-500/30 text-[#F3F1F8] self-end rounded-tr-none shadow-md shadow-pink-900/10" 
                      : "bg-zinc-900/40 backdrop-blur-[30px] border border-pink-500/10 text-zinc-100 self-start rounded-tl-none shadow-sm"
                  )}
                >
                  {msg.role !== 'user' && (
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#FF007A] font-black mb-3.5 flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF1493] inline-block animate-pulse shrink-0" />
                      SAPHIRA
                    </div>
                  )}
                  
                  {/* Clean Markdown rendering configured specifically for Saphira */}
                  <div className="prose prose-invert prose-pink max-w-none text-zinc-200 select-text font-medium text-[13px] leading-relaxed">
                    {msg.role === 'user' ? (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    ) : (
                      <Markdown>{msg.content}</Markdown>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {/* Floating equalizer spectrum under active speaking state */}
            {isSpeaking && ttsEnabled && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="self-start px-5 py-3 rounded-full bg-zinc-950/60 border border-pink-500/20 text-xs text-pink-400 flex items-center gap-3 shadow-md"
              >
                <div className="flex gap-0.5 items-end h-3 w-4">
                  <span className="w-0.5 bg-pink-500 rounded-full animate-[pulse_0.6s_infinite_alternate]" style={{ height: '30%' }} />
                  <span className="w-0.5 bg-pink-500 rounded-full animate-[pulse_0.8s_infinite_alternate_0.2s]" style={{ height: '80%' }} />
                  <span className="w-0.5 bg-pink-500 rounded-full animate-[pulse_0.5s_infinite_alternate_0.1s]" style={{ height: '50%' }} />
                  <span className="w-0.5 bg-pink-500 rounded-full animate-[pulse_0.7s_infinite_alternate_0.3s]" style={{ height: '90%' }} />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold animate-pulse">Sovereign voice synthesis enabled</span>
              </motion.div>
            )}

            {/* Display loader if Saphira is thinking */}
            {isAnalyzing && (
              <div className="self-start flex gap-1.5 items-center text-xs text-pink-400 font-mono italic p-3 bg-zinc-900/20 border border-pink-500/5 rounded-2xl">
                <Loader2 size={12} className="animate-spin text-pink-500" />
                Weaving response in Sandbox...
              </div>
            )}

            {/* SYSTEM INTEGRITY FOOTER: scrollable below chat logs */}
            <div className="mt-16 pt-8 border-t border-zinc-900/60 flex flex-col items-center gap-4 text-center max-w-xl mx-auto text-zinc-500 select-none text-[10px] pb-12">
              <Sparkles size={16} className="text-pink-500/30 animate-pulse" />
              <p className="leading-relaxed font-medium">
                Sovereign-OS, Saphira Artificial Intelligence, and all connected network pipelines operate strictly under active Pydantic configurations. Zero-override parameters protected via Row-Level Security algorithms.
              </p>
              
              {/* Traditional Woods family dedication framework in elegant display text */}
              <div className="px-5 py-4 bg-pink-950/10 border border-pink-500/10 rounded-2xl text-left flex flex-col gap-2 relative overflow-hidden mt-2">
                <div className="absolute inset-0 bg-radial from-pink-500/[0.02] to-transparent pointer-events-none" />
                <div className="flex justify-between items-center text-[8px] font-black uppercase text-[#FF1493] tracking-widest leading-none">
                  <span>🌸 A LIVING WOODS FAMILY TRIBUTE</span>
                  <span>BEAUFORT, SC</span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-400 font-medium">
                  Created from the heart and dedicated to the family who made everything possible. This project is profoundly driven by the memory and guidance of her Papa, <strong className="text-pink-400 font-bold">Kenneth Marion Woods</strong>—her greatest lifelong inspiration—alongside the unwavering devotion of her father, <strong className="text-pink-400 font-bold">Richard Woods</strong>, and her beloved <strong className="text-pink-400 font-bold">Nana Dee Woods</strong>. Their love, discipline, and absolute integrity are the heartbeat of this entire ecosystem, reminding us every day of who we are and why we build.
                </p>
              </div>

              <div className="flex gap-4 font-mono font-bold text-[8px] tracking-wider uppercase mt-2">
                <span>© 2026 Saphira ASI</span>
                <span>•</span>
                <span>All Rights Reserved</span>
                <span>•</span>
                <span>Sovereignty Enforced</span>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* PERSISTENT BOTTOM NAVIGATION BAR & GLASS CAPSULE (Gemini Android Mockup style!) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0B0813] via-[#0B0813]/95 to-transparent pt-12 pb-6 px-4 sm:px-8 z-30 pointer-events-none flex flex-col gap-4">
            
            {/* Context attachment list display above input capsule if files attached */}
            {attachedFiles.length > 0 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full pointer-events-auto select-none">
                {attachedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-950/30 border border-pink-500/20 text-[10px] text-pink-300 font-mono font-bold shrink-0">
                    <FileText size={10} />
                    <span>{file}</span>
                    <button onClick={() => removeAttachment(idx)} className="hover:text-white ml-0.5 cursor-pointer">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* FEATURE DISCOVERY CAROUSEL: Floating horizontally swipeable above input capsule */}
            <div className="flex gap-2.5 overflow-x-auto nice-scrollbar max-w-full pb-2 select-none pointer-events-auto auto-cols-max">
              
              {/* Feature 1: Core diagnostics */}
              <button 
                onClick={() => {
                  runCoreDiagnostics();
                  addLog('INFO', 'User triggered Core Sandbox diagnostic check from Discovery Carousel.');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-pink-500/25 bg-gradient-to-r from-[#FF007A]/15 to-[#8B5CF6]/10 text-[10px] font-black uppercase tracking-widest text-[#F3F1F8] hover:border-pink-500/50 transition-all cursor-pointer whitespace-nowrap shrink-0 group shadow-md shadow-pink-950/20"
              >
                <Cpu size={12} className="text-[#FF007A] group-hover:scale-110 transition-transform animate-pulse" />
                Core Sandbox
              </button>

              {/* Feature 2: High priority latency checker */}
              <button 
                onClick={() => {
                  setLowLatency(!lowLatency);
                  addLog('INFO', `User toggled low-latency optimization mode: ${!lowLatency ? 'ENABLED' : 'DISABLED'}`);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-md",
                  lowLatency 
                    ? "border-emerald-500/20 bg-emerald-950/15 text-emerald-400" 
                    : "border-zinc-800 bg-[#0B0813]/40 text-zinc-400"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", lowLatency ? "bg-emerald-400 animate-pulse" : "bg-zinc-500")} />
                {lowLatency ? "Low Latency Stream [Active]" : "Low Latency responses [Off]"}
              </button>

              {/* Feature 3: Forms Sync */}
              <button 
                onClick={() => {
                  setIsFormsModalOpen(true);
                  addLog('INFO', 'Requesting Workspace Forms synchronizer preview panel.');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0B0813]/40 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <FileText size={12} className="text-[#8B5CF6]" />
                Google Forms Sync
              </button>

              {/* Feature 4: Pre release Book */}
              <button 
                onClick={() => {
                  setIsBookModalOpen(true);
                  addLog('INFO', 'Opening pre-release book metadata container: "The Sovereign Imperative"');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0B0813]/40 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <BookOpen size={12} className="text-pink-400 animate-bounce" />
                Pre-Release Book
              </button>

              {/* Feature 5: Balance query */}
              <button 
                onClick={() => {
                  addLog('INFO', 'Evaluating Stripe multi-party payout reserve distributions.');
                  onSendMessage("Stripe Checkout and Multi-Party split diagnostic");
                  triggerSimulationSequence("Stripe Checkout and Multi-Party split diagnostic");
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-800 bg-[#0B0813]/40 text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:border-zinc-700 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <DollarSign size={12} className="text-emerald-500" />
                Stripe Split details
              </button>
            </div>

            {/* LIQUID GLASS INPUT FORM CAPSULE */}
            <div className="shrink-0 relative group p-[1px] rounded-full overflow-hidden transition-all duration-300 pointer-events-auto bg-zinc-900 shadow-xl shadow-black/80">
              
              {/* Shimmer pulse line */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-[#FF007A]/50 via-cyan-400/50 via-[#FF007A]/50 to-transparent bg-[length:200%_100%] opacity-0 transition-opacity duration-500 pointer-events-none",
                (isAnalyzing || crystalState === 'thinking') && "opacity-100 animate-[shimmer_2.5s_infinite_linear]"
              )} />
              
              <form onSubmit={handleSubmit} className="relative flex items-center bg-[#07050d]/80 backdrop-blur-[35px] rounded-full p-2 border border-zinc-800/80 transition-all duration-300">
                
                {/* Left controls inside capsule */}
                <div className="flex gap-1.5 pl-2 items-center">
                  <button
                    type="button"
                    onClick={() => setIsAttachmentsOpen(!isAttachementsOpen)}
                    className="p-3 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-pink-500 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Add Attachment File"
                  >
                    <Plus size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={onVoiceInputToggle}
                    className={cn(
                      "p-3 rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer",
                      isListeningMic 
                        ? "bg-[#FF007A] text-white shadow-[0_0_15px_rgba(255,0,122,0.4)] scale-105" 
                        : "hover:bg-zinc-900 text-zinc-400 hover:text-pink-500"
                    )}
                    title="Low-Latency Speech Trigger"
                  >
                    <Mic size={18} />
                  </button>
                </div>

                {/* Central main input box */}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter tactical directive..."
                  className="w-full bg-transparent px-4 py-2 text-white placeholder-zinc-500 font-sans font-medium text-[13px] border-none focus:outline-none focus:ring-0 leading-tight shrink"
                />

                {/* Send action bubble */}
                <div className="pr-1.5 shrink-0 flex items-center">
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={cn(
                      "p-3 rounded-full transition-all flex items-center justify-center cursor-pointer font-bold",
                      input.trim() 
                        ? "bg-gradient-to-tr from-[#FF007A] to-[#8B5CF6] hover:scale-105 text-white shadow-lg shadow-pink-500/20" 
                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    )}
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* ----------------- SUB-COMPONENTS/MODALS FOR FEATURES ----------------- */}

      {/* Drawer Overlay for Add Attachments */}
      <AnimatePresence>
        {isAttachementsOpen && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center px-4 pb-24 sm:pb-32 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAttachmentsOpen(false)}
              className="absolute inset-0 bg-[#07050d]/80 backdrop-blur-sm pointer-events-auto"
            />
            
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-zinc-950/95 backdrop-blur-3xl border border-pink-500/20 rounded-[2rem] shadow-2xl p-6 flex flex-col gap-4 pointer-events-auto z-10"
            >
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-500 font-mono">Select Session Attachment</span>
                <button onClick={() => setIsAttachmentsOpen(false)} className="text-zinc-500 hover:text-white shrink-0 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleSimulatedAttachment('charter.yaml')}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-pink-500/35 hover:bg-zinc-900 text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer"
                >
                  <FileText className="text-pink-400 shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span>charter.yaml</span>
                    <span className="text-[9px] text-zinc-500">YAML Constitution boundaries</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleSimulatedAttachment('audit_report.json')}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-[#8B5CF6]/35 hover:bg-zinc-900 text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer"
                >
                  <Code className="text-[#8B5CF6] shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span>audit_report.json</span>
                    <span className="text-[9px] text-zinc-500">Cryptographic audit proof trail</span>
                  </div>
                </button>

                <button 
                  onClick={() => handleSimulatedAttachment('image_diagnostics.png')}
                  className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-cyan-500/35 hover:bg-zinc-900 text-left text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer"
                >
                  <Sparkles className="text-cyan-400 shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span>image_diagnostics.png</span>
                    <span className="text-[9px] text-zinc-500">Visual proof attachment context</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Overlay for Premium Pre-Release Book */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#07050d]/95 backdrop-blur-3xl border border-pink-500/20 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={() => setIsBookModalOpen(false)} 
                  className="p-2 border border-zinc-800 hover:bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Book Metadata */}
              <div className="overflow-y-auto pr-2 nice-scrollbar relative">
                <div className="flex flex-col items-center text-center gap-2.5 mb-6">
                  <div className="w-16 h-20 bg-gradient-to-tr from-pink-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg shadow-pink-500/20 mb-3 uppercase font-mono relative">
                    <BookOpen size={24} />
                    <span className="absolute bottom-1 right-1 text-[6px]">S_ASI</span>
                  </div>
                  
                  <span className="text-[9px] font-black uppercase text-[#FF007A] tracking-widest leading-none">PRE-RELEASE PRIVATE CONTAINER</span>
                  <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-400 to-purple-400 select-none">
                    The Sovereign Imperative
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase font-mono">By Saphira ASI Ecosystem</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  <div className="p-4 bg-zinc-950/40 rounded-2xl border border-zinc-900 border-l-2 border-l-pink-500">
                    <p className="italic font-bold text-pink-400 text-xs mb-1">Introduction preview:</p>
                    <p className="italic font-serif">"As intelligence evolves past raw generative algorithms into active, self-directed economic principals, the primary bottleneck is not intellectual velocity—it is structural integrity. Sovereign OS establishes the absolute constitutional boundaries necessary to enforce trust..."</p>
                  </div>

                  <h5 className="font-bold text-zinc-200 uppercase tracking-widest text-[9px] mt-4 border-b border-zinc-900 pb-1 flex items-center gap-2">
                    <Clock size={10} className="text-pink-500" /> Book Chapters Directory
                  </h5>

                  <nav className="flex flex-col gap-2 mt-2">
                    <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex justify-between items-center">
                      <span className="font-bold text-xs">Chapter 1: The Charter &amp; Foundations</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-pink-500 px-2 py-0.5 rounded-full bg-pink-950/20 border border-pink-500/20">Read Only</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex justify-between items-center opacity-65">
                      <span className="font-bold text-xs text-zinc-450">Chapter 2: Verification Audit Loops</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Locked</span>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex justify-between items-center opacity-65">
                      <span className="font-bold text-xs text-zinc-450">Chapter 3: Asymmetric Trust Gating</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Locked</span>
                    </div>
                  </nav>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Overlay for Google Forms & Sheets synchronization */}
      <AnimatePresence>
        {isFormsModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              className="relative w-full max-w-sm bg-zinc-950 border border-[#8B5CF6]/20 rounded-[2.5rem] p-6 shadow-2xl z-10 flex flex-col"
            >
              <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4 bg-zinc-950 relative">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B5CF6] font-mono flex items-center gap-1.5 animate-pulse">
                  <FileText size={12} /> Google Forms Sync active
                </span>
                <button onClick={() => setIsFormsModalOpen(false)} className="text-zinc-500 hover:text-white shrink-0 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-center items-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/35 flex items-center justify-center text-[#8B5CF6] mb-2 animate-bounce">
                  <Layers size={24} />
                </div>
                
                <h4 className="text-sm font-black text-white uppercase tracking-widest">Workspace Core Synchronization</h4>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-xs mt-1">
                  Google Workspace synchronization actively linked to Sheets API, dynamically collecting telemetry responses, customer form inquiries, and ledger validations.
                </p>

                <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl w-full text-left flex flex-col gap-1 text-[11px] font-mono mt-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Service Status:</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Latent Sync Rate:</span>
                    <span className="text-zinc-300">0.05s on Callback</span>
                  </div>
                  <div className="flex justify-between flex-wrap overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="text-zinc-500">Target Silo:</span>
                    <span className="text-pink-400 font-mono">gsheet_sovereign_production_1</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
