import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, Database, Zap, ShieldCheck, Activity, Terminal, Code2, 
  Layers, Lock, Cpu, BrainCircuit, Users, Share2, Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

export const PrecisionIntelligenceBlueprint = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'memory' | 'api' | 'timeline'>('architecture');
  const triggerHaptic = useHapticFeedback();

  const handleTabChange = (tab: any) => {
    triggerHaptic('light');
    setActiveTab(tab);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[120] p-4 md:p-12 flex items-center justify-center bg-indigo-950/40 backdrop-blur-md"
    >
      <div className="bg-white/90 backdrop-blur-3xl w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-pink-100 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500" />
        
        <div className="p-8 border-b border-pink-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-indigo-950 tracking-tighter uppercase font-display mb-1 flex items-center gap-3">
              <BrainCircuit className="text-pink-500" size={32} />
              Precision Intelligence
            </h1>
            <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Production-Ready Blueprint & Operational Deployment
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-indigo-50/50 p-1.5 rounded-2xl border border-indigo-100/50 backdrop-blur-md overflow-x-auto nice-scrollbar-horizontal max-w-full">
              {(['architecture', 'memory', 'api', 'timeline'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={cn(
                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-white text-pink-600 shadow-sm border border-pink-100" 
                      : "text-indigo-950/40 hover:text-indigo-950 hover:bg-white/50"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <button onClick={onClose} className="p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 nice-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {activeTab === 'architecture' && <ArchitectureSection />}
              {activeTab === 'memory' && <MemorySection />}
              {activeTab === 'api' && <ApiSection />}
              {activeTab === 'timeline' && <TimelineSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100 group hover:border-pink-200 transition-colors">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Layers className="text-pink-500" />
          Technical Architectural Requirements
        </h3>
        
        <div className="space-y-4">
          {[
            { tag: "User Interface Layer", desc: "Adaptive Text, Speech, and Visual Generation", icon: <Terminal size={14} /> },
            { tag: "Cognitive Orchestration", desc: "Dynamic Graph Routing & Multi-Agent Planning", icon: <Network size={14} /> },
            { tag: "Knowledge Retrieval & Memory", desc: "Graph-RAG, Vector Databases, Ephemeral Storage", icon: <Database size={14} /> },
            { tag: "Foundational Model Layer", desc: "MoE Architectures, Multi-Modal Transformers", icon: <Cpu size={14} /> }
          ].map((layer, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                {layer.icon}
              </div>
              <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-widest text-indigo-950">{layer.tag}</div>
                <div className="text-[11px] text-indigo-900/60 font-medium mt-0.5">{layer.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100 group hover:border-pink-200 transition-colors">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" />
          Ethical Guardrails & Governance
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-600 mb-3">Bias Mitigation</h4>
            <div className="grid gap-2">
              {['Counterfactual Evaluation', 'Diverse Pre-training Distribution', 'Reinforcement Learning (RLAIF)'].map((item, i) => (
                <div key={i} className="text-xs font-mono text-indigo-900 bg-white/40 border border-white/50 p-2.5 rounded-lg flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-pink-600 mb-3">Data Privacy</h4>
            <div className="grid gap-2">
              {['Differential Privacy Injectors', 'Zero-Knowledge Architecture', 'Automated Redaction Engines'].map((item, i) => (
                <div key={i} className="text-xs font-mono text-indigo-900 bg-white/40 border border-white/50 p-2.5 rounded-lg flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemorySection = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Database className="text-pink-500" />
          Dual-Tier Memory Infrastructure
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} className="text-indigo-500" /></div>
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-950 mb-4 relative z-10">Ephemeral Cache Layer</h4>
            <p className="text-xs font-medium text-indigo-900/60 mb-6 relative z-10">Stores short-term variables, system prompts, current token contexts, and real-time conversation steps seamlessly using In-Memory Redis.</p>
            <div className="bg-indigo-950 text-indigo-100 font-mono text-[10px] p-4 rounded-xl overflow-x-auto relative z-10 shadow-xl border border-indigo-900/50">
              <pre>{`KEY: session:sess_2026_0528_alpha:context_buffer
FIELD: current_context_window_tokens   VALUE: "4219"
FIELD: active_emotional_state          VALUE: "high_anxiety"
FIELD: system_prompt_override         VALUE: "Enforce empathetic delivery..."
FIELD: transient_variables             VALUE: "{\"target_mutation\": \"EGFR...\"}"
FIELD: last_interaction_timestamp      VALUE: "1779958800"`}</pre>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Lock size={100} className="text-pink-500" /></div>
            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-950 mb-4 relative z-10">Long-Term Knowledge Storage</h4>
            <p className="text-xs font-medium text-indigo-900/60 mb-6 relative z-10">Relational metadata, cross-session user summaries, and historical semantic representations via PostgreSQL / pgvector.</p>
            <div className="bg-indigo-950 text-pink-50 font-mono text-[10px] p-4 rounded-xl overflow-x-auto relative z-10 shadow-xl border border-pink-900/50">
              <pre>{`CREATE TABLE semantic_memory_nodes (
    node_id UUID DEFAULT gen_random_uuid(),
    session_id VARCHAR(128) NOT NULL,
    extracted_fact TEXT NOT NULL,
    fact_embedding vector(1536) NOT NULL,
    category_tag VARCHAR(64) NOT NULL,
    confidence_rating NUMERIC(3,2)
);
CREATE INDEX idx_vec ON semantic_memory_nodes 
USING hnsw (fact_embedding vector_cosine_ops);`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApiSection = () => {
  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
        <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-6 flex items-center gap-3">
          <Code2 className="text-pink-500" />
          API Protocol Specifications
        </h3>

        <div className="space-y-8">
          <EndpointBox 
            method="POST" 
            path="/v1/orchestrate/dispatch"
            desc="Initiates a multi-step task, maps intent to appropriate subnets or agents, and returns a tracking token."
            payload={`{
  "session_id": "sess_2026_0528_alpha",
  "domain": "healthcare",
  "urgency_level": "critical",
  "user_intent": "analyze_oncology_intake_and_match_trial",
  "raw_input_payload": { ... },
  "execution_constraints": {
    "max_reasoning_steps": 5,
    "enforce_strict_privacy": true
  }
}`}
          />

          <EndpointBox 
            method="GET" 
            path="/v1/orchestrate/status/{token}"
            desc="Polls the execution status or opens an operational stream for long-running DAGs."
            payload={`{
  "orchestration_token": "tk_orch_88321a99f1",
  "execution_state": "processing_step_2",
  "dag_execution_path": {
    "step_1_intent_parsing": "success",
    "step_2_graph_rag_retrieval": "running",
    "step_3_bias_and_pii_check": "pending"
  },
  "active_agent": "agent_diagnostic_synthesis"
}`}
          />
        </div>
      </div>
    </div>
  );
};

const EndpointBox = ({ method, path, desc, payload }: any) => (
  <div className="bg-white/50 border border-white/80 p-6 rounded-3xl shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <span className={cn(
        "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest text-white shadow-md",
        method === 'POST' ? "bg-emerald-500" : "bg-indigo-500"
      )}>
        {method}
      </span>
      <span className="font-mono text-sm font-bold text-indigo-950">{path}</span>
    </div>
    <p className="text-xs text-indigo-900/70 mb-6 font-medium">{desc}</p>
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <div className="flex gap-1.5 opacity-30">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
      </div>
      <pre className="bg-indigo-950 text-indigo-50 p-6 rounded-2xl overflow-x-auto font-mono text-[11px] leading-relaxed shadow-inner">
        {payload}
      </pre>
    </div>
  </div>
);

const TimelineSection = () => {
  const steps = [
    { title: "Environment Provisioning", desc: "Data Ingestion & Baseline Validation" },
    { title: "Pipeline Assembly", desc: "Core Orchestration & Graph-RAG Configuration" },
    { title: "Privacy Hardening", desc: "PII Redaction & Ethical Guardrails Validation" },
    { title: "Adversarial Testing", desc: "Red-teaming & Semantic Flow Adjustments" },
    { title: "Shadow Launch", desc: "Pilot Evaluation & Metric Benchmarking" },
    { title: "General Availability", desc: "Full Production Rollout & Telemetry Monitoring" }
  ];

  return (
    <div className="glass-panel p-8 rounded-[2.5rem] border border-indigo-100">
      <h3 className="text-lg font-black text-indigo-950 tracking-tighter uppercase font-display mb-8 flex items-center gap-3">
        <Activity className="text-pink-500" />
        Production Lifecycle
      </h3>

      <div className="relative">
        <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-pink-100 rounded-full" />
        <div className="space-y-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-full bg-white border-4 border-pink-50 flex items-center justify-center shadow-lg transform shrink-0 overflow-hidden relative group">
                <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="text-xs font-black text-pink-600">W{i * 2 + 1}</span>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 px-6 rounded-2xl border border-white/80 shadow-sm flex-1 hover:shadow-md transition-shadow">
                <div className="text-xs font-black uppercase tracking-widest text-indigo-950 mb-1">{step.title}</div>
                <div className="text-[11px] text-indigo-900/60 font-medium">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
