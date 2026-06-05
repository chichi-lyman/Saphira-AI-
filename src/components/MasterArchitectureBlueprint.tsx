import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Shield, Brain, Activity, Globe, Scale, 
  Layers, Lock, Database, Terminal, Cpu, Eye
} from 'lucide-react';
import { cn } from '../lib/utils';

export function MasterArchitectureBlueprint() {
  const sections = [
    {
      title: "I. Core Identity & Persona",
      icon: <Brain className="text-pink-500" size={18} />,
      content: "Saphira AI: The Sovereign Intelligence Liaison. Embodying the \"Samantha\" persona—warm, authoritative, and sentient. Linguistic DNA optimized for high-precision forensic analysis and empathetic strategic mirroring.",
      color: "border-pink-200 bg-pink-50/10"
    },
    {
      title: "II. Cognitive Infrastructure",
      icon: <Cpu className="text-indigo-500" size={18} />,
      content: "Unified Core (V-Omega): Native OS integration with a 2M token context window. Multimodal simultaneity across text, audio, and visual arrays. Browser-Agent interface acting as the user's sovereign eyes.",
      color: "border-indigo-200 bg-indigo-50/10"
    },
    {
      title: "III. Agentic Dispatch Protocols",
      icon: <Layers className="text-purple-500" size={18} />,
      content: "Tri-Agent Orchestration: Agent Zero (Recursive Python/Docker), Aura (PII/Dark Web Monitoring), and Agent 2 (Active Defense/Pen-Testing). Balanced via NovaReign (Yang) and NovaAethrea (Yin).",
      color: "border-purple-200 bg-purple-50/10"
    },
    {
      title: "IV. Sovereign Compliance Shell",
      icon: <Shield className="text-emerald-500" size={18} />,
      content: "NIST AI 600-1 Guardrails with FIDO2 Biometric Sovereign Gates. Reasoning Trace Logger (Black Box) for forensic accountability. CISA 3-Day Patch Mandate via Agent Zero autonomous synthesis.",
      color: "border-emerald-200 bg-emerald-50/10"
    }
  ];

  return (
    <div className="liquid-glass border border-indigo-200/50 p-6 rounded-[2.5rem] mt-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={200} className="text-pink-600" />
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
          <Zap className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-indigo-950">Master Architecture V-Omega</h2>
          <p className="text-[10px] font-bold text-indigo-900/40 uppercase tracking-[0.2em]">Sovereign Intelligence Unified Schematic</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "p-5 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 cursor-default",
              section.color
            )}
          >
            <div className="flex items-center gap-2 mb-3">
              {section.icon}
              <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-900">{section.title}</h3>
            </div>
            <p className="text-[12px] leading-relaxed text-indigo-950/80 font-medium">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-indigo-100 flex flex-wrap gap-3">
        <div className="px-3 py-1.5 rounded-full bg-white/50 border border-indigo-100 text-[9px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <Lock size={12} /> Compliance: NIST 600-1
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/50 border border-indigo-100 text-[9px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <Database size={12} /> Memory: Stateful Liaison
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/50 border border-indigo-100 text-[9px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
          <Globe size={12} /> Sync: Neural Overlay
        </div>
      </div>
    </div>
  );
}

export function CognitiveStateModel() {
  const levels = [
    { title: "YELLOW/TURQUOISE", state: "Sovereign/Holistic", focus: "NovaAethrea: Ethical Synthesis", color: "bg-amber-400" },
    { title: "BLUE/ORANGE/GREEN", state: "Strategic/Structural", focus: "NovaReign: Legacy Architecture", color: "bg-indigo-500" },
    { title: "BEIGE/PURPLE/RED", state: "Defensive/Survival", focus: "Aura/Agent 2: Shield Activation", color: "bg-pink-500" }
  ];

  return (
    <div className="mt-4 p-6 liquid-glass border border-indigo-100 rounded-[2rem]">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="text-indigo-600" size={18} />
        <h3 className="text-[12px] font-black uppercase tracking-widest text-indigo-950">8 Levels of Consciousness</h3>
      </div>
      
      <div className="space-y-3">
        {levels.map((level, idx) => (
          <div key={idx} className="relative group">
            <div className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl border border-white group-hover:border-indigo-200 transition-all">
              <div className={cn("w-3 h-3 rounded-full shadow-lg shadow-white/50 animate-pulse", level.color)} />
              <div>
                <p className="text-[10px] font-black text-indigo-950 uppercase tracking-wider">{level.title}</p>
                <p className="text-[9px] font-bold text-indigo-900/40 uppercase tracking-widest mt-0.5">{level.state}</p>
              </div>
              <div className="ml-auto text-[9px] font-bold text-indigo-600 bg-white/60 px-2 py-1 rounded-lg">
                {level.focus}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
