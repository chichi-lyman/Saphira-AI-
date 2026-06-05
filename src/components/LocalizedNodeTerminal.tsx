import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, HardDrive, Cpu, Activity, ShieldAlert, X, ChevronRight, FileCode, FolderSync } from 'lucide-react';
import { cn } from '../lib/utils';

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error' | 'success' | 'warning';
  timestamp: number;
}

export const LocalizedNodeTerminal = ({ active, onClose }: { active: boolean, onClose: () => void }) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const newCommand: TerminalLine = {
        text: input,
        type: 'command',
        timestamp: Date.now()
      };
      
      setLines(prev => [...prev, newCommand]);
      setInput('');

      setTimeout(() => {
        let response: TerminalLine;
        const cmd = input.toLowerCase().trim();
        
        if (cmd === 'help') {
          response = { text: "AVAILABLE COMMANDS: init_agent0, mount_fs, execute_python, deploy_docker, clear, build_synthetic, run_qlora_pipeline", type: 'output', timestamp: Date.now() };
        } else if (cmd === 'clear') {
          setLines([]);
          return;
        } else if (cmd === 'init_agent0') {
          response = { text: "Agent Zero core initialized. Recursive execution active.", type: 'success', timestamp: Date.now() };
        } else if (cmd.startsWith('python') || cmd.startsWith('execute_python')) {
          response = { text: "[Agent Zero] Executing abstract reasoning loop in sandbox...", type: 'success', timestamp: Date.now() };
        } else if (cmd === 'build_synthetic') {
          response = { text: "[Data Forge] Ingesting domain PDFs. Generating 5,000 QA pairs. Zero-retention protocol active.", type: 'success', timestamp: Date.now() };
        } else if (cmd === 'run_qlora_pipeline') {
          response = { text: "[Training] Triggering QLoRA on Llama 3 8B. Allocated 24GB VRAM slice.", type: 'success', timestamp: Date.now() };
        } else {
          response = { text: `Command not recognized by Local Node: ${input}`, type: 'warning', timestamp: Date.now() };
        }
        
        setLines(prev => [...prev, response]);
      }, 600);
    }
  };

  useEffect(() => {
    if (!active) return;
    
    const bootSequence = [
      { text: "Initiating Localized Node Survival Mode...", type: "command" as const, delay: 0 },
      { text: "Cloud tether severed. Falling back to Core Local Nano-Model.", type: "warning" as const, delay: 500 },
      { text: "Mounting local file system [Read/Write Access: GRANTED]", type: "success" as const, delay: 1200 },
      { text: "Initializing recursive OS execution sandbox...", type: "output" as const, delay: 1800 },
      { text: "Agent Zero core active. Awaiting local execution directives. Type 'help' for commands.", type: "success" as const, delay: 2500 },
    ];

    let currentInitialLines: TerminalLine[] = [];
    
    bootSequence.forEach((step, index) => {
      setTimeout(() => {
        const newLine: TerminalLine = {
          text: step.text,
          type: step.type,
          timestamp: Date.now()
        };
        currentInitialLines = [...currentInitialLines, newLine];
        setLines(currentInitialLines);
      }, step.delay);
    });

  }, [active]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  if (!active) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 w-full max-w-3xl z-[250] p-6 pointer-events-none"
    >
      <div className="liquid-glass border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden pointer-events-auto flex flex-col h-[400px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-indigo-900/10 flex items-center justify-between bg-white/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
              <HardDrive size={18} className="text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-950">Local Execution Node</span>
                <span className="text-[8px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-black uppercase animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]">Survival Mode Active</span>
              </div>
              <div className="text-[9px] font-black text-indigo-900/40 uppercase tracking-widest mt-0.5">Offline Local Filesystem Override</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-indigo-900/40 hover:text-indigo-900"
          >
            <X size={16} />
          </button>
        </div>

        {/* Terminal Area */}
        <div 
          ref={scrollRef}
          className="flex-grow bg-[#050510]/80 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed relative"
        >
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #000 100%)' }} />
          </div>
          
          <div className="space-y-2 relative z-10">
            {lines.map((line, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-start gap-3",
                  line.type === 'command' ? "text-indigo-300" :
                  line.type === 'error' ? "text-rose-400" :
                  line.type === 'success' ? "text-emerald-400" :
                  line.type === 'warning' ? "text-orange-400" :
                  "text-slate-400"
                )}
              >
                <div className="shrink-0 mt-0.5 opacity-50">
                  {line.type === 'command' ? <ChevronRight size={12} /> : 
                   line.type === 'success' ? <Activity size={12} /> : 
                   line.type === 'warning' ? <ShieldAlert size={12} /> :
                   <TerminalIcon size={12} />}
                </div>
                <div className="break-all">{line.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Input Simulation Area */}
        <div className="px-6 py-4 bg-[#0a0a1a] border-t border-indigo-500/20 flex items-center gap-3">
          <ChevronRight size={14} className="text-indigo-400 font-bold shrink-0" />
          <input 
            type="text"
            className="flex-grow bg-transparent text-[11px] font-mono text-white placeholder:text-indigo-500/40 focus:outline-none"
            placeholder="Awaiting local recursive logic... (type commands here)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </motion.div>
  );
};
