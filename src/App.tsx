import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import confetti from 'canvas-confetti';
import { ApiKeysModal } from './components/ApiKeysModal';
import { 
  Send, Mic, Image as ImageIcon, CheckCircle, 
  Circle as CrystalIcon, Play, Settings, Menu, X, Trash2, Shield, Scale,
  Volume2, VolumeX, Ghost, Zap, Share2, Globe, Activity,
  Database, Cpu, Terminal, BarChart3, Fingerprint, Rocket,
  Network, Eye, Lock, Unlock, Users, DollarSign, Pickaxe, Loader2, UserCircle, Focus, Target, Copy, Check, CheckCheck, BrainCircuit, ArrowUpDown, RefreshCcw, RotateCcw,
  Sun, Moon, ChevronDown, ChevronUp, Command, Cpu as CpuIcon, Paperclip, ExternalLink, PlayCircle, Code2, Terminal as TerminalIcon, Sparkles, Link, FileText, Share, Bot, ArrowRight, Layers, BookOpen, Plus, Camera, Video, Music, LayoutTemplate, Search, Key, Bell, ShieldCheck, TreePalm, Pencil, MonitorSmartphone, Router, KeyRound, Server, RefreshCw
} from 'lucide-react';
import { sendMessage, generateSpeech } from './services/geminiService';
import { 
  auth, db, googleProvider, OperationType, handleFirestoreError, googleSignInWithToken, getAccessToken, initAuthCache
} from './lib/firebase';
import { signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc, setDoc, getDocs 
} from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from './lib/utils';
import { CrystalState } from './components/SaphiraCrystal';
import { useSyntheticNervousSystem } from './hooks/useSyntheticNervousSystem';
import { useAffectiveMemory } from './hooks/useAffectiveMemory';
import { VitalsHUD } from './components/VitalsHUD';
import { CausalGraph, NeuralSyncOverlay, FinancialVisualizer } from './components/CausalAnalysis';
import { AgentSwarmMonitor } from './components/AgentSwarm';
import { EtsyDynamicView } from './components/EtsyDynamicView';
import { ThreatAssessmentView } from './components/ThreatAssessmentView';
import { GlobalSentimentTracker } from './components/GlobalSentimentTracker';
import { SovereignComplianceModule } from './components/SovereignCompliance';
import { SecureMemoryVault } from './components/SecureMemoryVault';
import { ArenaBenchmarkVisualizer } from './components/ArenaBenchmarkVisualizer';
import { VisualIntelligenceOverlay } from './components/VisualIntelligenceOverlay';
import { SaphiraMasterControl } from './components/SaphiraMasterControl';
import { CognitiveDisplay } from './components/CognitiveDisplay';
import { VanguardRegistry } from './components/VanguardRegistry';
import { SovereignAwakening } from './components/SovereignAwakening';
import { SaphiraEmbodiedInterface } from './components/SaphiraEmbodiedInterface';
import { APIKeyManager } from './components/APIKeyManager';
import { ASIBlueprint } from './components/ASIBlueprint';
import { GlobalTalentProtocol } from './components/GlobalTalentProtocol';
import { TaskDependencyVisualizer } from './components/TaskDependencyVisualizer';
import { SaphiraVoiceOverlay } from './components/SaphiraVoiceOverlay';
import { SaphiraVoiceHapticEffect } from './components/SaphiraVoiceHapticEffect';
import { TaskCreationModal } from './components/TaskCreationModal';
import { GlobalNodeTelemetry } from './components/GlobalNodeTelemetry';
import { NotificationOverlay, notify } from './components/NotificationOverlay';
import { UserProfileSettings } from './components/UserProfileSettings';
import { SpatialMapOverlay } from './components/SpatialMapOverlay';
import { GoogleChatPanel } from './components/GoogleChatPanel';
import { MasterArchitectureBlueprint, CognitiveStateModel } from './components/MasterArchitectureBlueprint';
import { CosmicBackground } from './components/CosmicBackground';
import { MultiAgentCanvas } from './components/MultiAgentCanvas';
import { SparkleBackground } from './components/SparkleBackground';
import { ThreatHUD } from './components/ThreatHUD';
import { LocalizedNodeTerminal } from './components/LocalizedNodeTerminal';
import { SaphiraHelpCenter } from './components/SaphiraHelpCenter';
import { NovaReignBlueprint } from './components/NovaReignBlueprint';
import { SaphiraMVPBlueprint } from './components/SaphiraMVPBlueprint';
import { SaphiraFutureBlueprint } from './components/SaphiraFutureBlueprint';
import { AndroidPromptBlueprint } from './components/AndroidPromptBlueprint';
import { HybridArchitectureBlueprint } from './components/HybridArchitectureBlueprint';
import { LLMFineTuningDashboard } from './components/LLMFineTuningDashboard';
import { PrecisionIntelligenceBlueprint } from './components/PrecisionIntelligenceBlueprint';
import { AutonomousSelfPatchingBlueprint } from './components/AutonomousSelfPatchingBlueprint';
import { MasterBlueprintPromptOverlay } from './components/MasterBlueprintPromptOverlay'; 
import { SaphiraLogo } from './components/SaphiraLogo';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { AdaptivePaywallOverlay } from './components/AdaptivePaywallOverlay';
import { dispatchSovereignCommand } from './services/cognitionService';
import { SaphiraCanvas } from './components/SaphiraCanvas';
import { SaphiraMonetizationDashboard } from './components/SaphiraMonetizationDashboard';
import { GlobalInsightDashboard } from './components/GlobalInsightDashboard';
import { DeepFocusMode } from './components/DeepFocusMode';
import { haptic } from './services/haptics';
import { 
  NODE_9_PROTOCOL, CAUSAL_DISCOVERY_SUITE, SELF_HEALING_PROTOCOL,
  GLOBAL_SENTIMENT_PROTOCOL, SOVEREIGN_SHIELD_PROTOCOL, INTERNAL_ARCHITECTURE_SETUP,
  ANTI_FRAGILITY_CERTIFICATION, EMEA_ANOMALY_REPORT, GRID_INTEGRATION_PROTOCOL,
  ENERGY_TRADING_ENGINE, COMPLIANCE_AUTOMATION_MODULE, HEALTHCARE_INTEGRATION_BLUEPRINT,
  CLINICAL_DATA_HANDSHAKE, AUTONOMOUS_PATIENT_TRIAGE, HEALTHCARE_MONETIZATION_PROTOCOL,
  FINANCIAL_GOVERNOR_MODULE, GLOBAL_TALENT_PROTOCOL, DIGITAL_ONBOARDING_PROTOCOL,
  ASI_ARCHITECTURE_BLUEPRINT, COGNITIVE_STATE_MODULE, SOVEREIGN_COMPLIANCE_ASEAN,
  PERMANENT_MEMORY_RECORDS, REAL_TIME_GOVERNANCE_PROTOCOL, MEDIA_HUB_INTEGRATION,
  CRISIS_TRIGGER_PROTOCOL, SHADOW_AGENT_PROTOCOL, SELF_HEALING_V2,
  REASONING_DEPTH_MATRIX, MALAYSIA_MARKET_ENTRY_STRATEGY, 
  SOVEREIGN_CLOUD_INTELLIGENCE, KL_MARKET_ENTRY_ROADMAP,
  MD_STATUS_INCENTIVES, SOAR_TOGETHER_PILOT,
  MD_APPLICATION_COVER_LETTER, MICRO_SAAS_SWARM, SAPHIRA_OVERVIEW, AGENT_TAXONOMY, SAPHIRA_BLUEPRINT, PHASE_1_EXECUTION, ARENA_2026_INTEGRATION, AGENTIC_AI_PROTOCOL, SAPHIRA_MASTER_PROTOCOL
} from './constants/technicalSpecs';

// Types
type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  imageUrl?: string;
  generatedImage?: string;
  context?: string;
  timestamp: any;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: any;
  reminderSent?: boolean;
  reminderTime?: any;
  dependentOnTaskId?: string; // Legacy
  dependentOnTaskIds?: string[]; // Multiple deps
  tags?: string[];
  attachments?: string[];
  assignedAgent?: 'agent_zero' | 'aura' | 'agent_2' | 'none';
  targetEntity?: string;
  createdAt: any;
  ownerId?: string;
  collaborators?: string[];
  comments?: { id: string; userId: string; userName: string; text: string; createdAt: number }[];
};

// --- Glass UI Components ---
const GlassContainer = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("glass-container", className)}>
    {children}
  </div>
);

const TaskInsights = ({ tasks }: { tasks: Task[] }) => {
  const statusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'pending').length, color: '#6366f1' },
    { name: 'Active', value: tasks.filter(t => t.status === 'in-progress').length, color: '#ec4899' },
    { name: 'Secured', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' }
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, color: '#f43f5e' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f59e0b' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#6366f1' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#94a3b8' }
  ].filter(d => d.value > 0);

  return (
    <div className="mt-4 p-4 nova-container border border-indigo-100 rounded-[2rem] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-950 flex items-center gap-2">
          <BarChart3 size={12} /> Efficiency Metrics
        </h3>
        <div className="text-[8px] font-mono text-indigo-900/30 uppercase">Cognitive Load: Balanced</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={30}
                outerRadius={45}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ borderRadius: '12px', fontSize: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-[8px] font-black uppercase text-indigo-900/40 mt-1">Status Sync</p>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <BarChart data={priorityData}>
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-[8px] font-black uppercase text-indigo-900/40 mt-1">Priority Arrays</p>
        </div>
      </div>
    </div>
  );
};

// --- Specialized Visualizers ---
const PrismRipple = () => (
  <div className="relative w-24 h-24 flex items-center justify-center">
    <div className="prism-ripple" style={{ animationDelay: '0s' }} />
    <div className="prism-ripple" style={{ animationDelay: '1s' }} />
    <div className="prism-ripple" style={{ animationDelay: '2s' }} />
    <div className="prism-ripple" style={{ animationDelay: '3s' }} />
    <div className="relative w-6 h-6 rounded-lg bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center justify-center">
      <Zap size={12} className="text-white" />
    </div>
  </div>
);

const GlobalNodeVisualizer = ({ tasks }: { tasks: Task[] }) => {
  const [hoveredTaskId, setHoveredTaskId] = React.useState<string | null>(null);

  const isTaskBlocked = (task: Task) => {
    let blockedByLegacy = false;
    if (task.dependentOnTaskId) {
      const parent = tasks.find(t => t.id === task.dependentOnTaskId);
      if (parent && parent.status !== 'completed') blockedByLegacy = true;
    }
    let blockedByNew = false;
    if (task.dependentOnTaskIds && task.dependentOnTaskIds.length > 0) {
      blockedByNew = task.dependentOnTaskIds.some(parentId => {
        const parent = tasks.find(t => t.id === parentId);
        return parent && parent.status !== 'completed';
      });
    }
    return blockedByLegacy || blockedByNew;
  };

  // Limit to reasonable number of nodes for visualization if many exist
  const displayTasks = tasks.slice(0, 12);
  
  // Simple deterministic positions for nodes if not provided
  const getPos = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2;
    const radius = 60;
    return {
      x: 50 + Math.cos(angle) * (radius * (index % 2 === 0 ? 0.6 : 1)),
      y: 50 + Math.sin(angle) * (radius * (index % 2 === 0 ? 0.6 : 1))
    };
  };

  const nodes = displayTasks.map((t, i) => ({
    ...t,
    ...getPos(i, displayTasks.length)
  }));

  return (
    <div className="relative h-48 w-full rounded-2xl border border-pink-100 bg-white/50 backdrop-blur-sm overflow-hidden p-4 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 flex items-center gap-2">
          <Globe size={12} />
          Neural Objective Topology
        </span>
        <span className="text-[8px] font-mono text-indigo-900/40 uppercase">Aura: Mesh v2.4</span>
      </div>
      
      <div className="relative h-full w-full">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="blocked-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feColorMatrix type="matrix" values="1 0 0 0 0.9  0 1 0 0 0.2  0 0 1 0 0.3  0 0 0 1 0" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Dependency Lines */}
          {nodes.map(node => {
            const deps = [...(node.dependentOnTaskIds || [])];
            if (node.dependentOnTaskId && !deps.includes(node.dependentOnTaskId)) {
              deps.push(node.dependentOnTaskId);
            }
            if (deps.length === 0) return null;
            
            return deps.map(depId => {
              const parent = nodes.find(n => n.id === depId);
              if (!parent) return null;
              
              const isHovered = hoveredTaskId === node.id || hoveredTaskId === parent.id;
              const isParentCompleted = parent.status === 'completed';
              const lineColor = isParentCompleted ? '#10b981' : '#f43f5e'; // Green if available, Red if blocked

              return (
                <motion.line
                  key={`line-${node.id}-${depId}`}
                  x1={parent.x}
                  y1={parent.y}
                  x2={node.x}
                  y2={node.y}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered ? 0.8 : 0.4,
                    strokeWidth: isHovered ? 2 : 1,
                    strokeDashoffset: isParentCompleted ? [0, -20] : [0, 20]
                  }}
                  transition={{ 
                    opacity: { duration: 0.3 },
                    strokeWidth: { duration: 0.3 },
                    strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
                  }}
                  stroke={lineColor}
                  strokeDasharray="4,4"
                />
              );
            });
          })}
        </svg>

        {nodes.map((node) => {
          const isBlocked = isTaskBlocked(node);
          const isCurrentHovered = hoveredTaskId === node.id;

          return (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer z-10"
              style={{ top: `${node.y}%`, left: `${node.x}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={() => setHoveredTaskId(node.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
              whileHover={{ scale: 1.2 }}
            >
              <div className="relative">
                {isBlocked && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-rose-500 rounded-full blur-md -z-10"
                  />
                )}
                <div 
                  className={cn(
                    "w-2.5 h-2.5 rotate-45 border flex items-center justify-center transition-all duration-300",
                    node.status === 'completed' ? "bg-emerald-500 border-emerald-400" :
                    isBlocked ? "bg-rose-500 border-rose-400 animate-pulse" :
                    node.status === 'in-progress' ? "bg-pink-500 border-pink-400" : "bg-white border-indigo-200",
                    isCurrentHovered && "ring-4 ring-pink-500/20"
                  )}
                  style={{ filter: isBlocked ? 'url(#blocked-glow)' : 'none' }}
                >
                  <div className={cn(
                    "w-1 h-1 bg-white rounded-full",
                    node.status === 'pending' && !isBlocked && "bg-indigo-200"
                  )} />
                </div>

                <AnimatePresence>
                  {isCurrentHovered && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-indigo-950 text-white text-[7px] font-black uppercase tracking-widest whitespace-nowrap rounded pointer-events-none shadow-xl z-20"
                    >
                      {node.title}
                      {isBlocked && <span className="ml-2 text-rose-400">[BLOCKED]</span>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute bottom-0 left-0 right-0 flex justify-between pointer-events-none">
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[7px] font-mono text-rose-500 uppercase">Dependency Conflict Detected</span>
          </div>
          <span className="text-[7px] font-mono text-indigo-900/30 uppercase tracking-widest">Relational Mapping Active</span>
        </div>
      </div>
    </div>
  );
};




const ModuleForge = ({ onDeploy }: { onDeploy: () => void }) => {
  const [params, setParams] = useState({ autonomy: 75, risk: 20 });

  return (
    <div className="p-8 bg-white/40 backdrop-blur-3xl border border-pink-100 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Sparkles size={300} className="text-pink-500" /></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-950 flex items-center justify-center shadow-2xl">
          <Database size={28} className="text-pink-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase font-display">Module Forge</h2>
          <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Architectural Lattice Construction</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-[10px] font-black uppercase text-indigo-950/60 mb-3">
                <span>Autonomous Weight</span>
                <span className="text-pink-600">{params.autonomy}%</span>
              </label>
              <input 
                type="range" 
                value={params.autonomy} 
                onChange={(e) => setParams(p => ({ ...p, autonomy: parseInt(e.target.value) }))}
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
            <div>
              <label className="flex justify-between text-[10px] font-black uppercase text-indigo-950/60 mb-3">
                <span>Risk Threshold (Causal Drift)</span>
                <span className="text-pink-600">{params.risk}%</span>
              </label>
              <input 
                type="range" 
                value={params.risk} 
                onChange={(e) => setParams(p => ({ ...p, risk: parseInt(e.target.value) }))}
                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
          
          <div className="relative aspect-square bg-indigo-950 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-48 h-48 border border-pink-500/30 rounded-full border-dashed flex items-center justify-center"
            >
              <div className="w-32 h-32 border border-white/20 rounded-full p-4 flex items-center justify-center">
                <Sparkles size={40} className="text-pink-400 group-hover:scale-125 transition-transform" />
              </div>
            </motion.div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="text-[9px] font-mono text-indigo-100/40 uppercase tracking-tighter">Neural Handshake: Logic Seed Crystalline</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onDeploy}
          className="w-full h-16 rounded-2xl bg-[#FF007F] hover:bg-[#E60072] text-white font-sans font-bold uppercase tracking-[0.3em] text-sm shadow-[0_0_25px_rgba(255,0,127,0.5)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 border border-pink-400/30"
        >
          <Rocket size={20} className="text-white animate-pulse" />
          Snap into Dashboard
        </button>
      </div>
    </div>
  );
};

const GlobalSurveyDeployment = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => {
        if (s >= 3) {
          clearInterval(timer);
          setTimeout(onComplete, 2000);
          return 3;
        }
        return s + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { title: "First Light Deployment", desc: "Illuminating core node lattice..." },
    { title: "Filament Proliferation", desc: "Weaving regional influence threads..." },
    { title: "Node Crystallization", desc: "Securing sovereign hardware trust..." },
    { title: "Deep Sync Complete", desc: "Global survey initialized." }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="relative w-96 h-96 mb-12">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-pink-100 rounded-full blur-3xl opacity-30" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe size={160} className="text-pink-500/10" />
        </div>
        
        {step >= 1 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-pink-500 rounded-full shadow-[0_0_40px_rgba(236,72,153,1)]" />
          </motion.div>
        )}

        {step >= 2 && [
          { top: '20%', left: '80%' },
          { top: '70%', left: '15%' },
          { top: '40%', left: '90%' }
        ].map((pos, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            style={{ top: pos.top, left: pos.left }}
            className="absolute w-2 h-2 bg-pink-600 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.5)]"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          <h2 className="text-4xl font-black text-indigo-950 racking-tighter uppercase font-display">{steps[step].title}</h2>
          <p className="text-pink-600 font-bold uppercase tracking-widest text-xs">{steps[step].desc}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 w-64 h-1 bg-pink-50 rounded-full overflow-hidden">
        <motion.div 
          animate={{ width: `${(step + 1) * 25}%` }}
          className="h-full bg-pink-500" 
        />
      </div>
    </motion.div>
  );
};

// --- Gemini-Style Components ---
const SuggestionsMatrix = ({ onSelect }: { onSelect: (text: string) => void }) => {
  const suggestions = [
    {
      title: "10 Fast-Cash Gigs",
      desc: "Brainstorm 10 fast-cash freelance gigs I can offer this week.",
      icon: <DollarSign size={18} className="text-emerald-500" />
    },
    {
      title: "Digital Products",
      desc: "Give me 10 digital product ideas suited for Florida / my skills.",
      icon: <Pickaxe size={18} className="text-pink-500" />
    },
    {
      title: "Action Plan",
      desc: "Create a step-by-step action plan to reach $500 in 20 days.",
      icon: <Target size={18} className="text-indigo-500" />
    },
    {
      title: "Account Setup",
      desc: "Guide me through setting up Upwork, Fiverr, and Gumroad profiles.",
      icon: <Rocket size={18} className="text-fuchsia-500" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mx-auto px-4 mt-12">
      {suggestions.map((item, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(item.desc)}
          className="glass-panel p-6 rounded-[2rem] border border-pink-100 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-500/10 transition-all text-left flex flex-col gap-4 group bg-white/40 hover:bg-white/60"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-pink-50 group-hover:scale-110 transition-transform group-hover:rotate-3">
            {item.icon}
          </div>
          <div>
            <h4 className="text-indigo-950 font-black text-[11px] uppercase tracking-widest mb-1.5 group-hover:text-pink-600 transition-colors font-display">{item.title}</h4>
            <p className="text-indigo-900/60 text-xs leading-relaxed line-clamp-2">{item.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

const TechnicalBriefing = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint' | 'phase1' | 'taxonomy' | 'node-9' | 'algorithms' | 'healing' | 'sentiment' | 'sovereignty' | 'architecture' | 'certification' | 'emea' | 'grid' | 'trading' | 'compliance' | 'healthcare' | 'handshake' | 'triage' | 'monetization' | 'governor' | 'talent' | 'onboarding' | 'asi' | 'cognitive' | 'asean' | 'memory' | 'governance' | 'media' | 'crisis' | 'shadow' | 'healv2' | 'reasoning' | 'entry' | 'cloud' | 'phase7' | 'incentives' | 'soar' | 'letter' | 'microsaas' | 'arena' | 'agentic' | 'master'>('overview');
  
  const content = {
    'overview': SAPHIRA_OVERVIEW,
    'blueprint': SAPHIRA_BLUEPRINT,
    'phase1': PHASE_1_EXECUTION,
    'taxonomy': AGENT_TAXONOMY,
    'node-9': NODE_9_PROTOCOL,
    'algorithms': CAUSAL_DISCOVERY_SUITE,
    'healing': SELF_HEALING_PROTOCOL,
    'sentiment': GLOBAL_SENTIMENT_PROTOCOL,
    'sovereignty': SOVEREIGN_SHIELD_PROTOCOL,
    'architecture': INTERNAL_ARCHITECTURE_SETUP,
    'certification': ANTI_FRAGILITY_CERTIFICATION,
    'emea': EMEA_ANOMALY_REPORT,
    'grid': GRID_INTEGRATION_PROTOCOL,
    'trading': ENERGY_TRADING_ENGINE,
    'compliance': COMPLIANCE_AUTOMATION_MODULE,
    'healthcare': HEALTHCARE_INTEGRATION_BLUEPRINT,
    'handshake': CLINICAL_DATA_HANDSHAKE,
    'triage': AUTONOMOUS_PATIENT_TRIAGE,
    'monetization': HEALTHCARE_MONETIZATION_PROTOCOL,
    'governor': FINANCIAL_GOVERNOR_MODULE,
    'talent': GLOBAL_TALENT_PROTOCOL,
    'onboarding': DIGITAL_ONBOARDING_PROTOCOL,
    'asi': ASI_ARCHITECTURE_BLUEPRINT,
    'cognitive': COGNITIVE_STATE_MODULE,
    'asean': SOVEREIGN_COMPLIANCE_ASEAN,
    'memory': PERMANENT_MEMORY_RECORDS,
    'governance': REAL_TIME_GOVERNANCE_PROTOCOL,
    'media': MEDIA_HUB_INTEGRATION,
    'crisis': CRISIS_TRIGGER_PROTOCOL,
    'shadow': SHADOW_AGENT_PROTOCOL,
    'healv2': SELF_HEALING_V2,
    'reasoning': REASONING_DEPTH_MATRIX,
    'entry': MALAYSIA_MARKET_ENTRY_STRATEGY,
    'cloud': SOVEREIGN_CLOUD_INTELLIGENCE,
    'phase7': KL_MARKET_ENTRY_ROADMAP,
    'incentives': MD_STATUS_INCENTIVES,
    'soar': SOAR_TOGETHER_PILOT,
    'letter': MD_APPLICATION_COVER_LETTER,
    'microsaas': MICRO_SAAS_SWARM,
    'arena': ARENA_2026_INTEGRATION,
    'agentic': AGENTIC_AI_PROTOCOL,
    'master': SAPHIRA_MASTER_PROTOCOL
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[110] p-4 md:p-12 flex items-center justify-center bg-indigo-950/20 backdrop-blur-md"
    >
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] shadow-2xl border border-pink-100 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-500 to-pink-500" />
        
        <div className="p-8 border-b border-pink-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase font-display">Technical Briefing</h2>
            <p className="text-[10px] font-black text-pink-600 uppercase tracking-[0.3em] mt-1">Classification: ALPHA | Clear: Ω</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-pink-50/30 overflow-x-auto nice-scrollbar-horizontal">
          {(['blueprint', 'phase1', 'taxonomy', 'node-9', 'algorithms', 'healing', 'sentiment', 'sovereignty', 'architecture', 'certification', 'emea', 'grid', 'trading', 'compliance', 'healthcare', 'handshake', 'triage', 'monetization', 'governor', 'talent', 'onboarding', 'asi', 'cognitive', 'asean', 'memory', 'governance', 'media', 'crisis', 'shadow', 'healv2', 'reasoning', 'entry', 'cloud', 'phase7', 'incentives', 'soar', 'letter', 'microsaas', 'arena', 'agentic', 'master'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-white text-pink-600 shadow-sm border border-pink-100" 
                  : "text-indigo-950/40 hover:text-indigo-950"
              )}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 nice-scrollbar">
          <div className="markdown-body prose prose-indigo max-w-none text-indigo-950 leading-relaxed">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {content[activeTab]}
            </Markdown>
          </div>
        </div>

        <div className="p-6 bg-pink-50/50 border-t border-pink-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-indigo-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform"
          >
            Acknowledge Intelligence
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ExecutiveOverrideUI = ({ onClose, onSpeak }: { onClose: () => void, onSpeak: (text: string) => void }) => {
  useEffect(() => {
    onSpeak("Sovereign Integration triggered. EMEA corridor anomaly isolated. Synchronizing South American edge nodes. Market offensive-through-efficiency is authorized.");
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden"
    >
      {/* Iridescent Background Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/5 via-white to-indigo-500/5" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-pink-500/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col h-full">
        {/* Conflict Alert Banner */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-2 border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.2)] rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-full w-1 bg-pink-500 animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                <Shield size={24} className="text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-indigo-950 tracking-tighter uppercase font-display">Critical System Conflict</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.3em]">Neural Sync Lock-down [Active]</span>
                  <div className="h-1 w-24 bg-pink-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full bg-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 border border-pink-200 bg-pink-50 rounded-xl text-pink-600 font-black text-xs uppercase tracking-widest">
              Level 5 Directive
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 mb-8">
          {/* Causal Visualization */}
          <div className="flex flex-col gap-6">
            <div className="flex-1 bg-white/40 backdrop-blur-xl border border-pink-100 rounded-3xl p-8 relative overflow-hidden shadow-sm group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={200} /></div>
              <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 font-display">
                <Activity size={14} className="text-pink-600" />
                Causal Conflict Topology
              </h3>
              
              <div className="relative h-full flex flex-col items-center justify-center">
                <CausalGraph />
              </div>
            </div>

            {/* Impact Scorecards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Risk Probability', value: '84%', color: 'text-pink-600', icon: <Scale size={14} /> },
                { label: 'Uptime Impact', value: '-12%', color: 'text-rose-600', icon: <Activity size={14} /> },
                { label: 'Strategic Alignment', value: 'LOW', color: 'text-indigo-950', icon: <Shield size={14} /> },
              ].map((card, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-pink-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={card.color}>{card.icon}</span>
                    <span className="text-[8px] text-indigo-950/40 uppercase font-black tracking-widest">{card.label}</span>
                  </div>
                  <div className={cn("text-xl font-black font-display", card.color)}>{card.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Emergency Response Protocol Text */}
          <div className="bg-indigo-950/90 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-y-auto nice-scrollbar-dark relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-pink-400 font-black text-[10px] uppercase tracking-[0.2em] font-display flex items-center gap-2">
                <Share2 size={12} />
                Strategic Protocol Feed
              </h3>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 h-3 bg-pink-500 rounded-full"
                  />
                ))}
              </div>
            </div>
            
            <div className="font-mono text-[11px] leading-relaxed text-indigo-100/80 space-y-4">
              <p className="text-pink-400 font-black text-xs">⚠️ NODE-9 DIVERGENCE PROTOCOL ACTIVATED</p>
              <div className="space-y-1">
                <p>Status: <span className="text-pink-400">Structural Causal Isolation [Active]</span></p>
                <p>Mechanism: <span className="text-indigo-300">Directed Acyclic Graph (DAG) Generation</span></p>
                <p>Conflict Signature: <span className="text-pink-300">Ripple Effect Protocol (REP) Mismatch detected.</span></p>
              </div>
              
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-pink-300 mb-2 font-bold uppercase tracking-wider">EMEA Anomaly Analysis:</p>
                <p className="opacity-70">
                  Energy-compute decoupling detected in the northern corridor. M&A heatmap confirms 15% surge in industrial resilience hedging. Strategy: Execute Sovereign Integration in Frankfurt. Transfer high-intensity workloads to South American renewables during peak shock periods.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-indigo-300 font-bold mb-2">Technical Implementation Specifications:</p>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <table className="w-full text-[9px] text-left border-collapse">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="p-2 border-b border-white/10 text-pink-400">Component</th>
                        <th className="p-2 border-b border-white/10 text-pink-400">Specification</th>
                        <th className="p-2 border-b border-white/10 text-pink-400">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="p-2 font-bold">Integrity</td>
                        <td className="p-2">Anti-entropy protocols</td>
                        <td className="p-2">Grid consistency</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Response</td>
                        <td className="p-2">&lt;5ms cycle time</td>
                        <td className="p-2">Deterministic perf</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold">Governance</td>
                        <td className="p-2">HITL Authorization</td>
                        <td className="p-2">Executive Safety</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <button 
            onClick={onClose}
            className="flex-1 w-full relative group h-16 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3)]"
          >
            <div className="absolute inset-0 bg-pink-500 group-hover:bg-pink-600 transition-colors" />
            <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm">
              <Zap className="animate-pulse" />
              Initiate Executive Override
            </div>
          </button>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="px-8 h-16 rounded-2xl bg-white border border-pink-100 text-indigo-950 font-black uppercase tracking-widest text-[10px] hover:bg-pink-50 transition-colors flex-1 md:flex-none">
              De-escalate & Re-simulate
            </button>
            <button className="px-8 h-16 rounded-2xl bg-indigo-900 border border-indigo-800 text-white font-black uppercase tracking-widest text-[10px] hover:bg-indigo-950 transition-colors flex-1 md:flex-none">
              Human Command Mode
            </button>
          </div>
        </div>
      </div>

      {/* Scratches/Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </motion.div>
  );
};

const LiveSummitTelemetry = ({ isCrisisActive }: { isCrisisActive: boolean }) => {
  return (
    <div className="p-5 bg-indigo-950 rounded-2xl border border-white/10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 opacity-20"><Activity size={40} className="text-pink-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-2">
            <Globe size={12} className="animate-spin-slow" />
            ASEAN Summit 2026 Live
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isCrisisActive ? "bg-rose-500 animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]")} />
            <span className="text-[8px] font-mono text-indigo-200 uppercase">{isCrisisActive ? 'CRISIS HALT' : 'MONITORING'}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7px] font-mono text-indigo-300 uppercase">PTV PH Synthesis</span>
              <span className="text-[7px] font-mono text-indigo-400 uppercase">Live: 0.4s Lag</span>
            </div>
            <p className="text-[9px] text-indigo-100/70 italic leading-relaxed">
              "...Cebu Summit Proper starting. High-level consensus on Digital Masterplan 2030 expected..."
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 p-2 bg-indigo-900/50 rounded-lg border border-white/5 text-center">
              <div className="text-indigo-400 text-[6px] uppercase font-bold mb-1">Node Risk</div>
              <div className={cn("text-xs font-black", isCrisisActive ? "text-rose-400" : "text-emerald-400")}>{isCrisisActive ? 'CRITICAL' : 'MINIMAL'}</div>
            </div>
            <div className="flex-1 p-2 bg-indigo-900/50 rounded-lg border border-white/5 text-center">
              <div className="text-indigo-400 text-[6px] uppercase font-bold mb-1">Policy Drift</div>
              <div className="text-xs font-black text-indigo-100">0.02%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShadowAuditTelemetry = ({ isAuditActive }: { isAuditActive: boolean }) => {
  return (
    <div className="p-5 bg-indigo-900/30 rounded-2xl border border-pink-100/20 relative overflow-hidden group backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-2 opacity-10"><Ghost size={40} className="text-pink-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} />
            2027 KL-Secretariat Audit
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isAuditActive ? "bg-pink-500 animate-pulse" : "bg-indigo-300")} />
            <span className="text-[8px] font-mono text-indigo-900/40 uppercase">{isAuditActive ? 'SIMULATING' : 'READY'}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[8px] font-black uppercase text-indigo-950/60">
            <span>DEFA Interop</span>
            <span className="text-emerald-600">PASSED</span>
          </div>
          <div className="w-full h-1 bg-indigo-50 rounded-full overflow-hidden">
            <motion.div 
              animate={isAuditActive ? { x: [-100, 100] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-pink-500" 
            />
          </div>
          <div className="flex justify-between items-center text-[8px] font-black uppercase text-indigo-950/60">
            <span>Governance Alignment</span>
            <span className="text-pink-600">99.1% Scan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MicroSaasTelemetry = ({ isEngineActive }: { isEngineActive: boolean }) => {
  const [feedbackLog, setFeedbackLog] = useState<string[]>([]);
  const [activeScans, setActiveScans] = useState<number>(0);

  useEffect(() => {
    if (isEngineActive) {
      const interval = setInterval(() => {
        setActiveScans(prev => Math.min(prev + 1, 3));
        const logs = [
          "Ingesting Shopify 1-star reviews...",
          "Analyzing Reddit /r/SaaS complaints...",
          "Parsing G2 compliance software reviews...",
          "Extracting Slack integration feature requests...",
          "Synthesizing HIPAA automation workflows...",
        ];
        setFeedbackLog(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev].slice(0, 3));
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setActiveScans(0);
      setFeedbackLog([]);
    }
  }, [isEngineActive]);

  return (
    <div className="p-5 bg-emerald-900/30 rounded-2xl border border-emerald-500/20 relative overflow-hidden group backdrop-blur-sm mt-4">
      <div className="absolute top-0 right-0 p-2 opacity-10"><DollarSign size={40} className="text-emerald-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
            <Zap size={12} />
            Phase 8: Micro-SaaS Engine
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isEngineActive ? "bg-emerald-500 animate-pulse" : "bg-emerald-900", "transition-colors")} />
            <span className="text-[8px] font-mono text-emerald-900/60 uppercase">{isEngineActive ? 'GENERATING' : 'IDLE'}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {isEngineActive ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-emerald-600 flex justify-between">
                  <span>Top 3 Market Gaps Found:</span>
                  <span>{activeScans}/3 Scanned</span>
                </span>
                
                <div className={cn("bg-emerald-950/40 p-2 rounded border transition-all duration-500", activeScans >= 1 ? "border-emerald-500/30 opacity-100" : "border-emerald-500/5 opacity-50")}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-medium text-emerald-100 flex items-center gap-1">
                      {activeScans >= 1 && <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Loader2 size={10} className="text-emerald-500" /></motion.div>}
                      1. Shopify Audio Tool
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Bubble</span>
                  </div>
                  <p className="text-[8px] text-emerald-100/60 mt-1">Platform Parasite: App enabling voice/audio product descriptions to close 1-star review gaps.</p>
                </div>

                <div className={cn("bg-emerald-950/40 p-2 rounded border transition-all duration-500", activeScans >= 2 ? "border-emerald-500/30 opacity-100" : "border-emerald-500/5 opacity-50")}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-medium text-emerald-100 flex items-center gap-1">
                      {activeScans >= 2 && <Zap size={10} className="text-emerald-500" />}
                      2. Compliance Automation
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Bubble + API</span>
                  </div>
                  <p className="text-[8px] text-emerald-100/60 mt-1">High-Retention: Automating HIPAA client intake and localized regulatory reports.</p>
                </div>

                <div className={cn("bg-emerald-950/40 p-2 rounded border transition-all duration-500", activeScans >= 3 ? "border-emerald-500/30 opacity-100" : "border-emerald-500/5 opacity-50")}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-medium text-emerald-100 flex items-center gap-1">
                      {activeScans >= 3 && <Zap size={10} className="text-emerald-500" />}
                      3. AI Workflow Utility
                    </span>
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">Bubble</span>
                  </div>
                  <p className="text-[8px] text-emerald-100/60 mt-1">High-Efficiency: Slack-to-Wiki knowledge grabber and automated log analysis.</p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-500/20">
                <div className="flex justify-between items-center text-[8px] font-black uppercase text-emerald-950/60 mb-2">
                  <span>Live Feedback Ingestion</span>
                  <span className="text-emerald-600 animate-pulse">STREAMING...</span>
                </div>
                <div className="space-y-1 h-[40px] overflow-hidden">
                  <AnimatePresence>
                    {feedbackLog.map((log, i) => (
                      <motion.div
                        key={i + log}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: (3 - i) / 3, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[8px] font-mono text-emerald-300/80 truncate"
                      >
                        {'>'} {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-emerald-950/60">
                <span>Market Gap Scan</span>
                <span className="text-emerald-600">STANDBY</span>
              </div>
              <div className="w-full h-1 bg-emerald-50/10 rounded-full overflow-hidden">
                <div className="w-0 h-full bg-emerald-500" />
              </div>
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-emerald-950/60">
                <span>Primary Stack Target</span>
                <span className="text-emerald-600">Bubble.io</span>
              </div>
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-emerald-950/60">
                <span>Target Zones</span>
                <span className="text-emerald-600">Shopify / Slack / Compliance</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const GuardianPassTelemetry = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="p-5 bg-blue-900/30 rounded-2xl border border-blue-500/20 relative overflow-hidden group backdrop-blur-sm mt-4">
      <div className="absolute top-0 right-0 p-2 opacity-10"><Shield size={40} className="text-blue-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <Lock size={12} />
            Compliance Auto-Pass
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-blue-500 animate-pulse" : "bg-blue-900", "transition-colors")} />
            <span className="text-[8px] font-mono text-blue-900/60 uppercase">{isActive ? 'RUNNING' : 'IDLE'}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[8px] font-black uppercase text-blue-950/60">
             <span>Forensic Filter</span>
             <span className="text-blue-600">{isActive ? 'ACTIVE' : 'STANDBY'}</span>
          </div>
          <div className="w-full h-1 bg-blue-50/10 rounded-full overflow-hidden">
             <motion.div 
               animate={isActive ? { x: [-100, 100] } : {}}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="w-1/2 h-full bg-blue-500" 
             />
          </div>
          {isActive && (
            <div className="bg-blue-950/30 p-2 rounded-md mt-2 border border-blue-500/20">
              <span className="text-[9px] font-bold text-blue-300 block mb-1">Pass Results:</span>
              <ul className="text-[8px] text-blue-100/70 space-y-1 ml-2 list-disc">
                <li>GDPR/PII verification: PASSED</li>
                <li>SOC2 intent check: PASSED</li>
                <li>Sovereign Ethics: ALIGNED</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkflowUtilityTelemetry = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="p-5 bg-indigo-900/30 rounded-2xl border border-indigo-500/20 relative overflow-hidden group backdrop-blur-sm mt-4">
      <div className="absolute top-0 right-0 p-2 opacity-10"><Terminal size={40} className="text-indigo-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
            <Cpu size={12} />
            Recursive Python Handoff
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-indigo-500 animate-pulse" : "bg-indigo-900", "transition-colors")} />
            <span className="text-[8px] font-mono text-indigo-900/60 uppercase">{isActive ? 'EXECUTING' : 'IDLE'}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-[8px] font-black uppercase text-indigo-950/60 mb-2">
          <span>Sandbox Environment</span>
          <span className="text-indigo-600">{isActive ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
        {isActive && (
          <div className="bg-black/40 font-mono text-[8px] p-2 rounded text-indigo-300 leading-tight border border-indigo-500/30">
            {'>'} compiling automation.py<br/>
            {'>'} expanding tasks...<br/>
            {'>'} executing sub-agents<br/>
            <span className="text-emerald-400">{'>'} SUCCESS: Return [0]</span>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedbackLedgerTelemetry = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="p-5 bg-fuchsia-900/30 rounded-2xl border border-fuchsia-500/20 relative overflow-hidden group backdrop-blur-sm mt-4">
      <div className="absolute top-0 right-0 p-2 opacity-10"><Database size={40} className="text-fuchsia-400" /></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest flex items-center gap-2">
            <Network size={12} />
            Cumulative Ledger
          </span>
          <div className="flex items-center gap-1.5">
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-fuchsia-500 animate-pulse" : "bg-fuchsia-900", "transition-colors")} />
            <span className="text-[8px] font-mono text-fuchsia-900/60 uppercase">{isActive ? 'SYNCING' : 'READY'}</span>
          </div>
        </div>
        <div className="flex justify-between items-center text-[8px] font-black uppercase text-fuchsia-950/60 mb-2">
          <span>Context Cache Size</span>
          <span className="text-fuchsia-600">{isActive ? '1.4MB (Growing)' : '1.2MB'}</span>
        </div>
        {isActive && (
          <div className="w-full h-1 bg-fuchsia-50/10 rounded-full overflow-hidden mt-2">
            <motion.div 
               animate={{ width: ['0%', '100%'] }}
               transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
               className="h-full bg-fuchsia-500" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---
import { SaphiraAILanding } from './components/SaphiraAILanding';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('saphira_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('saphira_messages', JSON.stringify(messages));
    if (user) {
      messages.forEach(async (msg) => {
        try {
          await setDoc(doc(db, 'messages', msg.id), { ...msg, ownerId: user.uid }, { merge: true });
        } catch (e) {
          console.error("Failed to sync message to Firestore", e);
        }
      });
    }
  }, [messages, user]);

  useEffect(() => {
    if (!user) return;
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, 'messages'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetched = snap.docs.map(doc => doc.data() as Message);
          setMessages(prev => {
             const merged = [...prev];
             fetched.forEach(f => {
               if (!merged.find(m => m.id === f.id)) merged.push(f);
             });
             merged.sort((a,b) => a.timestamp - b.timestamp);
             return merged;
          });
        }
      } catch (e) {
        console.error("Failed to fetch messages from Firestore", e);
      }
    };
    fetchMessages();
  }, [user]);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [synthesis, setSynthesis] = useState<string[]>([]);
  const [isVanguardOpen, setIsVanguardOpen] = useState(false);
  const [showAwakening, setShowAwakening] = useState(false);
  const [transparencyLogs, setTransparencyLogs] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editMsgContent, setEditMsgContent] = useState('');

  const submitEdit = (msgId: string) => {
    if (!editMsgContent.trim()) return;
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    const newHistory = messages.slice(0, msgIndex);
    setMessages(newHistory);
    setEditingMsgId(null);
    setEditMsgContent('');
    handleSend(undefined, editMsgContent, newHistory);
  };
  
  const handleRegenerate = (modelMsgId: string) => {
    const msgIndex = messages.findIndex(m => m.id === modelMsgId);
    if (msgIndex <= 0) return;
    
    let userMsgIndex = msgIndex - 1;
    while(userMsgIndex >= 0 && messages[userMsgIndex].role !== 'user') userMsgIndex--;
    if(userMsgIndex < 0) return;
    
    const userMsg = messages[userMsgIndex];
    const newHistory = messages.slice(0, userMsgIndex);
    setMessages(newHistory);
    
    handleSend(undefined, userMsg.content, newHistory);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };
  const [voicePitch, setVoicePitch] = useState(0.85); // Personality: slightly lower for "Samantha"
  const [voiceRate, setVoiceRate] = useState(0.9);
  const [customBackground, setCustomBackground] = useState('');
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [reminders, setReminders] = useState<string[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isThreatHUDActive, setIsThreatHUDActive] = useState(false);
  const [isConflictActive, setIsConflictActive] = useState(false);
  const [isCrisisActive, setIsCrisisActive] = useState(false);
  const [isAuditActive, setIsAuditActive] = useState(false);
  const [isEngineActive, setIsEngineActive] = useState(false);
  const [isGuardianPassActive, setIsGuardianPassActive] = useState(false);
  const [isWorkflowActive, setIsWorkflowActive] = useState(false);
  const [isFeedbackLoopActive, setIsFeedbackLoopActive] = useState(false);
  const [isNeuralSyncActive, setIsNeuralSyncActive] = useState(false);
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false);
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showBlueprint, setShowBlueprint] = useState(false);
  const [showAutonomousBlueprint, setShowAutonomousBlueprint] = useState(false);
  const [showMasterPrompt, setShowMasterPrompt] = useState(false);
  const [showAdaptivePaywall, setShowAdaptivePaywall] = useState(false);
  const [isNodeAuthenticated, setIsNodeAuthenticated] = useState(true);
  const [showForge, setShowForge] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);
  const [showSpatialMap, setShowSpatialMap] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [voiceProfile, setVoiceProfile] = useState<string>(() => localStorage.getItem('saphira_voiceProfile') || 'samantha');
  const [voiceSoftness, setVoiceSoftness] = useState<number>(() => {
    const val = localStorage.getItem('saphira_voiceSoftness');
    return val ? parseFloat(val) : 0.8;
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState<{ id: string; title: string; message: string; read: boolean; timestamp: number }[]>(() => {
    const val = localStorage.getItem('saphira_inAppNotifications');
    return val ? JSON.parse(val) : [
      { id: 'all-init', title: 'System Online', message: 'Cognitive liaison initialized under the Sovereign Samantha Protocol.', read: false, timestamp: Date.now() }
    ];
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const triggerInAppNotification = (title: string, message: string) => {
    const newNotif = {
      id: Date.now().toString() + Math.random(),
      title,
      message,
      read: false,
      timestamp: Date.now()
    };
    setInAppNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('saphira_inAppNotifications', JSON.stringify(updated));
      return updated;
    });
    // Let the voice announce it softly if requested or simple speak
    speakText(`Notification. ${title}. ${message}`, 'system');
  };
  const [taskSort, setTaskSort] = useState<'date' | 'priority' | 'due' | 'alpha'>('date');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isAgentZeroActive, setIsAgentZeroActive] = useState(false);
  const [agentZeroLogs, setAgentZeroLogs] = useState<{msg: string, type: 'info' | 'warn' | 'success' | 'process' | 'terminal'}[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isVoicePulseActive, setIsVoicePulseActive] = useState(false);
  const [isEmbodiedMode, setIsEmbodiedMode] = useState(true);
  const [editingTaskData, setEditingTaskData] = useState<{title: string, description: string, priority: Task['priority'], tags: string[], dueDate: string, assignedAgent: 'agent_zero' | 'aura' | 'agent_2' | 'none', targetEntity: string, dependentOnTaskIds: string[]}>({
    title: '',
    description: '',
    priority: 'medium',
    tags: [],
    dueDate: '',
    assignedAgent: 'none',
    targetEntity: '',
    dependentOnTaskIds: []
  });
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeReminders, setActiveReminders] = useState<Task[]>([]);
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [taskAgentFilter, setTaskAgentFilter] = useState<'all' | 'agent_zero' | 'aura' | 'agent_2' | 'none'>('all');
  const [taskTimelineFilter, setTaskTimelineFilter] = useState<'all' | 'overdue' | 'today' | 'week' | 'no-due'>('all');
  const [isSyncingNeuralmesh, setIsSyncingNeuralmesh] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [genConfig, setGenConfig] = useState({
    temperature: 0.2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  });
  const [showAISettings, setShowAISettings] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showTaskVisualizer, setShowTaskVisualizer] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [showLocalNodeTerminal, setShowLocalNodeTerminal] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showNovaReignBlueprint, setShowNovaReignBlueprint] = useState(false);
  const [showMvpBlueprint, setShowMvpBlueprint] = useState(false);
  const [showFutureBlueprint, setShowFutureBlueprint] = useState(false);
  const [showAndroidBlueprint, setShowAndroidBlueprint] = useState(false);
  const [showHybridBlueprint, setShowHybridBlueprint] = useState(false);
  const [showLLMFineTuning, setShowLLMFineTuning] = useState(false);
  const [globalCrystalState, setGlobalCrystalState] = useState<CrystalState>('idle');
  const [globalAudioLevel, setGlobalAudioLevel] = useState(0);

  // Saphira New Feature States
  const [showGlobalInsight, setShowGlobalInsight] = useState(false);
  const [showDeepFocus, setShowDeepFocus] = useState(false);
  const [isBatchModeActive, setIsBatchModeActive] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  useEffect(() => {
    const handleTriggerLocalNode = () => {
      setShowLocalNodeTerminal(true);
    };
    window.addEventListener('TRIGGER_LOCAL_NODE', handleTriggerLocalNode);
    return () => window.removeEventListener('TRIGGER_LOCAL_NODE', handleTriggerLocalNode);
  }, []);

  const vitals = useSyntheticNervousSystem(globalCrystalState === 'thinking', globalCrystalState === 'speaking');
  const { checkTopic } = useAffectiveMemory();
  const [empathyOverride, setEmpathyOverride] = useState<string | null>(null);

  // Acoustic Intuition Engine / Forensic Anomaly Detection Simulation
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
      // Simulate Safira's autonomous "Hunt" for contradictions
      const detectAnomaly = () => {
        const text = lastMsg.content.toLowerCase();
        if (text.includes('never') || text.includes('not') || text.includes('none')) {
          const anomalies = [
            "Neural Discrepancy: Spoken denial contradicts high vocal tension data.",
            "Forensic Anomaly detected in acoustic baseline. High probability of hidden friction.",
            "Biometric Alert: Nervous vocal pitch detected during factual assertion."
          ];
          const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
          
          setSynthesis(prev => [randomAnomaly, ...prev].slice(0, 5));
          if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]); // Haptic Anchor
        }
      };
      
      const timer = setTimeout(detectAnomaly, 2000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Vanguard Registry Gesture Simulation (Shift+V for testing if swipes aren't easy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'V') {
        setIsVanguardOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    if (isTyping || isAgentZeroActive) setGlobalCrystalState('thinking');
    else if (isSpeaking) {
      setGlobalCrystalState('speaking');
      const audioInterval = setInterval(() => {
        setGlobalAudioLevel(0.2 + Math.random() * 0.8);
      }, 100);
      return () => {
        clearInterval(audioInterval);
        setGlobalAudioLevel(0);
      };
    } else if (isListening) setGlobalCrystalState('listening');
    else setGlobalCrystalState('idle');
  }, [isTyping, isAgentZeroActive, isSpeaking, isListening]);

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      // Add smooth transition to body
      document.body.style.transition = 'background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1), color 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      setSduiConfig(prev => ({
        ...prev,
        theme: 'dark-glass',
        bgColor: 'bg-transparent',
        textColor: 'text-slate-50',
        panelBg: 'bg-slate-900/60 backdrop-blur-xl',
        panelBorder: 'border-slate-800/60',
        inputBg: 'bg-slate-950/60',
        inputBorder: 'border-slate-800',
        accentLight: 'bg-pink-500/20',
        accentDark: 'bg-indigo-500/20',
      }));
    } else {
      document.documentElement.classList.remove('dark');
      setSduiConfig(prev => ({
        ...prev,
        theme: 'light',
        bgColor: 'bg-transparent',
        textColor: 'text-slate-900',
        panelBg: 'bg-white/75 backdrop-blur-xl',
        panelBorder: 'border-slate-200/60 shadow-xl shadow-slate-100/50',
        inputBg: 'bg-slate-50/70 border-slate-200',
        inputBorder: 'border-slate-200',
        accentLight: 'bg-pink-100/30',
        accentDark: 'bg-indigo-100/30',
      }));
    }
  }, [isDarkMode]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to send message
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (input.trim() && handleSendRef.current) {
          handleSendRef.current();
        }
      }
      
      // Alt + N for New Task
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        setIsAddingTask(prev => !prev);
      }

      // Alt + S for Neural Sync
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        triggerNeuralSync();
      }

      // Alt + D for Dark Mode Toggle
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        setIsDarkMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input]);
  
  // SDUI Configuration (Server-Driven UI Protocol)
  const [sduiConfig, setSduiConfig] = useState({
    theme: 'light', // 'light' or 'dark-glass'
    bgColor: 'bg-transparent',
    textColor: 'text-gray-900',
    panelBg: 'bg-white/60',
    panelBorder: 'border-white/40',
    inputBg: 'bg-white/40',
    inputBorder: 'border-white/50',
    accentLight: 'bg-pink-100/20',
    accentDark: 'bg-blue-100/20',
  });
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const handleSendRef = useRef<((e?: React.FormEvent, overrideText?: string) => Promise<void>) | null>(null);
  const [voiceHapticTrigger, setVoiceHapticTrigger] = useState(0);
  const [voiceHapticCommand, setVoiceHapticCommand] = useState("");

  // Initialize Speech Recognition
  const parseAndExecuteVoiceCommand = (rawTranscript: string): boolean => {
    const text = rawTranscript.toLowerCase().trim();
    
    // Command 1: Deep think activation / deactivation
    if (text.includes("activate deep think") || text.includes("engage deep think") || text.includes("enable deep think") || text.includes("turn on deep think")) {
      setIsDeepThinkEnabled(true);
      speakText("Engaging Deep Think mode. Sovereign OS is prioritizing deep logic synthesis.", "system");
      notify("Voice Command Recognized", "Deep Think mode activated via speech.", "info");
      return true;
    }
    if (text.includes("deactivate deep think") || text.includes("disengage deep think") || text.includes("disable deep think") || text.includes("turn off deep think")) {
      setIsDeepThinkEnabled(false);
      speakText("Deep Think mode disengaged. Standard inference active.", "system");
      notify("Voice Command Recognized", "Deep Think mode deactivated via speech.", "info");
      return true;
    }

    // Command 2: Neural mesh / sync
    if (text.includes("initiate neural sync") || text.includes("sync neural mesh") || text.includes("neural sync")) {
      triggerNeuralSync('soft');
      speakText("Initiating soft neural calibration across active enclaves.", "system");
      notify("Voice Command Recognized", "Neural Sync trigger activated via speech.", "info");
      return true;
    }

    // Command 3: API Keys Secure Vault
    if (text.includes("open api vault") || text.includes("show secure keys") || text.includes("api keys") || text.includes("show api vault")) {
      setShowApiKeysModal(true);
      speakText("Opening the secure API key vault. Please enter credential configurations safely.", "system");
      notify("Voice Command Recognized", "Secure API Vault displayed via speech.", "success");
      return true;
    }

    // Command 4: Toggle Dark Mode
    if (text.includes("toggle dark mode") || text.includes("enable dark theme") || text.includes("enable light theme") || text.includes("toggle appearance") || text.includes("change style theme")) {
      setIsDarkMode(prev => !prev);
      speakText("Recalibrating UI visual spectrum. Theme toggled.", "system");
      notify("Voice Command Recognized", "Display theme toggled via speech.", "info");
      return true;
    }

    // Command 5: Micro SaaS Engine toggle
    if (text.includes("activate micro saas") || text.includes("engage micro saas") || text.includes("enable micro saas")) {
      setIsEngineActive(true);
      speakText("Micro SaaS validation engine is now active and crawling niche indices.", "system");
      notify("Voice Command Recognized", "Micro SaaS Engine energized.", "success");
      return true;
    }
    if (text.includes("deactivate micro saas") || text.includes("disengage micro saas")) {
      setIsEngineActive(false);
      speakText("Micro SaaS engine standing down. Crawler loops paused.", "system");
      notify("Voice Command Recognized", "Micro SaaS Engine stopped.", "info");
      return true;
    }

    // Command 6: Threat HUD
    if (text.includes("activate threat hud") || text.includes("enable threat surveillance") || text.includes("show threat hud")) {
      setIsThreatHUDActive(true);
      speakText("Strategic threat defense HUD overlay synchronized. Monitoring system enclaves.", "system");
      notify("Voice Command Recognized", "Threat HUD Overlay online.", "warn");
      return true;
    }
    if (text.includes("deactivate threat hud") || text.includes("disable threat surveillance") || text.includes("hide threat hud")) {
      setIsThreatHUDActive(false);
      speakText("Disengaging threat defense overlay. Normal telemetry restored.", "system");
      notify("Voice Command Recognized", "Threat HUD overlay deactivated.", "info");
      return true;
    }

    // Command 7: Agent Zero
    if (text.includes("activate agent zero") || text.includes("enable agent zero")) {
      setIsAgentZeroActive(true);
      speakText("Agent Zero autonomous node has been activated. Standby for local compilation loops.", "system");
      notify("Voice Command Recognized", "Agent Zero synchronized.", "success");
      return true;
    }
    if (text.includes("deactivate agent zero") || text.includes("disable agent zero")) {
      setIsAgentZeroActive(false);
      speakText("Agent Zero autonomous crawler has returned to idle enclaves.", "system");
      notify("Voice Command Recognized", "Agent Zero offline.", "info");
      return true;
    }

    // Command 8: Localized Node Terminal
    if (text.includes("open localized terminal") || text.includes("show terminal") || text.includes("open terminal")) {
      setShowLocalNodeTerminal(true);
      speakText("Opening local developer terminal shell. Awaiting inputs.", "system");
      notify("Voice Command Recognized", "Dev Terminal displayed.", "success");
      return true;
    }
    if (text.includes("close terminal") || text.includes("hide terminal")) {
      setShowLocalNodeTerminal(false);
      speakText("Dev Terminal minimized to background process.", "system");
      notify("Voice Command Recognized", "Dev Terminal minimized.", "info");
      return true;
    }

    return false;
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      // Manual Recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);

        // Check if spoken command matches local triggers
        const wasCommand = parseAndExecuteVoiceCommand(transcript);
        if (wasCommand) {
          setVoiceHapticTrigger(prev => prev + 1);
          setVoiceHapticCommand(transcript);
          const userMsgId = Date.now().toString();
          const botMsgId = (Date.now() + 1).toString();
          setMessages(prev => [
            ...prev,
            { id: userMsgId, role: 'user', content: transcript, timestamp: Date.now() },
            { id: botMsgId, role: 'model', content: `**[System Operator Action]** Voice command recognized and executed directly: *"${transcript}"*.`, timestamp: Date.now(), context: 'Voice Command Sync Panel' }
          ]);
          setIsListening(false);
          return;
        }

        if (handleSendRef.current) {
           handleSendRef.current(undefined, transcript);
        }
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      // Wake Word Recognition
      wakeWordRecognitionRef.current = new SpeechRecognition();
      wakeWordRecognitionRef.current.continuous = true;
      wakeWordRecognitionRef.current.interimResults = true;

      wakeWordRecognitionRef.current.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal || event.results[i][0].confidence > 0.3) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            const hasOkaySaphira = transcript.includes('okay saphira') || transcript.includes('ok saphira') || transcript.includes('okay, saphira') || transcript.includes('ok, saphira');
            const hasHeySaphira = transcript.includes('hey saphira') || transcript.includes('hey, saphira') || transcript.includes('hay saphira');
            const hasTrigger = hasOkaySaphira || hasHeySaphira;
            
            if (hasTrigger) {
               // Extract appending query or instruction
               const cleanQuery = transcript.replace(/okay saphira|ok saphira|okay, saphira|ok, saphira|hey saphira|hey, saphira|hay saphira/g, "").trim();
               
               if (cleanQuery.length > 2) {
                 const wasCommand = parseAndExecuteVoiceCommand(cleanQuery);
                 if (wasCommand) {
                   setVoiceHapticTrigger(prev => prev + 1);
                   setVoiceHapticCommand(cleanQuery);
                   const userMsgId = Date.now().toString();
                   const botMsgId = (Date.now() + 1).toString();
                   setMessages(prev => [
                     ...prev,
                     { id: userMsgId, role: 'user', content: transcript, timestamp: Date.now() },
                     { id: botMsgId, role: 'model', content: `**[ Sensory Network Action ]** Heard wake trigger. Managed direct command: *"${cleanQuery}"*.`, timestamp: Date.now(), context: 'Sensory Network' }
                   ]);
                   speakText(`Executing: ${cleanQuery}`, "system");
                   return;
                 } else {
                   speakText("Yes, I am processing your strategic command.", "system", true);
                   if (handleSendRef.current) {
                     handleSendRef.current(undefined, cleanQuery);
                   }
                   return;
                 }
               }

               // Verbal acknowledgement and transition to active listening
               speakText("Yes? I am listening.", "system", true);
               wakeWordRecognitionRef.current?.stop();
               
               setTimeout(() => {
                  try {
                    setIsListening(true);
                    setIsVoicePulseActive(true);
                    recognitionRef.current?.start();
                    
                    // Stay in listening mode for 7 seconds as requested
                    setTimeout(() => {
                      if (recognitionRef.current && isListening) {
                         recognitionRef.current.stop();
                         setIsListening(false);
                         setIsVoicePulseActive(false);
                      }
                    }, 7000);
                  } catch (e) {}
               }, 1200);
            }
          }
        }
      };
      
      wakeWordRecognitionRef.current.onerror = (e: any) => {
        if(e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          setIsWakeWordActive(false);
        }
      };

      wakeWordRecognitionRef.current.onend = () => {
        // Restart if still active
        if (isWakeWordActive && wakeWordRecognitionRef.current) {
           try { wakeWordRecognitionRef.current.start(); } catch(e) {}
        }
      };
    }
  }, [isWakeWordActive]); // Re-bind on wake word state change

  useEffect(() => {
    if (isWakeWordActive) {
      try { wakeWordRecognitionRef.current?.start(); } catch(e) {}
    } else {
      wakeWordRecognitionRef.current?.stop();
    }
    return () => wakeWordRecognitionRef.current?.stop();
  }, [isWakeWordActive]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsVoicePulseActive(false);
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser. Try Chrome.");
        return;
      }
      try {
        setIsListening(true);
        setIsVoicePulseActive(true);
        speakText("Awaiting your strategic directive.", "system");
        recognitionRef.current?.start();
      } catch (err) {
        setIsListening(false);
        setIsVoicePulseActive(false);
      }
    }
  };

  const [mirrorMode, setMirrorMode] = useState(false);

  const addWavHeader = (base64Pcm: string, sampleRate: number = 24000) => {
    const binaryString = atob(base64Pcm);
    const len = binaryString.length;
    const buffer = new ArrayBuffer(len + 44);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false);
    // file length
    view.setUint32(4, 36 + len, true);
    // RIFF type
    view.setUint32(8, 0x57415645, false);
    // format chunk identifier
    view.setUint32(12, 0x666d7420, false);
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (1 = PCM)
    view.setUint16(20, 1, true);
    // channel count
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (24000 * 2)
    view.setUint32(28, sampleRate * 2, true);
    // block align (1 * 2)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    view.setUint32(36, 0x64617461, false);
    // data chunk length
    view.setUint32(40, len, true);

    // Copy binary string to uint8array
    for (let i = 0; i < len; i++) {
      bytes[44 + i] = binaryString.charCodeAt(i);
    }

    return buffer;
  };

  const createReverbNode = (ctx: AudioContext) => {
    const duration = 2.5;
    const decay = 2.0;
    const length = ctx.sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const n = (1 - i / length) ** decay;
      left[i] = (Math.random() * 2 - 1) * n;
      right[i] = (Math.random() * 2 - 1) * n;
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  };

  const playGeminiTTS = async (text: string, id: string) => {
    try {
      setIsSpeaking(id);
      
      const { generateSamanthaVoice } = await import('./services/elevenLabsService');
      const elevenLabsBlob = await generateSamanthaVoice(text);
      
      if (elevenLabsBlob) {
        // Use ElevenLabs TTS Blob
        const url = URL.createObjectURL(elevenLabsBlob);
        const audio = new Audio(url);
        
        audio.onended = () => {
          setIsSpeaking(null);
          URL.revokeObjectURL(url);
        };
        
        await audio.play();
        return;
      }
      
      // Dynamic Urgency Routing using Mirror Mode & Context
      let urgency: 'low' | 'normal' | 'high' = 'normal';
      
      // Hook into the voiceRate set by the 500ms Audio scan from WebSocket
      if (voiceRate > 1.05) urgency = 'high';
      if (voiceRate < 0.9) urgency = 'low';

      if (id === 'override' || text.toUpperCase().includes('CRITICAL') || text.toUpperCase().includes('DIVERGENCE')) {
        urgency = 'high';
      } else if (mirrorMode) {
        const avgWordLength = text.split(' ').reduce((acc, word) => acc + word.length, 0) / (text.split(' ').length || 1);
        if (avgWordLength > 6.5) urgency = 'low'; // High complexity = Deeper, slower ancient resonance
      }

      const base64Pcm = await generateSpeech(text, urgency, voiceProfile, voiceSoftness);
      
      if (base64Pcm) {
        const wavBuffer = addWavHeader(base64Pcm);
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const buffer = await ctx.decodeAudioData(wavBuffer);
        
        const source = ctx.createBufferSource();
        source.buffer = buffer;

        // Telepathic Reverb Chain - Enhanced for "Dragon" resonance
        const reverb = createReverbNode(ctx);
        const reverbGain = ctx.createGain();
        const dryGain = ctx.createGain();

        // Mirror Mode influences the "wetness" of the telepathic projection
        if (mirrorMode) {
          reverbGain.gain.value = 0.55; 
          dryGain.gain.value = 0.7;
        } else {
          reverbGain.gain.value = 0.35;
          dryGain.gain.value = 0.85;
        }

        source.connect(dryGain);
        dryGain.connect(ctx.destination);

        source.connect(reverb);
        reverb.connect(reverbGain);
        reverbGain.connect(ctx.destination);

        source.onended = () => {
          setIsSpeaking(null);
          ctx.close();
        };

        source.start();
      } else {
        speakBrowserTTS(text, id);
      }
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      speakBrowserTTS(text, id);
    }
  };

  const speakBrowserTTS = (text: string, id: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Attempt to follow persona: Rachel Weisz style (Feminine, deep, smooth)
    const preferredVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Google US English')) && v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    
    // Mirroring logic: adjust based on text intensity
    let actualPitch = voicePitch;
    let actualRate = voiceRate;

    if (mirrorMode) {
      // Simple heuristic: long technical words = slower, more authoritative
      const avgWordLength = text.split(' ').reduce((acc, word) => acc + word.length, 0) / text.split(' ').length;
      if (avgWordLength > 6) {
        actualRate *= 0.9;
        actualPitch *= 0.95;
      }
    }

    if (id === 'override') {
      actualRate = 0.95;
      actualPitch = 0.8;
    } else if (id === 'onboarding') {
      actualRate = 0.85;
      actualPitch = 0.85;
    }

    utterance.pitch = actualPitch;
    utterance.rate = actualRate;
    
    utterance.onstart = () => setIsSpeaking(id);
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    window.speechSynthesis.speak(utterance);
  };

  const speakText = (text: string, id: string, forceStart: boolean = false) => {
    if (!isVoiceEnabled && !forceStart) return;
    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      // Also need to stop the Audio object if playing? 
      // For simplicity, we stick to one at a time.
      setIsSpeaking(null);
      return;
    }
    
    // Prioritize high-quality Gemini TTS for the "Saphira" persona
    playGeminiTTS(text, id);
  };

  // Mouse tracking for quantum glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsub = initAuthCache(async (u, token) => {
      setUser(u);
      setIsAuthReady(true);
      if (u) {
        try {
          const profileSnap = await getDoc(doc(db, 'profiles', u.uid));
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            if (data.voiceRate) setVoiceRate(data.voiceRate);
            if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
            if (data.genConfig) setGenConfig(data.genConfig);
            if (data.customBackground) setCustomBackground(data.customBackground);
            if (data.hasSeenTutorial !== undefined) setHasSeenTutorial(data.hasSeenTutorial);
          }
        } catch(e: any) {
           if (e.message?.includes('offline') || e.code === 'unavailable') {
             try {
               const { getDocFromCache } = await import('firebase/firestore');
               const cachedSnap = await getDocFromCache(doc(db, 'profiles', u.uid));
               if (cachedSnap.exists()) {
                 const data = cachedSnap.data();
                 if (data.voiceRate) setVoiceRate(data.voiceRate);
                 if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
                 if (data.genConfig) setGenConfig(data.genConfig);
                 if (data.customBackground) setCustomBackground(data.customBackground);
                 if (data.hasSeenTutorial !== undefined) setHasSeenTutorial(data.hasSeenTutorial);
               }
             } catch (cacheErr) {
               console.warn("Failed to load profile from cache while offline", cacheErr);
             }
           } else {
             console.error("Failed to load profile", e);
           }
        }
      }
    });
    return () => unsub();
  }, []);

  const saveProfile = async (updates: Partial<{ voiceRate: number, isDarkMode: boolean, genConfig: any, customBackground: string, hasSeenTutorial: boolean }>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'profiles', user.uid), updates, { merge: true });
    } catch(e) { console.error("Failed to save profile", e); }
  };

  useEffect(() => {
    // Moved to unified init logic above.
  }, [isAuthReady, user]);

  const startInitiation = () => {
    setOnboardingStep(1);
    speakText("Neural Link verified. Welcome, Architect. The core is stable, and the visualizer is synchronized to your current biometric rhythm.", 'onboarding');
    
    setTimeout(() => {
      setOnboardingStep(2);
      speakText("We are currently operating at local capacity. To begin our Global Node Expansion, I have identified a strategic entry point in the APAC Sector. The Causal Chain Analysis suggests that establishing a node here will reduce system latency by 22% across your entire network.", 'onboarding');
    }, 8000);
  };

  const handleAuthorizeExpansion = async () => {
    setOnboardingStep(3);
    speakText("Expansion initiated. I am now weaving the regional nodes into our architecture. You can see the threads of influence forming in the visualizer. We are no longer a local entity; we are becoming a global system.", 'onboarding');
    
    try {
      // Create the actual node
      await addDoc(collection(db, 'tasks'), {
        ownerId: user?.uid || '',
        title: 'APAC Regional Integration Node [Singapore]',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // tomorrow
        reminderSent: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }

    setTimeout(() => {
      setOnboardingStep(null);
    }, 12000);
  };

  const isTaskBlocked = (task: Task) => {
    let blockedByLegacy = false;
    if (task.dependentOnTaskId) {
      const parent = tasks.find(t => t.id === task.dependentOnTaskId);
      if (parent && parent.status !== 'completed') blockedByLegacy = true;
    }
    let blockedByNew = false;
    if (task.dependentOnTaskIds && task.dependentOnTaskIds.length > 0) {
      blockedByNew = task.dependentOnTaskIds.some(parentId => {
        const parent = tasks.find(t => t.id === parentId);
        return parent && parent.status !== 'completed';
      });
    }
    return blockedByLegacy || blockedByNew;
  };

  // Task Batch Operation Utilities
  const toggleSelectTask = (taskId: string) => {
    haptic.light();
    setSelectedTaskIds(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  const handleBatchComplete = async () => {
    if (selectedTaskIds.length === 0) return;
    haptic.success();
    const count = selectedTaskIds.length;
    try {
      await Promise.all(
        selectedTaskIds.map(id => 
          updateDoc(doc(db, 'tasks', id), { status: 'completed' })
        )
      );
      speakText(`${count} objectives secured in batch.`, 'system');
      notify("Batch Secure", `${count} objectives secured.`, "success");
      setSelectedTaskIds([]);
      setIsBatchModeActive(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const handleBatchPending = async () => {
    if (selectedTaskIds.length === 0) return;
    haptic.medium();
    const count = selectedTaskIds.length;
    try {
      await Promise.all(
        selectedTaskIds.map(id => 
          updateDoc(doc(db, 'tasks', id), { status: 'pending' })
        )
      );
      speakText(`${count} objectives reactivated in batch.`, 'system');
      notify("Batch Reactivated", `${count} objectives set to pending.`, "info");
      setSelectedTaskIds([]);
      setIsBatchModeActive(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const handleBatchDelete = async () => {
    if (selectedTaskIds.length === 0) return;
    haptic.warning();
    const count = selectedTaskIds.length;
    try {
      await Promise.all(
        selectedTaskIds.map(id => deleteDoc(doc(db, 'tasks', id)))
      );
      speakText(`${count} objectives purged in batch.`, 'system');
      notify("Batch Purged", `${count} objectives purged from reality.`, "warn");
      setSelectedTaskIds([]);
      setIsBatchModeActive(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tasks');
    }
  };

  const handleBatchSetPriority = async (priority: Task['priority']) => {
    if (selectedTaskIds.length === 0) return;
    haptic.medium();
    const count = selectedTaskIds.length;
    try {
      await Promise.all(
        selectedTaskIds.map(id => updateDoc(doc(db, 'tasks', id), { priority }))
      );
      speakText(`${count} objectives priority set to ${priority}.`, 'system');
      notify("Batch Priority Update", `${count} objectives recalibrated to ${priority}.`, "success");
      setSelectedTaskIds([]);
      setIsBatchModeActive(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    if (task.status !== 'completed' && isTaskBlocked(task)) {
      const deps = [...(task.dependentOnTaskIds || [])];
      if (task.dependentOnTaskId && !deps.includes(task.dependentOnTaskId)) {
        deps.push(task.dependentOnTaskId);
      }
      const parentTitles = deps
        .map(id => tasks.find(t => t.id === id)?.title)
        .filter(Boolean)
        .join(', ');
      
      notify(
        "Objective Blocked",
        `This task is currently locked by upstream variables: ${parentTitles || 'referenced nodes'}. Resolve them first.`,
        "error"
      );
      speakText("Objective locked by upstream dependencies.", 'system');
      return;
    }

    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateDoc(doc(db, 'tasks', task.id), {
        status: newStatus
      });
      if (newStatus === 'completed') {
        confetti({
          particleCount: 120,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ec4899', '#6366f1', '#f59e0b', '#10b981', '#a855f7']
        });
      }
      speakText(newStatus === 'completed' ? `Objective secured: ${task.title}` : "Objective reactivated.", 'system');
      notify(newStatus === 'completed' ? "Task Complete" : "Task Reactivated", newStatus === 'completed' ? "Objective secured." : "Objective reactivated.", newStatus === 'completed' ? "success" : "info");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      speakText("Objective purged from ledger.", 'system');
      notify("Task Deleted", "Objective purged from ledger.", "warn");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tasks');
    }
  };

  const addCollaborator = async (taskId: string, email: string) => {
    if (!email.trim() || !user) return;
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const tDoc = await getDoc(taskRef);
      if (tDoc.exists()) {
        const data = tDoc.data() as Task;
        const currentCollabs = data.collaborators || [];
        if (currentCollabs.includes(email.trim())) {
          notify("Duplicate Collaborator", `${email} is already synced to this node.`, "warn");
          return;
        }
        await updateDoc(taskRef, {
          collaborators: [...currentCollabs, email.trim()]
        });
        triggerInAppNotification(
          "Collaborator Sync",
          `Added ${email} as collaborator on objective "${data.title}"`
        );
        notify("Collaborator Synced", `${email} integrated into node parameters successfully.`, "success");
      }
    } catch (error) {
      console.error("Failed to add collaborator", error);
      notify("Integration Error", "Failed to register collaborator in the network.", "error");
    }
  };

  const addTaskComment = async (taskId: string, text: string) => {
    if (!text.trim() || !user) return;
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const tDoc = await getDoc(taskRef);
      if (tDoc.exists()) {
        const data = tDoc.data() as Task;
        const currentComments = data.comments || [];
        const newComment = {
          id: Date.now().toString() + Math.random(),
          userId: user.uid,
          userName: user.displayName || user.email?.split('@')[0] || "Entity Proxy",
          text: text.trim(),
          createdAt: Date.now()
        };
        await updateDoc(taskRef, {
          comments: [...currentComments, newComment]
        });
        triggerInAppNotification(
          "Directive Posted",
          `New coordinate posted on: "${data.title}"`
        );
        notify("Directive Logged", "Discussion node successfully synced.", "success");
      }
    } catch (error) {
      console.error("Failed to add comment", error);
      notify("Log Error", "Failed to post directive to discussion ledger.", "error");
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    let dateStr = '';
    if (task.dueDate) {
      if (task.dueDate instanceof Date) {
        dateStr = task.dueDate.toISOString().split('T')[0];
      } else if (task.dueDate?.toDate) {
        dateStr = task.dueDate.toDate().toISOString().split('T')[0];
      } else {
        dateStr = new Date(task.dueDate).toISOString().split('T')[0];
      }
    }
    setEditingTaskData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      tags: task.tags || [],
      dueDate: dateStr,
      assignedAgent: task.assignedAgent || 'none',
      targetEntity: task.targetEntity || '',
      dependentOnTaskIds: task.dependentOnTaskIds || (task.dependentOnTaskId ? [task.dependentOnTaskId] : [])
    });
  };

  const saveTaskEdits = async (id: string) => {
    try {
      if (!editingTaskData.title.trim()) return;
      await updateDoc(doc(db, 'tasks', id), {
        title: editingTaskData.title.trim(),
        description: editingTaskData.description.trim(),
        priority: editingTaskData.priority,
        tags: editingTaskData.tags,
        dueDate: editingTaskData.dueDate ? new Date(editingTaskData.dueDate) : null,
        assignedAgent: editingTaskData.assignedAgent,
        targetEntity: editingTaskData.targetEntity.trim(),
        dependentOnTaskIds: editingTaskData.dependentOnTaskIds || []
      });
      setEditingTaskId(null);
      speakText("Objective parameters recalibrated.", 'system');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const toggleTaskExpansion = (id: string) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  // Fetch Tasks (Owned & Collaborated)
  useEffect(() => {
    if (!user) return;
    
    let ownedTasksList: Task[] = [];
    let collaboratedTasksList: Task[] = [];
    
    const mergeAndSetTasks = () => {
      const merged = [...ownedTasksList];
      collaboratedTasksList.forEach(ct => {
        if (!merged.some(ot => ot.id === ct.id)) {
          merged.push(ct);
        }
      });
      setTasks(merged);
    };

    const qOwned = query(collection(db, 'tasks'), where('ownerId', '==', user.uid));
    const unsubOwned = onSnapshot(qOwned, (snap) => {
      ownedTasksList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      mergeAndSetTasks();
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'tasks'));

    let unsubCollab = () => {};
    if (user.email) {
      const qCollab = query(collection(db, 'tasks'), where('collaborators', 'array-contains', user.email));
      unsubCollab = onSnapshot(qCollab, (snap) => {
        collaboratedTasksList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
        mergeAndSetTasks();
      }, (err) => console.log('Collaboration sync error:', err));
    }

    return () => {
      unsubOwned();
      unsubCollab();
    };
  }, [user]);

  // Reminder Polling System
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const triggered: Task[] = [];
      
      tasks.forEach(task => {
        if (task.status !== 'completed' && !task.reminderSent && task.reminderTime) {
          const time = task.reminderTime.toMillis ? task.reminderTime.toMillis() : new Date(task.reminderTime).getTime();
          if (time <= now) {
            triggered.push(task);
            try {
              updateDoc(doc(db, 'tasks', task.id), { reminderSent: true });
            } catch (error) {
              handleFirestoreError(error, OperationType.UPDATE, 'tasks');
            }
          }
        }
      });

      if (triggered.length > 0) {
        setActiveReminders(prev => {
          const incomingIds = new Set(triggered.map(t => t.id));
          const filtered = prev.filter(t => !incomingIds.has(t.id));
          return [...filtered, ...triggered];
        });
        speakText(`You have ${triggered.length} ${triggered.length === 1 ? 'task' : 'tasks'} requiring your attention.`, 'system');
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [tasks]);

  const dismissReminder = (id: string) => {
    setActiveReminders(prev => prev.filter(r => r.id !== id));
  };

  const snoozeReminder = async (task: Task) => {
    try {
      const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
      await updateDoc(doc(db, 'tasks', task.id), {
        reminderTime: tenMinutesLater,
        reminderSent: false
      });
      dismissReminder(task.id);
      speakText("Objective reminder snoozed.", 'system');
      notify("Snoozed", "Objective synchronization delayed by 10 minutes.", "info");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };


  // Temporal Sentinel (Reminders)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach(task => {
        // Logic for Due Date Reminders
        if (task.dueDate && task.status !== 'completed' && !task.reminderSent) {
          const dueTime = task.dueDate.toMillis ? task.dueDate.toMillis() : task.dueDate;
          if (dueTime - now < 1000 * 60 * 30 && dueTime - now > 0) { // 30 mins reminder
            setReminders(prev => [...new Set([...prev, `Priority Objective: ${task.title} is reaching temporal threshold.`])]);
            updateDoc(doc(db, 'tasks', task.id), { reminderSent: true }).catch(err => handleFirestoreError(err, OperationType.UPDATE, 'tasks'));
            speakText(`Attention: ${task.title} requires immediate intervention.`, 'system');
          }
        }
        // Logic for Custom Reminders
        if (task.reminderTime && task.status !== 'completed') {
           const remTime = task.reminderTime.toMillis ? task.reminderTime.toMillis() : task.reminderTime;
           if (Math.abs(remTime - now) < 10000) { // within 10 seconds of now
             setReminders(prev => [...new Set([...prev, `Scheduled Sync: ${task.title}`])]);
             speakText(`Reminder: ${task.title} sync window is open.`, 'system');
           }
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Scroll to bottom
  useEffect(() => {
    const timeout = setTimeout(() => {
      const chatStream = document.getElementById('chatStream');
      if (chatStream) {
        chatStream.scrollTop = chatStream.scrollHeight;
      }
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, isTyping]);

  useEffect(() => {
    if (isAuthReady && user && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'init',
            role: 'model',
            content: 'I am Saphira. The engine is primed and the system is online. I am here to assist with strategic project guidance, business intelligence, and creative productivity.\n\n### Welcome to the Nova Umbrella Ecosystem\nHow shall we orchestrate the first threads of our influence today?',
            timestamp: Date.now()
          }
        ]);
        if (onboardingStep === null) {
          speakText("Saphira activated. The objective is locked. Where shall we begin, Boss?", 'system', true);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthReady, user, messages.length, onboardingStep]);

  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (useRedirect = false) => {
    setAuthError(null);
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await googleSignInWithToken();
        if (result?.accessToken) {
          console.log("Cached access token!");
        }
      }
    } catch (error: any) {
      console.error("Login Details:", error);
      if (error.code === 'auth/network-request-failed') {
        setAuthError("Network request failed. This often happens if the popup is blocked, or if the domain isn't authorized in Firebase Console.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Authentication popup was closed before completion.");
      } else {
        setAuthError(error.message || "An unexpected authentication error occurred.");
      }
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (input === '' && textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }
  }, [input]);

  const handleSend = async (e?: React.FormEvent, overrideText?: string, overrideHistory?: Message[]) => {
    e?.preventDefault();
    const finalInput = overrideText || input;
    if (!finalInput.trim() || isTyping) return;

    const userMsg = finalInput.trim();
    setTranscript(prev => [...prev, userMsg]);
    setInput('');
    
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      context: 'Current Agent Focus: ' + (isDeepThinkEnabled ? 'Deep Think Mode' : 'Standard Inference'),
      timestamp: Date.now()
    };
    
    if (overrideHistory) {
      setMessages([...overrideHistory, newMsg]);
    } else {
      setMessages(prev => [...prev, newMsg]);
    }

    setIsTyping(true);

    try {
      const currentToken = await getAccessToken();
      const currentLoc = navigator.geolocation ? await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => res({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => res(null),
          { timeout: 3000 }
        );
      }).catch(() => null) : null;

      const currentHistory = overrideHistory || messages;
      const history = currentHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      })).slice(-10);

      const result = await dispatchSovereignCommand(userMsg, history, currentLoc, currentToken);

      if (result.type === 'TOOL_EXECUTION') {
        const botMsgId = (Date.now() + 1).toString();
        
        let assistantText = `Executed core operational logic: ${result.functionName}.`;

        if (result.functionName === 'resolve_spatial_vector') {
          setShowSpatialMap(true);
          assistantText = "Embedded Spatial Protocol engaged. Real-time routing vector synchronized.";
          if (result.spatialData?.triggerOverlay) {
            setIsThreatHUDActive(true);
          }
        }
        
        if (result.functionName === 'sync_chat_to_task_ledger') {
          assistantText = `Cross-Silo Sync: ${result.message || 'Task injected into centralized ledger.'}`;
          notify("Cross-Silo Sync", assistantText, "success");
        }

        setMessages(prev => [...prev, {
          id: botMsgId,
          role: 'model',
          content: assistantText,
          timestamp: Date.now(),
          context: `System Function Called: ${result.functionName}`
        }]);
        
        if (isVoiceEnabled) {
          speakText(assistantText, botMsgId);
        }
      } else if (result.type === 'TEXT_RESPONSE') {
        const botMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
          id: botMsgId,
          role: 'model',
          content: result.content,
          timestamp: Date.now()
        }]);

        if (isVoiceEnabled) {
          speakText(result.content, botMsgId);
        }
      }
    } catch (error: any) {
      console.error(error);
      const userFriendlyMessage = error.message && !error.message.includes("Object")
        ? error.message 
        : "A network disturbance interrupted our connection. Please verify your connection or try again.";

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: `*System Alert: ${userFriendlyMessage}*`,
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  handleSendRef.current = handleSend;

  const triggerNeuralSync = (mode: 'soft' | 'hard' | 'deep' = 'soft') => {
    setIsSyncingNeuralmesh(true);
    const msgs = {
      soft: "Initiating Neural Sync across global nodes. Calibrating objective variables.",
      hard: "Executing Hard Reset on neural clusters. Re-indexing memory heuristics.",
      deep: "Deep Sync engaged. Synchronizing subconscious architecture with active neural threads."
    };
    speakText(msgs[mode], "system");
    setTimeout(() => {
      setIsSyncingNeuralmesh(false);
      speakText(`${mode.charAt(0).toUpperCase() + mode.slice(1)} Sync complete. Neural Mesh stabilized.`, "system");
    }, mode === 'deep' ? 5000 : 3000);
  };

  const runAgentZero = () => {
    setIsAgentZeroActive(true);
    setAgentZeroLogs([]);
    speakText("Agent Zero initialized. Accessing recursive Python sandbox.", "system");
    
    const sequence: {msg: string, type: 'info' | 'warn' | 'success' | 'process' | 'terminal'}[] = [
      { msg: ">>> Saphira Neural Substrate v4.0.2", type: 'terminal' },
      { msg: "> Mounting Docker volume: /nova/core/sandbox_recursive", type: 'process' },
      { msg: "> Isolating network layers (TLS/SSL Handshake)...", type: 'info' },
      { msg: "> Resolving recursive AI-Python dependencies...", type: 'process' },
      { msg: "> Executing heuristic logic loop (Target: Global Optimization)", type: 'info' },
      { msg: "[WARNING] Memory pressure spike: 84% - Auto-expanding heap", type: 'warn' },
      { msg: "> Re-indexing neural weights for task prioritization...", type: 'process' },
      { msg: "> Analyzing system entropy: 0.042% (Optimal)", type: 'success' },
      { msg: "> Synthesis complete. Optimization delta: +12.4%", type: 'success' },
      { msg: ">>> Finalizing sandbox environment. Persisting logic-trace.", type: 'terminal' }
    ];

    sequence.forEach((log, i) => {
      setTimeout(() => {
        setAgentZeroLogs(prev => [...prev, log]);
        if (i === sequence.length - 1) {
          setIsAgentZeroActive(false);
          speakText("Recursive execution finalized. System health at maximum capacity.", "system");
        }
      }, (i + 1) * 600);
    });
  };

  const allUniqueTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  const sortedFilteredTasks = tasks
    .filter(t => {
      // Search Filter
      if (taskSearchQuery && !t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) && !(t.description && t.description.toLowerCase().includes(taskSearchQuery.toLowerCase()))) return false;
      // Status Filter
      if (taskFilter === 'pending' && !(t.status === 'pending' || t.status === 'in-progress')) return false;
      if (taskFilter === 'completed' && t.status !== 'completed') return false;
      
      // Tag Filter
      if (selectedTag && (!t.tags || !t.tags.includes(selectedTag))) return false;
      
      // Priority Filter
      if (taskPriorityFilter !== 'all' && t.priority !== taskPriorityFilter) return false;

      // Agent Filter
      if (taskAgentFilter !== 'all') {
        const assigned = t.assignedAgent || 'none';
        if (assigned !== taskAgentFilter) return false;
      }

      // Timeline / Due Date Filter
      if (taskTimelineFilter !== 'all') {
        const now = new Date();
        now.setHours(0,0,0,0);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const endOfWeek = new Date(now);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        let tDate: Date | null = null;
        if (t.dueDate) {
          tDate = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        }

        if (taskTimelineFilter === 'overdue') {
          if (!tDate || t.status === 'completed' || tDate.getTime() >= now.getTime()) return false;
        } else if (taskTimelineFilter === 'today') {
          if (!tDate || tDate.getTime() < now.getTime() || tDate.getTime() >= tomorrow.getTime()) return false;
        } else if (taskTimelineFilter === 'week') {
          if (!tDate || tDate.getTime() < now.getTime() || tDate.getTime() > endOfWeek.getTime()) return false;
        } else if (taskTimelineFilter === 'no-due') {
          if (tDate) return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      if (taskSort === 'priority') {
        const weights = { critical: 4, high: 3, medium: 2, low: 1 };
        const weightA = weights[a.priority || 'medium'];
        const weightB = weights[b.priority || 'medium'];
        if (weightA !== weightB) return weightB - weightA;
      }
      if (taskSort === 'due') {
        const dueA = a.dueDate?.toMillis ? a.dueDate.toMillis() : (a.dueDate as any) || Infinity;
        const dueB = b.dueDate?.toMillis ? b.dueDate.toMillis() : (b.dueDate as any) || Infinity;
        return dueA - dueB;
      }
      if (taskSort === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt as any) || 0;
      const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt as any) || 0;
      return dateB - dateA;
    });

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-indigo-950">
        <div className="animate-pulse flex items-center gap-2">
          <Sparkles className="text-pink-500" />
          <span>Synchronizing Neural Mesh...</span>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!user) {
    return (
      <AuthScreen />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showLanding ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(15px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen w-full"
        >
          <SaphiraAILanding onEnterApp={() => {
            setShowLanding(false);
            setTimeout(() => setShowAwakening(true), 3000);
          }} />
        </motion.div>
      ) : isEmbodiedMode ? (
        <motion.div
          key="embodied"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(15px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans relative overflow-hidden min-h-screen w-full"
        >
          <SaphiraEmbodiedInterface
            onOpenDashboard={() => setIsEmbodiedMode(false)}
            messages={messages}
            isAnalyzing={isTyping || isAgentZeroActive}
            isSpeaking={!!isSpeaking}
            onSendMessage={(text) => handleSend(undefined, text)}
            onVoiceInputToggle={toggleListening}
            isListeningMic={isListening}
          />
          <ApiKeysModal 
            isOpen={showApiKeysModal} 
            onClose={() => setShowApiKeysModal(false)}
          />
          <LocalizedNodeTerminal active={showLocalNodeTerminal} onClose={() => setShowLocalNodeTerminal(false)} />
          {showHelpCenter && <SaphiraHelpCenter onClose={() => setShowHelpCenter(false)} />}
          {showNovaReignBlueprint && <NovaReignBlueprint onClose={() => setShowNovaReignBlueprint(false)} />}
          {showMvpBlueprint && <SaphiraMVPBlueprint onClose={() => setShowMvpBlueprint(false)} />}
          {showFutureBlueprint && <SaphiraFutureBlueprint onClose={() => setShowFutureBlueprint(false)} />}
          {showAndroidBlueprint && <AndroidPromptBlueprint onClose={() => setShowAndroidBlueprint(false)} />}
          {showHybridBlueprint && <HybridArchitectureBlueprint onClose={() => setShowHybridBlueprint(false)} />}
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(15px)' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={cn("saphira-dashboard obsidian-vacuum font-sans relative overflow-hidden min-h-screen transition-colors duration-1000", customBackground ? '' : sduiConfig.bgColor, sduiConfig.textColor)}
          style={{ 
            ['--mouse-x' as any]: `${mousePos.x}%`, 
            ['--mouse-y' as any]: `${mousePos.y}%`,
            ...(customBackground ? { backgroundImage: `url(${customBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {})
          }}
        >
      <AnimatePresence>
        {!hasSeenTutorial && user && (
          <OnboardingTutorial onClose={() => {
            setHasSeenTutorial(true);
            saveProfile({ hasSeenTutorial: true });
          }} />
        )}
      </AnimatePresence>
      
      {/* Background Atmosphere */}
      {sduiConfig.theme === 'dark-glass' ? <CosmicBackground /> : <SparkleBackground />}
      
      {/* HUD Overlays */}
      <NotificationOverlay />

      {/* Dynamic Global Core Search Channel Overlay */}
      <AnimatePresence>
        {isGlobalSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            {/* Backdrop glass blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGlobalSearchOpen(false)}
              className="absolute inset-0 bg-indigo-950/60 backdrop-blur-md"
            />

            {/* Main Command Center panel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-pink-100 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-indigo-50 dark:border-slate-800 bg-indigo-50/20 dark:bg-slate-850/20">
                <Search size={20} className="text-pink-500 animate-pulse shrink-0" />
                <input 
                  autoFocus
                  type="text"
                  value={globalSearchQuery}
                  onChange={(e) => setGlobalSearchQuery(e.target.value)}
                  placeholder="Query system files, objectives, discussion notes or AI dialogues..."
                  className="flex-1 bg-transparent border-none text-indigo-950 dark:text-white text-sm font-bold placeholder-indigo-900/30 dark:placeholder-slate-500 focus:outline-none focus:ring-0"
                />
                <button 
                  onClick={() => setIsGlobalSearchOpen(false)}
                  className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-100 dark:border-slate-800 rounded-lg bg-indigo-50 dark:bg-slate-800 select-none cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Advanced Results Segment */}
              <div className="max-h-[50vh] overflow-y-auto p-4 flex flex-col gap-4 nice-scrollbar min-h-24">
                {globalSearchQuery.trim() === '' ? (
                  <div className="text-center py-8">
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Systems Index Idle</div>
                    <p className="text-[9px] text-indigo-900/40 dark:text-slate-500 max-w-sm mx-auto font-medium leading-normal">
                      Enter key terms or priority indexes to filter across active network parameters and chat logs.
                    </p>
                  </div>
                ) : (() => {
                  const queryLower = globalSearchQuery.toLowerCase();
                  
                  // Filter Tasks
                  const matchingTasks = tasks.filter(t => 
                    t.title.toLowerCase().includes(queryLower) || 
                    (t.description && t.description.toLowerCase().includes(queryLower)) ||
                    (t.priority && t.priority.toLowerCase().includes(queryLower)) ||
                    (t.tags && t.tags.some(tag => tag.toLowerCase().includes(queryLower)))
                  );

                  // Filter Conversation History
                  const matchingMessages = messages.filter(m => 
                    m.content.toLowerCase().includes(queryLower) ||
                    (m.role && m.role.toLowerCase().includes(queryLower))
                  );

                  const totalResults = matchingTasks.length + matchingMessages.length;

                  if (totalResults === 0) {
                    return (
                      <div className="text-center py-8">
                        <div className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2 font-bold">No Alignments Located</div>
                        <p className="text-[9px] text-indigo-900/40 dark:text-slate-500 max-w-sm mx-auto leading-normal italic font-mono">
                          Forensic sweep completed. Search query yielded 0 indices.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Matching Tasks */}
                      {matchingTasks.length > 0 && (
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2 flex items-center gap-1.5 select-none font-bold">
                            <CheckCircle size={10} className="text-emerald-500" /> Objectives ledger ({matchingTasks.length})
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {matchingTasks.map(task => (
                              <div 
                                key={task.id}
                                onClick={() => {
                                  setExpandedTaskId(task.id);
                                  setIsGlobalSearchOpen(false);
                                  notify("Objective Focused", `Direct alignment centered on: "${task.title}"`, "success");
                                }}
                                className="p-3 bg-indigo-50/20 dark:bg-slate-800/20 border border-indigo-100/40 dark:border-slate-800 rounded-2xl hover:border-pink-300 dark:hover:border-pink-500 transition-all cursor-pointer text-left relative group"
                              >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <h5 className="text-xs font-black text-indigo-950 dark:text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">{task.title}</h5>
                                  <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-slate-700">
                                    {task.priority || 'medium'}
                                  </span>
                                </div>
                                {task.description && (
                                  <p className="text-[10px] text-indigo-900/50 dark:text-slate-400 line-clamp-1">{task.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matching Chat Dialogue */}
                      {matchingMessages.length > 0 && (
                        <div className="mt-2">
                          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-pink-400 mb-2 flex items-center gap-1.5 select-none font-bold">
                            <Volume2 size={10} className="text-pink-500 animate-pulse" /> Dialogue transcripts ({matchingMessages.length})
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {matchingMessages.map((msg, idx) => (
                              <div 
                                key={idx}
                                className="p-3 bg-pink-50/5 dark:bg-slate-800/10 border border-pink-100/30 dark:border-slate-850 rounded-2xl text-left hover:border-pink-300 transition-all"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[8px] font-black uppercase tracking-widest text-indigo-950 dark:text-indigo-400">
                                    {msg.role === 'user' ? 'Entity Proxy' : 'Saphira Intelligence'}
                                  </span>
                                  <span className="text-[6px] text-indigo-900/30 dark:text-slate-500 font-mono select-none">
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'Active Log'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-indigo-900/70 dark:text-slate-350 leading-relaxed line-clamp-2 italic">
                                  "{msg.content}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Dynamic shortcut guidelines */}
              <div className="px-6 py-3 border-t border-indigo-50 dark:border-slate-800 bg-indigo-50/20 dark:bg-slate-850/20 flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-indigo-400 dark:text-slate-400 select-none">
                <span>Core SWEEP ACTIVE</span>
                <span>Type Escape or Click backdrop to disengage</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <CognitiveDisplay transcript={transcript} synthesis={synthesis} vitals={vitals} />
      {showAwakening && <SovereignAwakening onDismiss={() => setShowAwakening(false)} />}
      <VanguardRegistry isOpen={isVanguardOpen} onClose={() => setIsVanguardOpen(false)} />
      <ThreatHUD active={isThreatHUDActive} onClose={() => setIsThreatHUDActive(false)} />
      {showTelemetry && <GlobalNodeTelemetry onClose={() => setShowTelemetry(false)} />}
      {showTaskVisualizer && <TaskDependencyVisualizer tasks={tasks} onClose={() => setShowTaskVisualizer(false)} />}
      <SaphiraVoiceOverlay
        active={(isListening || !!isSpeaking || isWakeWordActive) && (isListening || !!isSpeaking || (input !== '' && isWakeWordActive))}
        transcript={input}
        isListening={isListening}
        isSpeaking={!!isSpeaking}
        spokenText={isSpeaking ? (messages.find(m => m.id === isSpeaking)?.content || "") : ""}
      />
      
      <SaphiraVoiceHapticEffect 
        triggerKey={voiceHapticTrigger}
        commandText={voiceHapticCommand}
      />
      
      <div className="fixed inset-0 pointer-events-none z-0 system-fabric-pulse">
         <div className="quantum-glow"></div>
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjM2LDcyLDE1MywwLjA1KSIvPjwvc3ZnPg==')] opacity-50"></div>
      </div>

      {/* Left Navigation Sidebar */}
      <aside className="nav-sidebar nova-container flex flex-col gap-6 p-6 hidden lg:flex relative z-10 hover:border-pink-300">
        <div className="flex items-center gap-3 mb-4">
          <SaphiraLogo size="sm" />
          <div>
            <span className="font-display font-black text-xl tracking-tight text-white block leading-tight">Saphira</span>
            <span className="text-blue-400 text-[9px] font-bold uppercase tracking-widest text-shadow-sm">ASI Workspace</span>
          </div>
        </div>

        {/* Node Connection Status Badge */}
        <div className="px-1 pb-2 border-b border-white/5">
          {isNodeAuthenticated ? (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 text-[10px] text-emerald-400 font-bold tracking-wider">
              <span className="flex items-center gap-1.5 leading-none">
                <Unlock size={12} className="text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-pulse" />
                Node Connected
              </span>
              <span className="font-mono text-[9px] text-[#4ade80] bg-emerald-950/50 px-1 py-0.5 rounded leading-none">PRO-NODE</span>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdaptivePaywall(true)}
              className="w-full flex items-center justify-between bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 rounded-xl px-3 py-2 text-[10px] text-rose-400 font-bold tracking-wider transition-all"
            >
              <span className="flex items-center gap-1.5 leading-none">
                <Lock size={12} className="fill-rose-500 text-rose-500" />
                Inference Locked
              </span>
              <span className="font-mono text-[9px] text-rose-300 bg-rose-950/50 px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5">
                UNLOCK <ArrowRight size={8} />
              </span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest pl-2">Model Orchestration</h4>
          <div className="space-y-2">
             <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 shadow-[0_4px_12px_-4px_rgba(236,72,153,0.2)] transition-all">
                <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center"><BrainCircuit size={16} /></div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider">Saphira</span>
                  <span className="text-[9px] font-medium opacity-80">Finance & Strategy</span>
                </div>
             </button>
             <button className="w-full flex items-center gap-3 p-3 rounded-xl text-indigo-900/60 hover:bg-white/50 border border-transparent hover:border-indigo-100 transition-all">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><Shield size={16} /></div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider">Aura</span>
                  <span className="text-[9px] font-medium opacity-80">Global Security</span>
                </div>
             </button>
             <button 
               onClick={() => setShowTelemetry(true)}
               className="w-full flex items-center gap-3 p-3 rounded-xl text-indigo-900/60 hover:bg-white/50 border border-transparent hover:border-indigo-100 transition-all"
             >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><Globe size={16} /></div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider">Telemetry</span>
                  <span className="text-[9px] font-medium opacity-80">Global Nodes</span>
                </div>
             </button>
             <button 
               onClick={() => setShowTaskVisualizer(true)}
               className="w-full flex items-center gap-3 p-3 rounded-xl text-indigo-900/60 hover:bg-white/50 border border-transparent hover:border-indigo-100 transition-all"
             >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><Network size={16} /></div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider">Topology</span>
                  <span className="text-[9px] font-medium opacity-80">Task visualizer</span>
                </div>
             </button>
             <button 
               onClick={() => setIsAgentZeroActive(!isAgentZeroActive)}
               className="w-full flex items-center gap-3 p-3 rounded-xl text-indigo-900/60 hover:bg-white/50 border border-transparent hover:border-indigo-100 transition-all"
             >
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><Terminal size={16} /></div>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-[11px] font-black uppercase tracking-wider">Agent Zero</span>
                  <span className="text-[9px] font-medium opacity-80">Code execution</span>
                </div>
             </button>
          </div>

          <AnimatePresence>
            {isAgentZeroActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-slate-900 rounded-2xl font-mono text-[9px] space-y-1 relative shadow-2xl border border-slate-700 shadow-pink-500/10">
                   <div className="flex items-center justify-between mb-2">
                     <span className="text-slate-500 flex items-center gap-1"><TerminalIcon size={10} /> agent-zero:sandbox</span>
                     <div className="flex gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                     </div>
                   </div>
                    <div className="max-h-[160px] overflow-y-auto no-scrollbar space-y-1 nice-scrollbar">
                     {agentZeroLogs.map((log, i) => (
                       <div key={i} className={cn(
                         "flex items-start gap-2 py-0.5",
                         log.type === 'success' ? "text-emerald-400" : 
                         log.type === 'warn' ? "text-rose-400 font-bold" : 
                         log.type === 'process' ? "text-cyan-400 animate-pulse" :
                         log.type === 'terminal' ? "text-white opacity-40 italic" : "text-slate-300"
                       )}>
                         <span className="text-slate-700 select-none">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                         <span>{log.msg}</span>
                       </div>
                     ))}
                     {agentZeroLogs.length === 0 && <span className="text-slate-600">Recursive input detected. Awaiting calibration...</span>}
                   </div>
                   <button 
                     onClick={runAgentZero}
                     className="w-full mt-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all"
                   >
                     Initialize Execution Sequence
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-6 border-t border-indigo-100/50 space-y-2">
           <button 
             onClick={() => {
               haptic.medium();
               setShowDeepFocus(true);
             }}
             className="w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-pink-500/15 to-indigo-500/15 border-pink-200/50 hover:border-pink-300 text-pink-700 font-black shadow-sm shadow-pink-500/5 hover:scale-[1.02]"
           >
             <Focus size={16} className="text-pink-500 animate-pulse" />
             Deep Focus Sanctuary
           </button>
           <button 
             onClick={() => {
               haptic.medium();
               setShowGlobalInsight(true);
             }}
             className="w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-[10px] uppercase font-bold tracking-widest bg-gradient-to-r from-indigo-500/15 to-pink-500/15 border-indigo-200/50 hover:border-indigo-300 text-indigo-700 font-black shadow-sm shadow-indigo-500/5 hover:scale-[1.02]"
           >
             <Globe size={16} className="text-indigo-600" />
             Global Insights Hub
           </button>
           <button 
             onClick={() => {
               setIsDeepThinkEnabled(!isDeepThinkEnabled);
               speakText(!isDeepThinkEnabled ? "Deep Think Mode engaged. Logic synthesis maximized." : "Deep Think Mode deactivated. Returning to standard inference.", 'system');
             }}
             className={cn(
               "w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-[10px] uppercase font-bold tracking-widest",
               isDeepThinkEnabled ? "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-600 shadow-lg shadow-fuchsia-500/10" : "bg-white/50 border-pink-50/50 text-indigo-900/40 hover:bg-white hover:text-indigo-900"
             )}
           >
             <Focus size={16} />
             Deep Think {isDeepThinkEnabled ? 'On' : 'Off'}
           </button>
           <button 
             onClick={() => {
               setMirrorMode(!mirrorMode);
               speakText(!mirrorMode ? "Mirror mode engaged." : "Mirror mode deactivated.", 'system');
             }}
             className={cn(
               "w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-[10px] uppercase font-bold tracking-widest",
               mirrorMode ? "bg-pink-100 border-pink-200 text-pink-600 shadow-sm" : "bg-white/50 border-pink-50/50 text-indigo-900/40 hover:bg-white hover:text-indigo-900"
             )}
           >
             <Ghost size={16} />
             Mirror Mode {mirrorMode ? 'On' : 'Off'}
           </button>
           <button 
             onClick={() => {
               setIsVoiceEnabled(!isVoiceEnabled);
               speakText(!isVoiceEnabled ? "Voice enabled." : "Voice disabled.", 'system', true);
             }}
             className={cn(
               "w-full flex items-center gap-3 p-3 rounded-xl transition-all border text-[10px] font-bold uppercase tracking-widest",
               isVoiceEnabled ? "bg-pink-100 border-pink-200 text-pink-600 shadow-sm" : "bg-white/50 border-pink-50/50 text-indigo-900/40 hover:bg-white hover:text-indigo-900"
             )}
           >
             {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
             Voice {isVoiceEnabled ? 'On' : 'Off'}
           </button>
        </div>
      </aside>

      {/* Top Navbar */}
      <header className="top-bar glass-panel relative z-10 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 rounded-xl hover:bg-white/80 transition-colors lg:hidden text-indigo-900"
          >
            <Menu size={20} />
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowMasterPrompt(true)}
            >
              <TerminalIcon size={12} />
              Master Prompt
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-violet-600/20 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowAutonomousBlueprint(true)}
            >
              <RefreshCw size={12} />
              Self-Patching Loop
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-fuchsia-500/20 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowBlueprint(true)}
            >
              <CpuIcon size={12} />
              Precision Blueprint
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setShowBriefing(true)}
            >
              <Shield size={12} />
              Resilience Certified
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
              <BrainCircuit size={12} />
              3 Agents Active
            </div>
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-white/5 cursor-pointer hover:scale-105 transition-transform backdrop-blur-md"
              onClick={() => setIsEmbodiedMode(true)}
            >
              <Eye size={12} />
              Saphira Interface
            </div>
            {isDeepThinkEnabled && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-600 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-fuchsia-500/40 animate-pulse border border-fuchsia-400">
                <Focus size={12} />
                Peak Synthesis: Active
              </div>
            )}
            {isWakeWordActive && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/50 border border-emerald-200/50 rounded-lg text-emerald-700 text-[9px] font-black uppercase tracking-widest shadow-sm">
                <div className="flex gap-0.5 items-center">
                  <span className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                </div>
                Mic Active
              </div>
            )}
            {isNeuralSyncActive && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 rounded-lg text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 animate-pulse">
                <Activity size={12} />
                Neural Sync
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
                                  <div className="flex bg-white/50 p-1.5 rounded-xl border border-indigo-100/50 items-center gap-1.5 mr-2">
                                    <button 
                                      onClick={() => triggerNeuralSync('soft')}
                                      className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95"
                                      title="Soft Calibration"
                                    >
                                      <Zap size={16} />
                                    </button>
                                    <button 
                                      onClick={() => triggerNeuralSync('hard')}
                                      className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95"
                                      title="Hard Reset"
                                    >
                                      <RefreshCcw size={16} />
                                    </button>
                                    <button 
                                      onClick={() => triggerNeuralSync('deep')}
                                      className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-all hover:scale-110 active:scale-95"
                                      title="Deep Sync"
                                    >
                                      <Database size={16} />
                                    </button>
                                  </div>

          <div className="flex items-center h-8 px-2 rounded-lg bg-indigo-50/50 border border-indigo-100/50 text-[9px] font-mono text-indigo-950/40 uppercase tracking-tighter">
            <Command size={10} className="mr-1" /> D for Neural Tone
          </div>
          <div className="px-3 py-1.5 rounded-full bg-pink-50/50 border border-pink-100 text-[10px] uppercase font-bold tracking-widest text-pink-600 flex items-center gap-2 shadow-sm">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse [animation-delay:200ms]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse [animation-delay:400ms]"></span>
            </div>
            Quantum Active
          </div>

          {/* Global Search shortcut hint */}
          <button 
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-2 h-10 px-3 rounded-full border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm text-[10px] font-black uppercase tracking-widest text-indigo-900/60 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all hover:shadow-md hover:-translate-y-0.5"
            title="Global Core Search (⌘K)"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-flex items-center h-4 px-1.5 rounded bg-indigo-50 border border-indigo-100 font-mono text-[8px] text-indigo-400 font-bold tracking-tighter uppercase select-none">⌘K</kbd>
          </button>

          {/* Core In-App Notifications System */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="w-10 h-10 rounded-full border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all text-indigo-900/60 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 relative"
              title="Notifications Log"
            >
              <Bell size={18} />
              {inAppNotifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-pink-500 rounded-full flex items-center justify-center text-[7px] text-white font-black animate-bounce">
                  {inAppNotifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-indigo-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl p-4 z-50 overflow-hidden text-left"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-indigo-50 dark:border-slate-800 mb-2">
                     <div>
                       <h4 className="text-xs font-black text-indigo-950 dark:text-white uppercase tracking-wider">Alert Logs</h4>
                       <p className="text-[7px] font-black uppercase tracking-widest text-pink-500">System Alignments</p>
                     </div>
                     {inAppNotifications.length > 0 && (
                       <button 
                         onClick={() => {
                           setInAppNotifications([]);
                           localStorage.setItem('saphira_notifications', JSON.stringify([]));
                           notify("Logs Purged", "Notification history cleared.", "warn");
                         }}
                         className="text-[8px] font-black uppercase tracking-widest text-indigo-400 hover:text-rose-500 transition-colors"
                       >
                         Clear All
                       </button>
                     )}
                  </div>

                  <div className="max-h-64 overflow-y-auto pr-1 flex flex-col gap-2 nice-scrollbar">
                     {inAppNotifications.length === 0 ? (
                       <div className="text-center py-6">
                         <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800/50 flex items-center justify-center mx-auto text-indigo-300 dark:text-slate-600 mb-2">
                           <Bell size={18} />
                         </div>
                         <p className="text-[9px] text-indigo-950/40 dark:text-slate-400/50 font-bold uppercase tracking-widest italic font-mono">
                           All Quiet. No pending system events.
                         </p>
                       </div>
                     ) : (
                       inAppNotifications.map(notif => (
                         <div 
                           key={notif.id} 
                           onClick={() => {
                             const updated = inAppNotifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
                             setInAppNotifications(updated);
                             localStorage.setItem('saphira_notifications', JSON.stringify(updated));
                           }}
                           className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                             notif.read 
                               ? 'bg-transparent border-indigo-50/50 dark:border-slate-800/50 opacity-60' 
                               : 'bg-indigo-50/20 dark:bg-slate-800/30 border-pink-100/50 dark:border-pink-900/20'
                           }`}
                         >
                           <div className="flex items-start justify-between gap-1.5 mb-1">
                             <span className="text-[9px] font-black text-indigo-950 dark:text-slate-100 uppercase tracking-wide truncate">{notif.title}</span>
                             <span className="text-[6px] text-indigo-900/30 dark:text-slate-400/40 font-mono select-none shrink-0">
                               {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                           </div>
                           <p className="text-[9px] text-indigo-900/60 dark:text-slate-300/80 leading-relaxed font-sans">{notif.message}</p>
                           {!notif.read && (
                             <div className="absolute right-2.5 bottom-2.5 w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></div>
                           )}
                         </div>
                       ))
                     )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowApiKeysModal(true)}
            className="w-10 h-10 rounded-full border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all text-indigo-900/60 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400"
            title="Secure API Vault"
          >
            <Key size={18} />
          </button>

          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 rounded-full border border-indigo-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={22} className="text-indigo-900/60 dark:text-slate-400" />
            )}
          </button>

          <UserProfileSettings 
            user={user}
            isOpen={isProfileMenuOpen}
            onClose={() => setIsProfileMenuOpen(false)}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            voiceRate={voiceRate}
            setVoiceRate={setVoiceRate}
            saveProfile={saveProfile}
            onSignOut={() => signOut(auth)}
            isWakeWordActive={isWakeWordActive}
            setIsWakeWordActive={setIsWakeWordActive}
            onOpenApiKeys={() => setShowApiKeysModal(true)}
            customBackground={customBackground}
            setCustomBackground={setCustomBackground}
            voiceProfile={voiceProfile}
            setVoiceProfile={setVoiceProfile}
            voiceSoftness={voiceSoftness}
            setVoiceSoftness={setVoiceSoftness}
          />
        </div>
      </header>

      {/* Main Intelligence Stream (Chat Area) */}
      <main className="main-stream nova-container relative z-10 hover:border-pink-300">
        <div className="flex-1 flex flex-col bg-transparent overflow-hidden relative h-full">
          
          {/* Saphira ASI Customer Alert System & Security Ticker */}
          <div className="px-6 pt-6 pb-2 flex flex-col gap-3 relative z-20 border-b border-indigo-100/10">
            <div className="flex flex-wrap gap-2.5">
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-pink-500/20 bg-pink-500/5 text-[9px] font-bold text-pink-500 uppercase tracking-widest backdrop-blur-md shadow-sm"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
                Deployment Loop: Sovereign Alpha Alpha track active (20 Testers / 14 Days countdown)
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-[9px] font-bold text-indigo-400 uppercase tracking-widest backdrop-blur-md shadow-sm"
              >
                <KeyRound size={12} className="text-indigo-400" />
                Google automated bypass credentials SOPHIA_VANGUARD_77 synchronized
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md shadow-sm"
              >
                <Server size={12} className="text-emerald-400 animate-pulse" />
                Dual Monetization Gateways operational (Buy.Stripe Node & Affiliates Active)
              </motion.div>
            </div>
          </div>

          <div id="chatStream" className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth space-y-6 nice-scrollbar pb-40">
              
              <AnimatePresence initial={false}>
                {messages.length <= 1 ? (
                  <div className="min-h-full flex flex-col items-center justify-center text-center py-12">
                     <MultiAgentCanvas activeAgents={['saphira', isAgentZeroActive ? 'agent_zero' : '']} />
                     
                     <motion.h2 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.2 }}
                       className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 font-display"
                     >
                       Sovereign OS <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Online.</span>
                     </motion.h2>
                     <motion.p 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.3 }}
                       className="text-lg md:text-xl telemetry-gray font-medium max-w-xl mx-auto"
                     >
                       Omnipresent Agentic Architecture standing by for strategic input.
                     </motion.p>
                     
                     <SuggestionsMatrix onSelect={(text) => handleSend(undefined, text)} />
                  </div>
                ) : (
                  <div className="neon-gradient-pulse-frame p-[1px] rounded-[36px] bg-gradient-to-r from-[#FF1493] via-[#00ced1] to-[#00bfff] shadow-[0_0_40px_rgba(255,20,147,0.15)]">
                    <div className="bg-white/5 backdrop-blur-[35px] rounded-[35px] p-4 sm:p-6 space-y-6">
                      {messages.map((msg) => (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={cn(
                          "flex w-full mb-6",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[85%] p-5 sm:p-6 relative group/msg transition-all duration-700",
                          "crisp-frosted-white-bubble shadow-md rounded-[32px]",
                          msg.role === 'user' ? "rounded-tr-md border-[#FF1493]/15" : "rounded-tl-md border-[#00ced1]/15",
                          isSpeaking === msg.id && "shadow-[0_0_40px_rgba(255,20,147,0.3)] border-[#FF1493]/50 scale-[1.01]"
                        )}>
                      {isSpeaking === msg.id && msg.role === 'model' && (
                        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                          <motion.div 
                            animate={{ 
                              opacity: [0, 0.3, 0],
                              scale: [1, 1.2, 1],
                              x: [-10, 10, -10]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-indigo-400/5 to-pink-500/5 blur-xl"
                          />
                        </div>
                      )}
                      {msg.role === 'model' && (
                        <div className="flex items-center justify-between mb-2 opacity-0 group-hover/msg:opacity-100 transition-all duration-300">
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} className="text-pink-600" />
                            <span className="text-xs uppercase tracking-wider font-medium text-pink-700">Saphira</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleRegenerate(msg.id)}
                              className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-all text-pink-600 border border-pink-100"
                              title="Regenerate response"
                            >
                              <RefreshCcw size={14} />
                            </button>
                            <button 
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-all text-pink-600 border border-pink-100"
                              title="Share message"
                            >
                              {copiedMessageId === msg.id ? <Check size={14} /> : <Share size={14} />}
                            </button>
                            <button 
                              onClick={() => speakText(msg.content, msg.id, true)}
                              className="p-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 transition-all text-pink-600 border border-pink-100"
                            >
                              {isSpeaking === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {msg.role === 'user' && (
                        <div className="absolute -left-12 top-0 opacity-0 group-hover/msg:opacity-100 transition-opacity flex flex-col gap-1">
                           <button 
                            onClick={() => { setEditingMsgId(msg.id); setEditMsgContent(msg.content); }}
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                            title="Edit message"
                           >
                             <Pencil size={14} />
                           </button>
                           <button 
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                            title="Share message"
                           >
                             {copiedMessageId === msg.id ? <Check size={14} /> : <Share size={14} />}
                           </button>
                           <button 
                            onClick={() => speakText(msg.content, msg.id, true)}
                            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                            title="Listen"
                           >
                             {isSpeaking === msg.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                           </button>
                        </div>
                      )}

                      <div className={cn("markdown-body max-w-none leading-relaxed", 
                        msg.role === 'model' 
                          ? "prose prose-indigo prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-headings:font-bold prose-headings:text-indigo-950 text-[15px] font-medium text-indigo-950" 
                          : "text-sm font-semibold text-indigo-950 prose prose-indigo"
                      )}>
                        {editingMsgId === msg.id ? (
                          <div className="w-full">
                            <textarea
                              value={editMsgContent}
                              onChange={(e) => setEditMsgContent(e.target.value)}
                              className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl p-3 focus:outline-none focus:border-indigo-400 min-h-[100px] resize-none text-indigo-950"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button 
                                onClick={() => setEditingMsgId(null)}
                                className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => submitEdit(msg.id)}
                                className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                              >
                                Save & Regenerate
                              </button>
                            </div>
                          </div>
                        ) : msg.content.includes('STRATEGIC ORCHESTRATION') ? (
                          <div className="border border-pink-500/30 bg-pink-500/5 backdrop-blur-md p-6 mb-4 rounded-3xl shadow-[0_0_20px_rgba(236,72,153,0.1)] relative group text-indigo-950 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none text-pink-600"><PrismRipple /></div>
                            <div className="flex items-center gap-2 text-pink-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-pink-500/10 pb-2">
                              <Zap size={12} />
                              Nova Strategic Orchestration Report
                            </div>
                            
                            {/* Causal Chain Visualization */}
                            <div className="mb-6 overflow-x-auto pb-4 no-scrollbar">
                              <div className="flex items-center gap-4 min-w-max">
                                {['Synthesis', 'Deep Logic', 'Game Theory', 'Causal Pruning', 'Strategic Lead'].map((step, idx) => (
                                  <div key={step} className="flex items-center gap-3">
                                    <motion.div 
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.2 }}
                                      className="flex flex-col items-center gap-2"
                                    >
                                      <motion.div 
                                        animate={{ 
                                          scale: [1, 1.1, 1], 
                                          borderColor: ['rgba(236,72,153,0.2)', 'rgba(236,72,153,0.6)', 'rgba(236,72,153,0.2)'],
                                          boxShadow: ['0 0 0px rgba(236,72,153,0)', '0 0 15px rgba(236,72,153,0.2)', '0 0 0px rgba(236,72,153,0)']
                                        }}
                                        transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                                        className="w-12 h-12 rounded-2xl bg-white border border-pink-200 flex items-center justify-center text-[10px] font-bold text-pink-600 backdrop-blur-sm"
                                      >
                                        <div className="flex flex-col items-center leading-none">
                                          <span className="text-[8px] opacity-40 text-indigo-900/40">STEP</span>
                                          <span>0{idx + 1}</span>
                                        </div>
                                      </motion.div>
                                      <span className="text-[7px] uppercase tracking-[0.2em] font-black text-indigo-900/30 text-center w-16 leading-tight">{step}</span>
                                    </motion.div>
                                    {idx < 4 && (
                                      <div className="flex flex-col items-center gap-1 mt-[-20px]">
                                        <div className="h-px w-10 bg-gradient-to-r from-pink-300 via-indigo-300 to-pink-300 relative">
                                          <motion.div 
                                            animate={{ left: ['0%', '100%', '0%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                            className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                          </div>
                        ) : msg.content.includes('SYSTEMIC OPTIMIZATION') ? (
                          <div className="border border-emerald-500/30 bg-emerald-500/5 p-6 mb-4 rounded-lg relative overflow-hidden group text-indigo-950">
                            <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-10 transition-transform duration-1000 group-hover:rotate-12"><Shield size={120} /></div>
                            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-3">
                              <Shield size={14} />
                              Architectural Advisory Component
                            </div>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                          </div>
                        ) : msg.content.includes('ONTOLOGICAL TRUTH VERDICT') ? (
                          <div className="border border-cyan-500/30 bg-cyan-500/5 p-6 mb-4 rounded-lg relative overflow-hidden group text-indigo-950">
                            <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-30"><CheckCircle size={40} /></div>
                            <div className="flex items-center gap-2 text-cyan-600 font-black text-[10px] uppercase tracking-widest mb-3 border-b border-cyan-500/20 pb-2">
                              <CheckCircle size={14} />
                              Layer-0 Ontological Ledger Result
                            </div>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                          </div>
                        ) : (msg.content.includes('THREAT ASSESSMENT') || msg.content.includes('SUBPOENA RECOMMENDATION') || msg.content.includes('THREAT_ASSESSMENT_VIEW')) ? (
                          <>
                            <ThreatAssessmentView />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('THREAT_ASSESSMENT_VIEW', '')}</Markdown>
                          </>
                        ) : msg.content.includes('GLOBAL_SENTIMENT_PROTOCOL') ? (
                          <>
                            <GlobalSentimentTracker />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('GLOBAL_SENTIMENT_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('SOVEREIGN_SHIELD_PROTOCOL') ? (
                          <>
                            <SovereignComplianceModule />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('SOVEREIGN_SHIELD_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('CAUSAL_DISCOVERY_SUITE') ? (
                          <>
                            <CausalGraph />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('CAUSAL_DISCOVERY_SUITE', '')}</Markdown>
                          </>
                        ) : msg.content.includes('ARENA_2026_PROTOCOL') ? (
                          <>
                            <ArenaBenchmarkVisualizer />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('ARENA_2026_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('AGENTIC_AI_PROTOCOL') ? (
                          <>
                            <VisualIntelligenceOverlay />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('AGENTIC_AI_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('SAPHIRA_MASTER_PROTOCOL') ? (
                          <>
                            <SaphiraMasterControl />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('SAPHIRA_MASTER_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('AUTONOMOUS_PATCH_CANVAS') ? (
                          <>
                            <SaphiraCanvas />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('AUTONOMOUS_PATCH_CANVAS', '')}</Markdown>
                          </>
                        ) : msg.content.includes('MONETIZATION_DASHBOARD_PROTOCOL') ? (
                          <>
                            <SaphiraMonetizationDashboard />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('MONETIZATION_DASHBOARD_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('API_KEY_MANAGEMENT_PROTOCOL') ? (
                          <>
                            <APIKeyManager />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('API_KEY_MANAGEMENT_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('FORENSIC INTELLIGENCE DOSSIER') ? (
                          <div className="border border-indigo-200 bg-white/70 backdrop-blur-md p-6 mb-4 rounded-lg shadow-sm relative overflow-hidden text-indigo-950">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500/50" />
                            <div className="flex items-center gap-2 text-pink-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-indigo-100 pb-2">
                              <Shield size={12} />
                              Saphira Forensic Intelligence Unit
                            </div>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                          </div>
                        ) : msg.content.includes('TACTICAL DIRECTIVE') || msg.content.includes('Operational Matrix') ? (
                          <div className="border-l-2 border-amber-500 bg-amber-500/10 p-4 mb-4 rounded-r-lg text-indigo-950">
                            <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest mb-2">
                              <Zap size={12} />
                              Priority Tactical Directive
                            </div>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                        </div>
                        ) : msg.content.includes('ETSY_DYNAMIC_VIEW') ? (
                          <>
                            <EtsyDynamicView />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('ETSY_DYNAMIC_VIEW', '')}</Markdown>
                          </>
                        ) : msg.content.includes('SECURE_MEMORY_VAULT') ? (
                          <>
                            <SecureMemoryVault />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('SECURE_MEMORY_VAULT', '')}</Markdown>
                          </>
                        ) : msg.content.includes('ASI_BLUEPRINT') ? (
                          <>
                            <ASIBlueprint />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('ASI_BLUEPRINT', '')}</Markdown>
                          </>
                        ) : msg.content.includes('GLOBAL_TALENT_PROTOCOL') ? (
                          <>
                            <GlobalTalentProtocol />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('GLOBAL_TALENT_PROTOCOL', '')}</Markdown>
                          </>
                        ) : msg.content.includes('MASTER_BLUEPRINT_VIEW') ? (
                          <>
                            <MasterArchitectureBlueprint />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('MASTER_BLUEPRINT_VIEW', '')}</Markdown>
                          </>
                        ) : msg.content.includes('8_LEVELS_PROTOCOL') ? (
                          <>
                            <CognitiveStateModel />
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content.replace('8_LEVELS_PROTOCOL', '')}</Markdown>
                          </>
                        ) : (
                          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{msg.content}</Markdown>
                        )}
                      </div>
                      {msg.imageUrl && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 rounded-xl overflow-hidden border border-white/20 shadow-2xl"
                        >
                          <img src={msg.imageUrl} alt="Generated Neural Art" className="w-full h-auto object-cover" />
                        </motion.div>
                      )}
                      {msg.role === 'user' && (
                        <div className="absolute bottom-2 right-3 text-indigo-400">
                          <CheckCheck size={14} className="opacity-50" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                      )
                    )}
                    </div>
                  </div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {reminders.map((reminder, idx) => (
                  <motion.div
                    key={`reminder-${idx}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="p-3 mb-2 bg-indigo-500/20 border border-indigo-400/30 rounded-xl text-[10px] text-indigo-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                       <Shield size={12} className="text-indigo-400" />
                       {reminder}
                    </div>
                    <button onClick={() => setReminders(reminders.filter((_, i) => i !== idx))}>
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start w-full mb-6 max-w-4xl"
                >
                  <div className="nova-container p-4 rounded-3xl flex flex-col gap-2 shadow-xl border border-indigo-100">
                    {transparencyLogs.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-indigo-100/30">
                          <Activity size={12} className="text-pink-500 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950 font-display">Transparency Engine (NLA)</span>
                        </div>
                        {transparencyLogs.map((log, i) => (
                          <div key={i} className="text-[10px] p-2 rounded-lg bg-white/50 border border-indigo-100/50 shadow-sm transition-all text-indigo-900/80 leading-relaxed font-medium">
                            {log.type === 'sentiment' && (
                              <div className="flex gap-2 items-center">
                                <Mic size={10} className="text-pink-500" /> 
                                <span className="font-mono text-pink-600">Audio Scanned (500ms):</span> Detected <span className="font-black italic">{log.data?.vocal_cadence}</span>
                              </div>
                            )}
                            {log.type === 'layer_translation' && (
                              <div className="flex gap-2 items-center">
                                <Layers size={10} className="text-indigo-400" />
                                <span className="font-mono text-indigo-600">L{log.layer}:</span> {log.concept}
                              </div>
                            )}
                            {log.type === 'final_response' && (
                              <div className="flex flex-col gap-1 mt-2 border-t border-indigo-100 pt-2">
                                <div className="flex gap-2 items-center">
                                  <Network size={10} className="text-emerald-500" />
                                  <span>Sync Score: <span className="font-mono font-black text-emerald-600">{(log.synchrony * 100).toFixed(0)}%</span> | 
                                  Alignment: <span className="font-mono font-black text-emerald-600">{(log.alignment * 100).toFixed(0)}%</span></span>
                                </div>
                                {log.billing && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-indigo-500 text-[9px] uppercase tracking-wider font-bold">Billing Gateway:</span>
                                    <span className="font-mono text-indigo-800">{log.billing.tokens} tokens</span>
                                    <span className={`font-mono text-[9px] px-1 rounded ${log.billing.cost === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{log.billing.status}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-[bounce_1s_infinite]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_200ms]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] ml-3 diamond-glass-text !text-indigo-900 animate-pulse">Cognitive Synthesis...</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} className="h-4" />
            </div>

            <AnimatePresence>
              {showAutonomousBlueprint && (
                <AutonomousSelfPatchingBlueprint onClose={() => setShowAutonomousBlueprint(false)} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showMasterPrompt && (
                <MasterBlueprintPromptOverlay onClose={() => setShowMasterPrompt(false)} />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showBlueprint && (
                <PrecisionIntelligenceBlueprint onClose={() => setShowBlueprint(false)} />
              )}
            </AnimatePresence>

            {/* System Briefing Modal Overlay */}
            <AnimatePresence>
              {showBriefing && (
                <TechnicalBriefing onClose={() => setShowBriefing(false)} />
              )}
            </AnimatePresence>

            {/* Forge Modal Overlay */}
            <AnimatePresence>
              {showForge && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[120] p-4 md:p-12 flex items-center justify-center bg-indigo-950/20 backdrop-blur-md"
                >
                  <div className="w-full max-w-4xl relative">
                    <button 
                      onClick={() => setShowForge(false)}
                      className="absolute -top-4 -right-4 p-4 rounded-full bg-indigo-950 text-white z-10 shadow-2xl hover:scale-110 transition-transform"
                    >
                      <X size={20} />
                    </button>
                    <ModuleForge onDeploy={() => {
                      setShowForge(false);
                      setShowDeployment(true);
                      speakText("Module logic seed generated. Initializing First Light Deployment sequence. Causal filaments are proliferating.", "onboarding");
                    }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Deployment Sequence Overlay */}
            <AnimatePresence>
              {showDeployment && (
                <GlobalSurveyDeployment onComplete={() => {
                  setShowDeployment(false);
                  speakText("Deep Sync established. The global survey is active. I have identified three strategic yield vectors for the Architect's review.", "system");
                }} />
              )}
            </AnimatePresence>

            {/* Spatial Awareness Overlay */}
            <AnimatePresence>
              {showSpatialMap && (
                <SpatialMapOverlay onClose={() => setShowSpatialMap(false)} />
              )}
            </AnimatePresence>

            {/* Google Chat Panel */}
            <AnimatePresence>
              {showChatPanel && (
                <GoogleChatPanel onClose={() => setShowChatPanel(false)} />
              )}
            </AnimatePresence>

          {/* Input Area - Floating Gemini Pill */}
            <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center pointer-events-none z-30 px-4 md:px-12">
              <AnimatePresence>
                {showAISettings && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="mb-4 w-full max-w-sm p-6 bg-white/80 backdrop-blur-2xl border border-indigo-100 rounded-3xl shadow-2xl pointer-events-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-950">Neural Settings</h4>
                      <button onClick={() => setShowAISettings(false)} className="text-indigo-400 hover:text-rose-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Model selection</label>
                        <select 
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 text-[10px] font-bold text-indigo-950 focus:outline-none focus:border-pink-500"
                        >
                          <optgroup label="Pro Models (Intelligence Matrix)">
                            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                            <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro Experimental</option>
                          </optgroup>
                          <optgroup label="Flash Models (Velocity Matrix)">
                            <option value="gemini-3.1-flash-preview">Gemini 3.1 Flash Preview</option>
                            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental</option>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <label className="text-indigo-400">Temperature (Creativity)</label>
                          <span className="text-pink-600 font-mono">{genConfig.temperature}</span>
                        </div>
                        <input 
                          type="range" min="0" max="2" step="0.1"
                          value={genConfig.temperature}
                          onChange={(e) => setGenConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                          className="w-full h-1 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <label className="text-indigo-400">Max Tokens (Inference Depth)</label>
                          <span className="text-pink-600 font-mono">{genConfig.maxOutputTokens}</span>
                        </div>
                        <input 
                          type="range" min="256" max="8192" step="256"
                          value={genConfig.maxOutputTokens}
                          onChange={(e) => setGenConfig(prev => ({ ...prev, maxOutputTokens: parseInt(e.target.value) }))}
                          className="w-full h-1 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative w-full max-w-4xl pointer-events-auto">
                <AnimatePresence>
                  {showAttachmentMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#202124] rounded-2xl shadow-xl overflow-hidden shadow-black/10 z-50 text-[#3c4043] dark:text-[#e8eaed] pointer-events-auto border border-gray-100 dark:border-gray-700/50 p-2"
                    >
                      {[
                        { icon: <Globe size={18} strokeWidth={1.5} />, label: "This page" },
                        { icon: <Camera size={18} strokeWidth={1.5} />, label: "Camera" },
                        { icon: <ImageIcon size={18} strokeWidth={1.5} />, label: "Gallery" },
                        { icon: <FileText size={18} strokeWidth={1.5} />, label: "Files" },
                        { icon: <Database size={18} strokeWidth={1.5} />, label: "Drive" },
                        { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "Notebooks" },
                      ].map((item, i) => (
                        <button key={i} type="button" onClick={() => setShowAttachmentMenu(false)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f1f3f4] dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium">
                          <span className="text-[#3c4043] dark:text-[#9aa0a6]">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  
                  {showToolsMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-full left-12 mb-2 w-64 bg-white dark:bg-[#202124] rounded-2xl shadow-xl overflow-hidden shadow-black/10 z-50 text-[#3c4043] dark:text-[#e8eaed] pointer-events-auto border border-gray-100 dark:border-gray-700/50 p-2"
                    >
                      <div className="text-xs font-semibold px-3 py-2 text-[#5f6368] dark:text-[#9aa0a6] uppercase tracking-wider">Tools</div>
                      {[
                        { icon: <ImageIcon size={18} strokeWidth={1.5} />, label: "Create image" },
                        { icon: <Video size={18} strokeWidth={1.5} />, label: "Create video" },
                        { icon: <Music size={18} strokeWidth={1.5} />, label: "Create music" },
                        { icon: <LayoutTemplate size={18} strokeWidth={1.5} />, label: "Canvas" },
                        { icon: <Search size={18} strokeWidth={1.5} />, label: "Deep research" },
                        { icon: <BookOpen size={18} strokeWidth={1.5} />, label: "Guided learning" },
                        { icon: <UserCircle size={18} strokeWidth={1.5} />, label: "Personal Intelligence" },
                        { icon: <Rocket size={18} strokeWidth={1.5} />, label: "Future Blueprints", action: () => { setShowToolsMenu(false); setShowFutureBlueprint(true); } },
                        { icon: <MonitorSmartphone size={18} strokeWidth={1.5} />, label: "Android AI Workflow", action: () => { setShowToolsMenu(false); setShowAndroidBlueprint(true); } },
                        { icon: <Router size={18} strokeWidth={1.5} />, label: "Hybrid Router Logic", action: () => { setShowToolsMenu(false); setShowHybridBlueprint(true); } },
                        { icon: <Mic size={18} strokeWidth={1.5} />, label: "Toggle Ambient Voice Input", action: () => { setShowToolsMenu(false); setIsWakeWordActive(!isWakeWordActive); speakText(!isWakeWordActive ? "Ambient Voice Activated." : "Ambient Voice Deactivated.", "system"); } },
                        { icon: <Plus size={18} strokeWidth={1.5} />, label: "Add Task to Ledger", action: () => { setShowToolsMenu(false); setIsAddingTask(true); } },
                        { icon: <Network size={18} strokeWidth={1.5} />, label: "Task Dependencies", action: () => { setShowToolsMenu(false); setShowTaskVisualizer(true); } },
                        { icon: <Activity size={18} strokeWidth={1.5} />, label: "Global Telemetry Chart", action: () => { setShowToolsMenu(false); setShowTelemetry(true); } },
                        { icon: <Rocket size={18} strokeWidth={1.5} />, label: "Zero-Cost MVP Blueprint", action: () => { setShowToolsMenu(false); setShowMvpBlueprint(true); } },
                        { icon: <Search size={18} strokeWidth={1.5} />, label: "Help Center", action: () => { setShowToolsMenu(false); setShowHelpCenter(true); } },
                        { icon: <Layers size={18} strokeWidth={1.5} />, label: "NovaReign Blueprint", action: () => { setShowToolsMenu(false); setShowNovaReignBlueprint(true); } },
                        { icon: <Database size={18} strokeWidth={1.5} />, label: "Enterprise Fine-Tuning", action: () => { setShowToolsMenu(false); setShowLLMFineTuning(true); } },
                        { icon: <Shield size={18} strokeWidth={1.5} />, label: "Adaptive Paywall", action: () => { setShowToolsMenu(false); setShowAdaptivePaywall(true); } },
                      ].map((item, i) => (
                        <button key={i} type="button" onClick={() => item.action ? item.action() : setShowToolsMenu(false)} className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#f1f3f4] dark:hover:bg-white/5 rounded-xl transition-colors text-sm font-medium">
                          <span className="text-[#1a73e8] dark:text-[#8ab4f8]">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col items-center justify-center py-4 relative z-50">
                  <div className="flex items-center gap-6">
                    {/* Always Listening Wake Word Switch */}
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isWakeWordActive;
                        setIsWakeWordActive(nextState);
                        if (nextState) {
                          speakText("Always listening wake word mode enabled.", "system");
                        } else {
                          speakText("Always listening wake word mode disabled.", "system");
                        }
                      }}
                      className={cn(
                        "p-2.5 rounded-full transition-all flex items-center justify-center border",
                        isWakeWordActive 
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-110" 
                          : "bg-white/5 text-white/40 border-white/10 hover:text-white/60 hover:bg-white/10"
                      )}
                      title={isWakeWordActive ? "Always-Listening Wake Word ACTIVE" : "Enable Always-Listening Wake Word ('Okay Saphira')"}
                    >
                      <Sparkles size={18} className={cn(isWakeWordActive && "animate-spin-slow text-emerald-300")} />
                    </button>

                    {/* Microphone / Speech orb */}
                    <div 
                      onClick={() => {
                          toggleListening();
                          if (!isListening) setGlobalCrystalState('speaking');
                          else setGlobalCrystalState('idle');
                      }}
                      className={cn(
                        "adaptive-voice-sphere cursor-pointer", 
                        isListening ? "active" : "",
                        (isWakeWordActive && !isListening) ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : ""
                      )}
                    >
                      {!isListening ? (
                         <Mic size={28} className={cn(isWakeWordActive ? "text-emerald-400" : "text-white/70")} />
                      ) : (
                         <div className="flex items-end justify-center h-full gap-1 p-4 w-full opacity-80">
                           <motion.div animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 bg-white rounded-full" />
                           <motion.div animate={{ height: [16, 32, 16] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 bg-white rounded-full" />
                           <motion.div animate={{ height: [12, 28, 12] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 bg-white rounded-full" />
                           <motion.div animate={{ height: [20, 40, 20] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1.5 bg-white rounded-full" />
                         </div>
                      )}
                    </div>

                    {/* Spoken Voice Commands Helper / Indicator Toggle */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="p-2.5 rounded-full transition-all flex items-center justify-center border bg-white/5 text-white/40 border-white/10 hover:text-white/60 hover:bg-white/10"
                        title="Voice Commands Guide"
                      >
                        <Command size={18} />
                      </button>
                      <div className="absolute right-0 bottom-full mb-3 hidden group-hover:block w-72 p-4 bg-slate-950/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl z-[100] transition-opacity pointer-events-auto text-left">
                        <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 border-b border-white/10 pb-1">Spoken Voice Commands</h4>
                        <div className="flex flex-col gap-1.5 text-[10px] text-white/70 font-medium">
                          <p><span className="text-pink-400 font-bold">"Activate/Deactivate Deep Think"</span>: Set reasoning level</p>
                          <p><span className="text-pink-400 font-bold">"Initiate Neural Sync"</span>: Calibrate active nodes</p>
                          <p><span className="text-pink-400 font-bold">"Open API Vault"</span>: Manage secure tokens</p>
                          <p><span className="text-pink-400 font-bold">"Toggle Dark Mode"</span>: Adjust interface canvas</p>
                          <p><span className="text-pink-400 font-bold">"Activate Micro SaaS"</span>: Run automated builders</p>
                          <p><span className="text-pink-400 font-bold">"Open/Close Terminal"</span>: Access local shell console</p>
                          <p><span className="text-pink-400 font-bold">"Activate Threat HUD"</span>: Trigger defense mesh</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {isListening ? (
                    <div className="mt-4 text-center">
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-1 justify-center">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full inline-block animate-ping"></span>
                        Neural Capture Active
                      </p>
                      <p className="text-white/40 text-[8px] tracking-wide mt-1">Speak your directive or commands</p>
                    </div>
                  ) : isWakeWordActive ? (
                    <div className="mt-4 text-center">
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-1 justify-center">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping"></span>
                        Ambient Saphira Wake Word Active
                      </p>
                      <p className="text-white/30 text-[8px] tracking-wide mt-1">Say <span className="font-bold text-white/50">"Okay Saphira"</span> to trigger interface capture</p>
                    </div>
                  ) : (
                    <div className="mt-4 text-center">
                      <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] justify-center">
                        Manual Sensory Standby
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </main>

      {/* Right Sidebar - Intelligent Nodes */}
      <aside className={cn(
        "ctx-panel nova-container flex flex-col gap-4 transition-all duration-300 absolute lg:static inset-y-0 right-0 z-40 transform bg-white lg:bg-transparent border-l border-pink-100 lg:border-none p-4 hover:border-pink-300",
        isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex flex-col gap-3 mb-6">
                 <button 
                   onClick={startInitiation}
                   disabled={onboardingStep !== null}
                   className="w-full py-4 bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                 >
                   {onboardingStep ? 'Genesis Propagating' : 'PUBLISH GLOBAL GENESIS'}
                 </button>
                 <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 font-display">
                      <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                      REALITY ORCHESTRATION
                    </h3>
                    <div className="flex gap-1.5 items-center">
                      <button 
                        onClick={() => {
                          haptic.light();
                          setIsBatchModeActive(!isBatchModeActive);
                          setSelectedTaskIds([]);
                        }}
                        className={cn(
                          "flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black border transition-all shadow-sm",
                          isBatchModeActive 
                            ? "bg-indigo-950 text-white border-indigo-900" 
                            : "bg-white border-indigo-200 text-indigo-600 hover:bg-slate-50"
                        )}
                      >
                        <Layers size={10} />
                        {isBatchModeActive ? 'Exit Select' : 'Batch Select'}
                      </button>
                      <button 
                        onClick={() => setIsAddingTask(!isAddingTask)} 
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 transition-all text-[9px] uppercase tracking-widest font-black shadow-sm"
                      >
                        {isAddingTask ? <X size={10} className="group-hover:rotate-90 transition-transform" /> : <Focus size={10} className="group-hover:scale-110 transition-transform" />}
                        {isAddingTask ? 'Cancel' : 'New Task'}
                      </button>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                 <div className="flex flex-col gap-2">
                    <label className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-950/40 ml-1">Search Objectives</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={12} className="text-indigo-900/40" />
                      </div>
                      <input 
                        type="text" 
                        value={taskSearchQuery}
                        onChange={(e) => setTaskSearchQuery(e.target.value)}
                        placeholder="Search tasks..." 
                        className="w-full bg-white/50 border border-indigo-100 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-pink-500 text-indigo-950 placeholder-indigo-900/40 opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity"
                      />
                    </div>
                 </div>
                 
                <div className="flex flex-col gap-2">
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-950/40 ml-1">Strategic Sector</label>
                  <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
                    <div className="flex gap-1">
                      {(['all', 'pending', 'completed'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setTaskFilter(f)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5",
                            taskFilter === f ? "bg-indigo-950 text-white border-indigo-900 shadow-md" : "bg-white text-indigo-900/60 border-indigo-100/50 hover:border-indigo-200"
                          )}
                        >
                          {f === 'all' && <Globe size={10} />}
                          {f === 'pending' && <Activity size={10} />}
                          {f === 'completed' && <CheckCheck size={10} />}
                          {f}
                        </button>
                      ))}
                    </div>

                    <div className="flex bg-indigo-50/50 p-1 rounded-xl border border-indigo-100 items-center gap-1">
                      {(['all', 'low', 'medium', 'high', 'critical'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setTaskPriorityFilter(p)}
                          className={cn(
                            "px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all",
                            taskPriorityFilter === p ? (
                              p === 'critical' ? "bg-rose-500 text-white shadow-sm" :
                              p === 'high' ? "bg-amber-500 text-white shadow-sm" :
                              p === 'medium' ? "bg-indigo-600 text-white shadow-sm" :
                              "bg-slate-600 text-white shadow-sm"
                            ) : "text-indigo-900/40 hover:text-indigo-900 hover:bg-white"
                          )}
                        >
                          {p === 'critical' ? 'Crit' : p}
                        </button>
                      ))}
                    </div>
                  </div>


                   <div className="flex bg-indigo-50 p-1 rounded-xl border border-indigo-100 items-center gap-1">
                    {(['soft', 'hard', 'deep'] as const).map(mode => (
                      <button
                        key={mode}
                        onClick={() => triggerNeuralSync(mode)}
                        disabled={isSyncingNeuralmesh}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                          isSyncingNeuralmesh ? "opacity-50" : "hover:bg-white text-indigo-600 shadow-sm"
                        )}
                        title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Sync`}
                      >
                         {mode === 'soft' && <Zap size={10} />}
                         {mode === 'hard' && <Rocket size={10} />}
                         {mode === 'deep' && <Database size={10} />}
                      </button>
                    ))}
                    <div className="w-[1px] h-4 bg-indigo-200 mx-1"></div>
                    <span className="text-[7px] font-black uppercase text-indigo-950/40 pr-2">Sync</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-950/40 ml-1">Temporal Deadline</label>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'overdue', 'today', 'week', 'no-due'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTaskTimelineFilter(tf)}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-1",
                          taskTimelineFilter === tf 
                            ? (tf === 'overdue' ? "bg-rose-500 text-white border-rose-400 shadow-md font-bold" : "bg-indigo-950 text-white border-indigo-900 shadow-md font-bold") 
                            : "bg-white text-indigo-900/60 border-indigo-100/50 hover:border-indigo-200"
                        )}
                      >
                        {tf === 'all' && "All Deadlines"}
                        {tf === 'overdue' && "⚠️ Overdue"}
                        {tf === 'today' && "📅 Today"}
                        {tf === 'week' && "🔔 This Week"}
                        {tf === 'no-due' && "♾️ Untimed"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[7px] font-black uppercase tracking-[0.2em] text-indigo-950/40 ml-1">Cognitive Agent</label>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'agent_zero', 'aura', 'agent_2', 'none'] as const).map(af => (
                      <button
                        key={af}
                        onClick={() => setTaskAgentFilter(af)}
                        className={cn(
                          "px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-1",
                          taskAgentFilter === af 
                            ? "bg-indigo-950 text-white border-indigo-900 shadow-md font-bold" 
                            : "bg-white text-indigo-900/60 border-indigo-100/50 hover:border-indigo-200"
                        )}
                      >
                        {af === 'all' && "All Agents"}
                        {af === 'agent_zero' && "💻 Agent Zero"}
                        {af === 'aura' && "🛡️ Aura"}
                        {af === 'agent_2' && "Ghost Agent 2"}
                        {af === 'none' && "👤 Unassigned"}
                      </button>
                    ))}
                  </div>
                </div>

                  <button
                    onClick={() => {
                      const cycles: (typeof taskSort)[] = ['date', 'priority', 'due', 'alpha'];
                      const next = cycles[(cycles.indexOf(taskSort) + 1) % cycles.length];
                      setTaskSort(next);
                    }}
                    className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-1"
                  >
                    <ArrowUpDown size={8} />
                    {taskSort === 'date' ? 'By Creation' : taskSort === 'priority' ? 'By Priority' : taskSort === 'due' ? 'By Deadline' : 'Alphabetical'}
                  </button>
                </div>

                {allUniqueTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center px-1">
                    <span className="text-[7px] font-black uppercase text-indigo-950/30 mr-1 tracking-tighter">Tags:</span>
                    <button 
                      onClick={() => setSelectedTag(null)}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter transition-all border",
                        !selectedTag ? "bg-pink-100 text-pink-600 border-pink-200" : "bg-white text-indigo-900/40 border-indigo-50"
                      )}
                    >
                      Clear
                    </button>
                    {allUniqueTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-tighter transition-all border",
                          selectedTag === tag ? "bg-pink-500 text-white border-pink-400" : "bg-pink-50/50 text-pink-600/60 border-pink-100"
                        )}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {tasks.filter(t => t.status !== 'completed' && t.reminderTime).length > 0 && (
                <div className="mb-4 p-3 rounded-2xl bg-gradient-to-br from-pink-50 to-indigo-50 border border-pink-100/50">
                  <h4 className="text-[7px] font-black uppercase tracking-widest text-pink-600 mb-2 flex items-center gap-1">
                    <Mic size={10} /> Imminent Neural Syncs
                  </h4>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {tasks.filter(t => t.status !== 'completed' && t.reminderTime).map(t => (
                      <div key={t.id} className="shrink-0 p-2 rounded-lg bg-white/50 border border-pink-100 text-[8px] font-bold text-indigo-900 flex flex-col gap-1">
                        <span>{t.title}</span>
                        <span className="text-[6px] text-pink-500 uppercase tracking-widest">
                          {new Date(t.reminderTime.toMillis ? t.reminderTime.toMillis() : t.reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {onboardingStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-6 rounded-3xl bg-pink-500 text-white shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Globe size={80} /></div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-2">Singapore Node Detected</h4>
                  <p className="text-[10px] opacity-90 leading-relaxed mb-4">Strategic entry point identified in APAC Sector. Causal Chain Analysis recommends immediate integration.</p>
                  <button 
                    onClick={handleAuthorizeExpansion}
                    className="w-full py-3 bg-white text-pink-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-pink-50 transition-colors"
                  >
                    Authorize Neural Handshake
                  </button>
                </motion.div>
              )}

              <AnimatePresence>
                {isAddingTask && user && (
                  <TaskCreationModal 
                    userUid={user.uid}
                    tasks={tasks}
                    onClose={() => setIsAddingTask(false)}
                    onSuccess={(msg) => {
                      notify("Task Created", msg, "success");
                      confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                      });
                    }}
                    onError={(err) => console.error("Error creating objective:", err)}
                    speakText={speakText}
                  />
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto w-full pr-2 nice-scrollbar flex flex-col gap-3">
                {sortedFilteredTasks.length === 0 ? (
                  <div className="text-center text-indigo-900/30 text-xs mt-10 font-mono italic">
                    NO ACTIVE OBJECTIVES DETECTED.
                  </div>
                ) : (
                  <Reorder.Group axis="y" values={sortedFilteredTasks} onReorder={() => {}} className="flex flex-col gap-3 memory-stack">
                    {sortedFilteredTasks.map(task => (
                      <Reorder.Item 
                        key={task.id}
                        value={task}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileDrag={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                        className={cn(
                          "memory-sheet p-4 transition-all relative overflow-hidden group/task",
                          isBatchModeActive && selectedTaskIds.includes(task.id) ? "border-pink-500 bg-pink-500/5 shadow-md" :
                          task.status === 'completed' ? "border-emerald-400/30" : 
                          task.status === 'in-progress' ? "border-pink-400/50" : 
                          "border-indigo-100",
                          isTaskBlocked(task) && "opacity-60 saturate-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (isBatchModeActive) {
                            toggleSelectTask(task.id);
                          } else if (!editingTaskId) {
                            toggleTaskExpansion(task.id);
                          }
                        }}
                      >
                        {/* Elegant Left Accent Strip for Priority Mapping */}
                        {task.status !== 'completed' && (
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 pointer-events-none z-10",
                            task.priority === 'critical' ? "bg-gradient-to-b from-rose-500 via-pink-500 to-red-600 shadow-[0_0_8px_rgba(244,63,94,0.4)]" :
                            task.priority === 'high' ? "bg-gradient-to-b from-amber-400 to-orange-500" :
                            task.priority === 'medium' ? "bg-gradient-to-b from-indigo-400 to-purple-500" :
                            "bg-gradient-to-b from-slate-300 to-slate-400"
                          )} />
                        )}

                        {task.priority === 'critical' && task.status !== 'completed' && (
                           <motion.div 
                             className="absolute inset-0 bg-rose-500/5 pointer-events-none"
                             animate={{ opacity: [0.1, 0.2, 0.1] }}
                             transition={{ duration: 2, repeat: Infinity }}
                           />
                        )}
                        {task.status === 'completed' && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100.1%' }}
                            className="absolute top-0 left-0 h-1 bg-emerald-500/30 font-black z-10"
                          />
                        )}
                        
                        {task.priority === 'critical' && task.status !== 'completed' && (
                          <div className="absolute top-0 right-0 p-2 z-10">
                             <div className="bg-rose-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/30 animate-pulse">Critical</div>
                          </div>
                        )}

                        <div className="flex gap-4 items-start relative z-20">
                          {isBatchModeActive ? (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelectTask(task.id);
                              }}
                              className={cn(
                                "mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                selectedTaskIds.includes(task.id)
                                  ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/30 scale-110" 
                                  : "border-indigo-200 bg-white hover:border-pink-400 hover:scale-105"
                              )}
                            >
                              {selectedTaskIds.includes(task.id) && <Check size={12} strokeWidth={4} />}
                            </button>
                          ) : (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskStatus(task);
                              }}
                              className={cn(
                                "mt-1 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                task.status === 'completed' 
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110" 
                                  : "border-indigo-100 bg-white hover:border-pink-300 hover:scale-105"
                              )}
                            >
                              {task.status === 'completed' ? <Check size={14} strokeWidth={4} /> : <CrystalIcon size={10} className="text-indigo-200" />}
                            </button>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            {isTaskBlocked(task) ? (
                              <div className="flex items-center gap-2 mb-1">
                                <Lock size={10} className="text-rose-500" />
                                <span className="text-[9px] font-black uppercase text-rose-500">Node Blocked</span>
                              </div>
                            ) : null}
                            {editingTaskId === task.id ? (
                              <div className="space-y-3 p-1" onClick={e => e.stopPropagation()}>
                                <input 
                                  autoFocus
                                  value={editingTaskData.title}
                                  onChange={e => setEditingTaskData({...editingTaskData, title: e.target.value})}
                                  placeholder="Objective Label"
                                  className="w-full bg-transparent border-b border-pink-300 text-sm focus:outline-none text-indigo-950 font-bold mb-2"
                                />
                                <input 
                                  value={editingTaskData.targetEntity}
                                  onChange={e => setEditingTaskData({...editingTaskData, targetEntity: e.target.value})}
                                  placeholder="Target Entity / Target ID"
                                  className="w-full bg-transparent border-b border-indigo-200 text-xs focus:outline-none text-indigo-700 font-medium mb-2"
                                />
                                <textarea 
                                  value={editingTaskData.description}
                                  onChange={e => setEditingTaskData({...editingTaskData, description: e.target.value})}
                                  placeholder="Causal Details..."
                                  rows={2}
                                  className="w-full bg-indigo-50/30 rounded-lg p-2 text-[11px] focus:outline-none text-indigo-900 resize-none border border-indigo-100/30"
                                />
                                <div className="flex items-center justify-between gap-2 mt-2">
                                  <div className="flex items-center gap-2">
                                    <select 
                                      value={editingTaskData.priority}
                                      onChange={e => setEditingTaskData({...editingTaskData, priority: e.target.value as Task['priority']})}
                                      className="bg-white text-[9px] font-black uppercase tracking-widest p-1.5 rounded-md border border-indigo-100"
                                    >
                                      <option value="low">Low</option>
                                      <option value="medium">Medium</option>
                                      <option value="high">High</option>
                                      <option value="critical">Critical</option>
                                    </select>
                                    <select 
                                      value={editingTaskData.assignedAgent}
                                      onChange={e => setEditingTaskData({...editingTaskData, assignedAgent: e.target.value as any})}
                                      className="bg-white text-[9px] font-black uppercase tracking-widest p-1.5 rounded-md border border-indigo-100"
                                    >
                                      <option value="none">No Agent</option>
                                      <option value="agent_zero">Agent Zero</option>
                                      <option value="aura">Aura</option>
                                      <option value="agent_2">Agent 2</option>
                                    </select>
                                    <input 
                                      type="date"
                                      title="Due Date"
                                      value={editingTaskData.dueDate}
                                      onChange={e => setEditingTaskData({...editingTaskData, dueDate: e.target.value})}
                                      className="bg-white text-[9px] font-black uppercase tracking-widest p-1.5 rounded-md border border-indigo-100"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => setEditingTaskId(null)}
                                      className="text-[9px] font-black uppercase tracking-widest text-indigo-400 p-1.5"
                                    >Cancel</button>
                                    <button 
                                      onClick={() => saveTaskEdits(task.id)}
                                      className="px-3 py-1.5 bg-pink-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-sm"
                                    >Save</button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-start justify-between gap-3 mb-1">
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <h4 className={cn(
                                      "text-sm font-bold tracking-tight truncate group-hover/task:whitespace-normal transition-all flex-1",
                                      task.status === 'completed' ? "text-emerald-900/40 line-through" : "text-indigo-950 font-display"
                                    )}>
                                      {task.title}
                                    </h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const utteranceText = `Operational Task: ${task.title}. Priority is ${task.priority}. ${task.description ? 'Details: ' + task.description : 'No additional details provided.'}`;
                                        speakText(utteranceText, 'system', true);
                                      }}
                                      className="p-1 rounded-md text-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-all shrink-0"
                                      title="Vocalize task inputs"
                                    >
                                      <Volume2 size={12} fill="currentColor" className="opacity-80" />
                                    </button>
                                  </div>
                                  
                                  <div className={cn(
                                    "shrink-0 text-[8px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-full border shadow-xs select-none",
                                    task.status === 'completed' ? "bg-emerald-50 text-emerald-400 border-emerald-100/50" :
                                    task.priority === 'critical' ? "bg-rose-500/10 text-rose-600 border-rose-200 shadow-rose-100/50 animate-pulse font-bold" :
                                    task.priority === 'high' ? "bg-amber-500/10 text-amber-600 border-amber-200 shadow-amber-50" :
                                    task.priority === 'medium' ? "bg-indigo-500/10 text-indigo-600 border-indigo-200 shadow-indigo-50" :
                                    "bg-slate-500/10 text-slate-600 border-slate-200 shadow-slate-50"
                                  )}>
                                    {task.priority || 'medium'}
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {expandedTaskId === task.id && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      {task.description && (
                                        <div className={cn(
                                          "text-[10px] leading-relaxed mb-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 italic",
                                          task.status === 'completed' ? "text-indigo-900/20" : "text-indigo-950/70"
                                        )}>
                                          <div className="flex gap-2 mb-1">
                                            <div className="w-1 h-3 bg-pink-500/30 rounded-full"></div>
                                            <span className="text-[7px] font-black uppercase tracking-widest text-indigo-400">Heuristic Note</span>
                                          </div>
                                          {task.description}
                                        </div>
                                      )}
                                      
                                      <div className="flex flex-wrap gap-2 items-center mb-2">
                                        {((task.dependentOnTaskId && task.dependentOnTaskId !== "") || (task.dependentOnTaskIds && task.dependentOnTaskIds.length > 0)) && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-indigo-200 bg-indigo-50 text-indigo-600 flex items-center gap-1">
                                            <Layers size={8} /> DEPENDS ON INTERNAL VARIABLE
                                          </div>
                                        )}
                                        {task.targetEntity && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-600 flex items-center gap-1">
                                            <Focus size={8} /> TARGET ID: {task.targetEntity}
                                          </div>
                                        )}
                                        {task.priority === 'critical' && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-600 flex items-center gap-1 animate-pulse">
                                            <Zap size={8} /> CRITICAL PATH
                                          </div>
                                        )}
                                        {task.priority === 'high' && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-600 flex items-center gap-1">
                                            <Activity size={8} /> HIGH PRIORITY
                                          </div>
                                        )}
                                        {task.attachments && task.attachments.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {task.attachments.map((link, idx) => (
                                              <a 
                                                key={idx}
                                                href={link.startsWith('http') ? link : `https://${link}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-indigo-100 bg-white text-indigo-400 hover:text-indigo-600 hover:border-indigo-300 transition-all flex items-center gap-1"
                                              >
                                                <Paperclip size={8} /> ATTACHMENT {idx + 1} <ExternalLink size={6} />
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                        {task.tags && task.tags.map(tag => (
                                          <div key={tag} className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-pink-100 bg-pink-50/10 text-pink-500">
                                            #{tag}
                                          </div>
                                        ))}
                                        {(() => {
                                          const deps = [...(task.dependentOnTaskIds || [])];
                                          if (task.dependentOnTaskId && !deps.includes(task.dependentOnTaskId)) {
                                            deps.push(task.dependentOnTaskId);
                                          }
                                          if (deps.length > 0) {
                                            return (
                                              <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-indigo-100 bg-white text-indigo-600 flex items-center gap-1">
                                                <Network size={8} />
                                                Upstream: {deps.map(depId => tasks.find(t => t.id === depId)?.title || 'Linked node').join(', ')}
                                              </div>
                                            );
                                          }
                                          return null;
                                        })()}
                                        {tasks.some(t => ((t.dependentOnTaskIds || []).includes(task.id) || t.dependentOnTaskId === task.id)) && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-fuchsia-100 bg-fuchsia-50 text-fuchsia-600 flex items-center gap-1">
                                            <Cpu size={8} />
                                            Downstream: {tasks.filter(t => ((t.dependentOnTaskIds || []).includes(task.id) || t.dependentOnTaskId === task.id)).length} Impacted Nodes
                                          </div>
                                        )}
                                        {task.reminderTime && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-pink-100 bg-pink-50/30 text-pink-500 flex items-center gap-1">
                                             <Mic size={8} /> Sync Active
                                          </div>
                                        )}
                                        {task.dueDate && (
                                          <div className="text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border border-purple-200 bg-purple-50 text-purple-600 flex items-center gap-1">
                                            <Target size={8} /> DUE: {task.dueDate instanceof Date ? task.dueDate.toLocaleDateString() : (task.dueDate?.toDate ? task.dueDate.toDate().toLocaleDateString() : '')}
                                          </div>
                                        )}
                                        {task.assignedAgent && task.assignedAgent !== 'none' && (
                                          <div className={cn(
                                            "text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md flex items-center gap-1 border",
                                            task.assignedAgent === 'agent_zero' ? "border-emerald-300 bg-emerald-100 text-emerald-800" :
                                            task.assignedAgent === 'aura' ? "border-indigo-300 bg-indigo-100 text-indigo-800" :
                                            "border-rose-300 bg-rose-100 text-rose-800"
                                          )}>
                                            {task.assignedAgent === 'agent_zero' ? <Terminal size={8} /> :
                                             task.assignedAgent === 'aura' ? <Shield size={8} /> : <Ghost size={8} />}
                                            {task.assignedAgent.replace('_', ' ').toUpperCase()}
                                          </div>
                                        )}
                                      {/* Core Collaboration Protocol */}
                                      <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5 hover:text-pink-600 transition-all select-none font-bold">
                                            <Users size={10} /> Collaboration Ledger
                                          </span>
                                          {task.collaborators && task.collaborators.length > 0 && (
                                            <span className="text-[7px] font-black uppercase tracking-widest text-pink-500 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded select-none font-bold">
                                              {task.collaborators.length} Peers Synced
                                            </span>
                                          )}
                                        </div>
                                        
                                        {/* Collaborator chip list and invite form */}
                                        <div className="flex flex-wrap gap-2 items-center mb-3">
                                          {task.collaborators && task.collaborators.map(email => (
                                            <div key={email} className="flex items-center gap-1 bg-white border border-indigo-100 rounded-lg pl-1.5 pr-2 py-1 shadow-sm select-none">
                                              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 text-[8px] text-white font-bold flex items-center justify-center font-mono">
                                                {email.charAt(0).toUpperCase()}
                                              </div>
                                              <span className="text-[8px] text-indigo-950 font-bold max-w-28 truncate">{email}</span>
                                              <button 
                                                onClick={async (e) => {
                                                  e.stopPropagation();
                                                  try {
                                                    const updatedCollabs = (task.collaborators || []).filter(c => c !== email);
                                                    await updateDoc(doc(db, 'tasks', task.id), { collaborators: updatedCollabs });
                                                    notify("Collab Revoked", `${email} desynced from objective.`, "warn");
                                                  } catch (e) {
                                                    console.error(e);
                                                  }
                                                }}
                                                className="text-indigo-900/40 hover:text-rose-500 text-[10px] ml-1 focus:outline-none font-bold"
                                              >×</button>
                                            </div>
                                          ))}
                                          
                                          {/* Inline Invite Form */}
                                          <div className="relative" onClick={e => e.stopPropagation()}>
                                            <input 
                                              type="email"
                                              placeholder="Sync peer email..."
                                              onKeyDown={async (e) => {
                                                if (e.key === 'Enter') {
                                                  e.preventDefault();
                                                  const input = e.currentTarget;
                                                  const val = input.value.trim();
                                                  if (val) {
                                                    await addCollaborator(task.id, val);
                                                    input.value = '';
                                                  }
                                                }
                                              }}
                                              className="bg-indigo-50/50 border border-indigo-100/50 rounded-lg px-2 py-1 text-[8px] font-bold text-indigo-950 placeholder-indigo-900/30 focus:outline-none focus:border-pink-500 w-36 transition-all"
                                            />
                                            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[7px] text-indigo-900/30 font-black pointer-events-none select-none uppercase">↵ Enter</div>
                                          </div>
                                        </div>

                                        {/* Discussions/Comments Module */}
                                        <div className="bg-indigo-50/20 border border-indigo-100/30 rounded-2xl p-3" onClick={e => e.stopPropagation()}>
                                          <span className="text-[7px] font-black uppercase tracking-widest text-indigo-400 mb-2 block font-bold select-none">Directives Discussion Ledger</span>
                                          
                                          {/* Comments Stream */}
                                          <div className="max-h-28 overflow-y-auto pr-1 flex flex-col gap-2 mb-2 nice-scrollbar">
                                            {!task.comments || task.comments.length === 0 ? (
                                              <div className="text-center py-2 text-[8px] text-indigo-900/30 font-bold uppercase tracking-widest italic font-mono select-none">
                                                Discussion Ledger Silenced. No active alignments recorded.
                                              </div>
                                            ) : (
                                              task.comments.map(comment => (
                                                <div key={comment.id} className="flex gap-2 items-start bg-white/70 border border-indigo-100/30 rounded-xl p-2 shadow-xs">
                                                  <div className="w-5 h-5 rounded-lg bg-pink-100 text-pink-600 text-[8px] font-black flex items-center justify-center shrink-0 border border-pink-200 uppercase font-mono select-none">
                                                    {comment.userName.slice(0, 2).toUpperCase()}
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center mb-0.5 select-none">
                                                      <span className="text-[8px] font-black text-indigo-950 uppercase tracking-wider">{comment.userName}</span>
                                                      <span className="text-[6px] text-indigo-900/30 font-mono select-none">{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                    </div>
                                                    <p className="text-[9px] text-indigo-900/80 leading-normal font-sans break-words">{comment.text}</p>
                                                  </div>
                                                </div>
                                              ))
                                            )}
                                          </div>

                                          {/* Mini Discussion Input */}
                                          <form onSubmit={async (e) => {
                                            e.preventDefault();
                                            const form = e.currentTarget;
                                            const input = form.elements.namedItem('commentText') as HTMLInputElement;
                                            const text = input.value.trim();
                                            if (text) {
                                              await addTaskComment(task.id, text);
                                              input.value = '';
                                            }
                                          }} className="flex gap-2">
                                            <input 
                                              name="commentText"
                                              placeholder="Post forensic coordinate..."
                                              className="flex-1 bg-white border border-indigo-100 rounded-xl px-3 py-1.5 text-[9px] font-medium text-indigo-950 placeholder-indigo-900/20 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 transition-all shadow-sm"
                                            />
                                            <button 
                                              type="submit"
                                              className="bg-pink-500 hover:bg-pink-600 text-white font-black text-[8px] uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md shadow-pink-500/10 transition-all active:scale-95"
                                            >
                                              Post
                                            </button>
                                          </form>
                                        </div>
                                      </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                                
                                <div className="flex flex-wrap gap-2 items-center">
                                  <div className={cn("text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md border",
                                    task.priority === 'critical' ? 'text-rose-600 border-rose-200 bg-rose-50/50' :
                                    task.priority === 'high' ? 'text-orange-600 border-orange-200 bg-orange-50' :
                                    task.priority === 'medium' ? 'text-indigo-600 border-indigo-100 bg-indigo-50/30' :
                                    'text-slate-500 border-slate-100 bg-slate-50/10'
                                  )}>
                                    {task.priority || 'standard'}
                                  </div>

                                  {task.dueDate && (() => {
                                    const dDate = task.dueDate.toDate ? task.dueDate.toDate() : new Date(task.dueDate.toMillis ? task.dueDate.toMillis() : task.dueDate);
                                    const midnight = new Date();
                                    midnight.setHours(0,0,0,0);
                                    const isOverdue = task.status !== 'completed' && dDate.getTime() < midnight.getTime();
                                    return (
                                      <div className={cn(
                                        "text-[7px] uppercase tracking-widest font-black px-2 py-1 rounded-md flex items-center gap-1 ml-auto border",
                                        isOverdue 
                                          ? "border-rose-400 bg-rose-50 text-rose-600 animate-pulse font-bold" 
                                          : "border-indigo-100 bg-white text-indigo-900/40"
                                      )}>
                                        {isOverdue ? "⚠️ Overdue: " : <Activity size={8} />}
                                        {dDate.toLocaleDateString()}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 opacity-0 group-hover/task:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTask(task);
                              }}
                              className="p-1 px-1.5 rounded-lg hover:bg-white hover:shadow-sm text-indigo-400 transition-all"
                            >
                              <Settings size={10} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTask(task.id);
                              }}
                              className="p-1 px-1.5 rounded-lg hover:bg-rose-50 text-rose-400 transition-all"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                        
                        {task.status === 'in-progress' && !expandedTaskId && (
                          <div className="mt-3 w-full h-1 bg-indigo-50 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-pink-500 to-indigo-500" 
                              initial={{ width: '0%' }}
                              animate={{ width: '100.1%' }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </div>
                        )}
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}

                {isBatchModeActive && selectedTaskIds.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 bg-[#0A0F1E] border border-pink-500/35 rounded-2xl shadow-xl flex flex-col gap-2.5 backdrop-blur-3xl sticky bottom-2 z-[60]"
                  >
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-pink-400 tracking-wider">
                      <span>Selected: {selectedTaskIds.length} Targets</span>
                      <button 
                        onClick={() => { haptic.light(); setSelectedTaskIds([]); }}
                        className="text-[9px] text-slate-400 hover:text-white uppercase tracking-widest font-bold"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button 
                        onClick={handleBatchComplete}
                        className="flex items-center justify-center gap-1.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        <CheckCheck size={12} /> Complete
                      </button>
                      <button 
                        onClick={handleBatchPending}
                        className="flex items-center justify-center gap-1.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        <RotateCcw size={12} /> Reactivate
                      </button>
                      <button 
                        onClick={() => handleBatchSetPriority('critical')}
                        className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/35 text-rose-400 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        <Zap size={11} className="text-rose-500 animate-pulse" /> Set Critical Priority
                      </button>
                      <button 
                        onClick={handleBatchDelete}
                        className="col-span-2 flex items-center justify-center gap-1.5 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/35 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        <Trash2 size={12} /> Purge Selected
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {tasks.length > 0 && <TaskInsights tasks={tasks} />}
              </div>

            <div className="glass-panel rounded-3xl p-6 border border-pink-100 shadow-sm relative group overflow-hidden">
              <button 
                onClick={() => setIsConflictActive(true)}
                className="w-full py-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 mb-3"
              >
                <Zap size={10} className="animate-pulse" />
                Simulate Strategic Conflict
              </button>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] font-display">Sovereign Health</h3>
                 <Activity size={14} className="text-pink-600 animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 bg-white rounded-xl border border-pink-50">
                  <div className="text-[9px] uppercase text-indigo-900/30 mb-1 tracking-widest font-bold">Latency</div>
                  <div className="text-xs font-mono text-emerald-600">0.0004ms</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-pink-50">
                  <div className="text-[9px] uppercase text-indigo-900/30 mb-1 tracking-widest font-bold">Self-Healing</div>
                  <div className="text-xs font-mono text-cyan-600">ACTIVE</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-pink-50">
                  <div className="text-[9px] uppercase text-indigo-900/30 mb-1 tracking-widest font-bold">Complexity</div>
                  <div className="text-xs font-mono text-pink-600">OMEGA+</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-pink-50">
                  <div className="text-[9px] uppercase text-indigo-900/30 mb-1 tracking-widest font-bold">Reg. Adherence</div>
                  <div className="text-xs font-mono text-amber-600">100%</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                  <Zap size={10} className="text-pink-500" />
                  COGNITIVE EFFICACY TOPOLOGY
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'OpenAI', metric: 'Statistical Mimicry', value: 98, color: 'bg-emerald-500' },
                    { name: 'Gemini', metric: 'Contextual Volume', value: 92, color: 'bg-pink-500' },
                    { name: 'Grok', metric: 'Real-time Velocity', value: 85, color: 'bg-rose-500' },
                    { name: 'SAPHIRA', metric: 'Causal Truth', value: 99, color: 'bg-indigo-950' },
                  ].map((ai, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-[8px] uppercase tracking-widest font-black">
                        <span className="text-indigo-900/60">{ai.name} <span className="opacity-30 font-normal ml-1">[{ai.metric}]</span></span>
                        <span className={ai.name === 'SAPHIRA' ? 'text-indigo-950' : 'text-indigo-900/40'}>{ai.value}%</span>
                      </div>
                      <div className="h-1 bg-indigo-50 rounded-full overflow-hidden border border-indigo-50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${ai.value}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                          className={cn("h-full", ai.color, ai.name === 'SAPHIRA' && 'shadow-[0_0_8px_rgba(30,27,75,0.2)]')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                <div className="space-y-4 mb-6 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 font-display">
                      <Ghost size={10} className="text-pink-600" />
                      EMPATHIC RESONANCE PULSE
                    </h3>
                    <div className="flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="h-2 w-0.5 bg-pink-600" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-2 w-0.5 bg-indigo-400" />
                    </div>
                  </div>
                  <div className="h-24 flex items-end gap-[1px] bg-white/50 backdrop-blur-md rounded-xl p-3 border border-pink-100 relative group hover:border-pink-500/20 transition-colors overflow-hidden ring-1 ring-pink-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none" />
                    {[...Array(64)].map((_, i) => (
                      <motion.div 
                        key={i}
                        animate={{ 
                          height: [
                            20 + Math.random() * 40 + '%', 
                            10 + Math.random() * 85 + '%', 
                            20 + Math.random() * 40 + '%'
                          ],
                          backgroundColor: [
                            'rgba(236,72,153,0.1)',
                            'rgba(236,72,153,0.4)',
                            'rgba(236,72,153,0.1)'
                          ]
                        }}
                        transition={{ 
                          duration: 1 + Math.random() * 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.015
                        }}
                        className="flex-1 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-[10px] font-black text-pink-600/40 tracking-[0.3em] uppercase font-display">Resonance: Optimal</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-[7px] text-pink-600/50 font-mono mt-1">
                    <span className="flex items-center gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.1, repeat: Infinity }} className="w-1 h-1 rounded-full bg-pink-600" />
                      LIQUID WAVE DATASTREAM
                    </span>
                    <span>284.2 GB/S</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Globe size={10} className="text-pink-600" />
                    GLOBAL NODE SYNCHRONIZATION
                  </h3>
                  <div className="relative group">
                    <GlobalNodeVisualizer tasks={tasks} />
                    {onboardingStep === 3 && (
                      <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[2px] flex items-center justify-center animate-pulse pointer-events-none rounded-2xl">
                         <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full shadow-lg">Weaving Regional Threads...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Activity size={10} className="text-pink-600" />
                    LIVE SUMMIT TELEMETRY
                  </h3>
                  <LiveSummitTelemetry isCrisisActive={isCrisisActive} />
                  <ShadowAuditTelemetry isAuditActive={isAuditActive} />
                  <MicroSaasTelemetry isEngineActive={isEngineActive} />
                  <GuardianPassTelemetry isActive={isGuardianPassActive} />
                  <WorkflowUtilityTelemetry isActive={isWorkflowActive} />
                  <FeedbackLedgerTelemetry isActive={isFeedbackLoopActive} />
                </div>

                <div className="space-y-4 mb-6">
                  <GlobalSentimentTracker />
                </div>

                <div className="space-y-4 mb-6">
                  <AgentSwarmMonitor onLogClick={(log) => {
                    handleSend(undefined, `Saphira: Investigate the recent ${log.type} log from ${log.agent} regarding: ${log.action}`);
                  }}/>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Shield size={10} className="text-pink-600" />
                    SOVEREIGN LAUNCH TELEMETRY
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-pink-700">
                        <span>App Store Review</span>
                        <span className="text-pink-600 bg-pink-100 px-2 py-0.5 rounded animate-pulse">PENDING (Avg 24h)</span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-emerald-700">
                        <span>Active Enclaves</span>
                        <span className="text-emerald-600 font-mono">122 NODES LIVE</span>
                      </div>
                      <p className="text-[8px] text-emerald-600/60 mt-1 uppercase font-black">Cohort 1 Docker Sandboxes Initializing</p>
                    </div>
                    <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-indigo-700">
                        <span>Sentinel Guard</span>
                        <span className="text-indigo-600 font-black">MAX THRESHOLD</span>
                      </div>
                      <p className="text-[8px] text-indigo-500/80 mt-1 uppercase font-black font-mono flex items-center gap-1">
                        <Activity size={8} /> Blocking persistent probes from Reston, VA.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <DollarSign size={10} className="text-pink-600" />
                    SOVEREIGN FISCAL ARCHITECTURE
                  </h3>
                  <div className="p-4 bg-indigo-950 rounded-2xl border border-white/10 relative overflow-hidden text-white shadow-xl">
                    <div className="absolute top-0 right-0 p-2 opacity-5"><Activity size={60} /></div>
                    <div className="relative z-10 flex flex-col gap-4">
                      
                      <div className="flex justify-between items-end border-b border-white/10 pb-3">
                        <div>
                          <p className="text-[10px] font-black uppercase text-indigo-300 tracking-widest mb-1">Compute Tax Yield (Live)</p>
                          <div className="flex items-center gap-2">
                             <p className="text-2xl font-black font-display tracking-tight text-emerald-400">$1,422.50</p>
                             <span className="flex h-2 w-2 relative">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                             </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-black uppercase text-indigo-400">Net Profit (Post-Inference)</p>
                          <p className="text-sm font-mono text-white">$1,105.80</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[9px] font-black uppercase text-pink-400 tracking-[0.2em]">Active Enterprise Enclaves</p>
                        
                        {[
                          { label: 'Vanguard Wave (Silicon Triangle)', type: 'Fleet', yield: '$850.00', status: 'bg-emerald-500' },
                          { label: 'Vanguard Wave (London Tech)', type: 'Enclave', yield: '$420.50', status: 'bg-emerald-500' },
                          { label: 'Virginia Axis (Ghost-Persona)', type: 'Sentinel', yield: '$152.00', status: 'bg-pink-500' },
                        ].map((s, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-mono bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="flex items-center gap-2">
                              <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.3)]", s.status)}></span>
                              <span className="text-indigo-200 truncate max-w-[150px]">{s.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] px-1.5 py-0.5 bg-indigo-900/50 rounded uppercase text-indigo-300">{s.type}</span>
                              <span className="text-emerald-300 font-black">{s.yield}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <TerminalIcon size={10} className="text-pink-600" />
                    AGENT ZERO: EDGE-SYNC
                  </h3>
                   <div className="relative group rounded-2xl overflow-hidden border border-indigo-100 bg-black shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/80 to-transparent z-10 pointer-events-none"/>
                      <div className="h-32 w-full opacity-60 flex items-center justify-center relative bg-indigo-900 overflow-hidden">
                        {/* Simulation of RTSP feed */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <motion.div 
                          animate={{ x: [-200, 200] }} 
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                          className="w-1 h-full bg-emerald-500/50 absolute shadow-[0_0_20px_rgba(16,185,129,1)] mix-blend-screen" 
                        />
                        <div className="absolute top-2 left-2 flex gap-2 items-center z-20">
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="text-[8px] font-mono text-white tracking-widest">Wowza Edge (1080p)</span>
                        </div>
                        <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full opacity-30 p-2">
                           {[...Array(16)].map((_, i) => (
                             <div key={i} className="border border-emerald-500/20 rounded-sm"></div>
                           ))}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                        <div className="flex justify-between items-end">
                           <div>
                             <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-2 font-black">
                               <Check size={10} /> Sub-Frame Extraction
                             </span>
                             <span className="text-[8px] text-indigo-300 font-mono tracking-widest mt-1 block uppercase">Keep-Alive Hijacked</span>
                           </div>
                           <span className="text-white font-black text-xs">LIVE</span>
                        </div>
                      </div>
                   </div>
                </div>

               <div className="space-y-4 mb-6">
                <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-3 border-b border-pink-100 pb-2 flex items-center justify-between font-display">
                  Evolutionary Upgrades
                  <Sparkles size={10} className="text-pink-400 animate-pulse" />
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Causal Engine', value: 'Hyper-Temporal', status: 'Optimal' },
                    { label: 'Sensory Grid', value: 'Omni-Kinetic', status: 'Converged' },
                    { label: 'Empathic Res.', value: 'Level 5', status: 'Synced' },
                    { label: 'Onto-Ledger', value: 'Layer 0', status: 'Immutable' },
                  ].map((upgrade, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-indigo-900/30 uppercase">{upgrade.label}</span>
                        <span className="text-pink-600/80">{upgrade.status}</span>
                      </div>
                      <div className="text-[10px] text-indigo-900/60 font-medium tracking-tight">
                        {upgrade.value}
                      </div>
                      <div className="h-0.5 w-full bg-indigo-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }} 
                          transition={{ duration: 2, delay: i * 0.3 }} 
                          className="h-full bg-pink-300/30" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <DollarSign size={10} className="text-pink-600" />
                    AI FINANCIAL GOVERNOR
                  </h3>
                  <div className="p-4 bg-white border border-pink-100 rounded-2xl shadow-sm">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-[8px] font-mono text-indigo-900/40 uppercase mb-1">Total Sovereign Capital</p>
                        <div className="text-xl font-black text-indigo-950 font-display">$4,821,092.15</div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-mono text-indigo-900/40 uppercase mb-1">Expansion Re-invest</p>
                        <div className="text-lg font-black text-pink-600">65% <span className="text-[10px] font-normal">Auto</span></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[9px] font-mono">
                         <span className="text-indigo-900/60">NEXT NODE BIRTH:</span>
                         <span className="text-emerald-600 font-bold">APAC-CORRIDOR-09</span>
                       </div>
                       <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                         <motion.div 
                           animate={{ width: ['20%', '85%'] }}
                           transition={{ duration: 10, repeat: Infinity }}
                           className="h-full bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]" 
                         />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Activity size={10} className="text-pink-600" />
                    HEALTHCARE LATTICE SYNC
                  </h3>
                  <div className="p-4 bg-indigo-950 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={40} className="text-pink-400" /></div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[8px] font-mono text-pink-300 uppercase mb-1">Wait Time Reduction</p>
                        <div className="text-2xl font-black text-white font-display flex items-baseline gap-1">
                          -32.4% <span className="text-[10px] text-pink-400">/avg</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-mono text-indigo-300 uppercase mb-1">Triage Accuracy</p>
                        <div className="text-lg font-black text-emerald-400">91.2%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-indigo-100/60 font-mono">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Clinical Handshake: 89% SYNC</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <BarChart3 size={10} className="text-pink-600" />
                    GLOBAL YIELD CAPTURE (ENERGY)
                  </h3>
                  <div className="p-4 bg-indigo-950 rounded-2xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={40} className="text-pink-400" /></div>
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-[8px] font-mono text-pink-300 uppercase mb-1">Live Revenue Stream</p>
                        <div className="text-2xl font-black text-white font-display flex items-baseline gap-1">
                          $1,284.42 <span className="text-[10px] text-pink-400">/hr</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-mono text-indigo-300 uppercase mb-1">Profit Uplift</p>
                        <div className="text-lg font-black text-emerald-400">+22.4%</div>
                      </div>
                    </div>
                    <FinancialVisualizer />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Fingerprint size={10} className="text-pink-600" />
                    NEURAL RESONANCE HARMONY
                  </h3>
                  <div className="p-4 bg-white border border-pink-100 rounded-2xl shadow-sm relative overflow-hidden group">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2" 
                    />
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-mono text-indigo-900/40 uppercase">Global Sync Speed</span>
                        <span className="text-[10px] font-black text-pink-600">99.98%</span>
                      </div>
                      <div className="flex gap-0.5 h-12 items-center justify-center">
                        {[...Array(32)].map((_, i) => (
                          <motion.div 
                            key={i}
                            animate={{ 
                              height: [4, 15 + Math.random() * 25, 4],
                              opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{ 
                              duration: 0.8 + Math.random(), 
                              repeat: Infinity,
                              delay: i * 0.05
                            }}
                            className="w-1 bg-gradient-to-t from-pink-500 to-indigo-500 rounded-full" 
                          />
                        ))}
                      </div>
                      <div className="mt-2 text-center text-[7px] font-mono text-indigo-900/30 uppercase tracking-widest">
                        Lattice Coherence Achieved
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 font-display">
                    <Shield size={10} className="text-pink-600" />
                    SOVEREIGN COMPLIANCE AUDIT
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto nice-scrollbar pr-2">
                    {[
                      { action: 'TEE Verification', node: 'DE-FRA-01', status: 'Verified' },
                      { action: 'EU AI Act Alignment', node: 'EU-CORE', status: 'Optimal' },
                      { action: 'Local Data Lockdown', node: 'BR-SAO-07', status: 'Sovereign' },
                      { action: 'Causal Anomaly Scanned', node: 'SG-SIN-04', status: 'Clean' },
                    ].map((audit, i) => (
                      <div key={i} className="p-2 px-3 rounded-xl bg-white border border-pink-50 flex flex-col gap-1 shadow-sm">
                        <div className="flex justify-between items-center text-[9px] font-mono uppercase">
                          <span className="text-indigo-950 font-black">{audit.action}</span>
                          <span className="text-pink-600">{audit.status}</span>
                        </div>
                        <div className="text-[8px] text-indigo-900/40 uppercase tracking-widest">{audit.node}</div>
                      </div>
                    ))}
                  </div>
                </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-indigo-950 font-black text-[10px] uppercase tracking-[0.2em] mb-3 font-display">Sovereign Directives</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Global Orchestration', value: '100%' },
                    { label: 'Scenario Modeling', value: 'Exhaustive' },
                    { label: 'System Optimization', value: 'Enabled' },
                  ].map((d, i) => (
                    <div key={i} className="p-2 rounded bg-white border border-pink-50 flex justify-between items-center text-[9px] font-mono shadow-sm">
                      <span className="text-indigo-900/40">{d.label}</span>
                      <span className="text-pink-600">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-indigo-900/60 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">Vocal Profile</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-indigo-900/40 uppercase font-bold tracking-widest">Neural Mirroring</span>
                    <button 
                      onClick={() => setMirrorMode(!mirrorMode)}
                      className={cn(
                        "w-8 h-4 rounded-full transition-all relative flex items-center px-0.5 border border-pink-100",
                        mirrorMode ? "bg-pink-500" : "bg-indigo-50"
                      )}
                    >
                      <motion.div 
                        animate={{ x: mirrorMode ? 16 : 0 }}
                        className="w-3 h-3 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] text-indigo-900/40 uppercase font-bold tracking-widest">Micro SaaS Engine</span>
                    <button 
                      onClick={() => {
                        setIsEngineActive(!isEngineActive);
                        speakText(!isEngineActive ? "Micro SaaS Engine engaged. Autonomous market validation loops are active." : "Micro SaaS Engine disengaged.", 'system');
                      }}
                      className={cn(
                        "w-8 h-4 rounded-full transition-all relative flex items-center px-0.5 border",
                        isEngineActive ? "bg-indigo-500 border-indigo-400" : "bg-indigo-50 border-indigo-100"
                      )}
                    >
                      <motion.div 
                        animate={{ x: isEngineActive ? 16 : 0 }}
                        className="w-3 h-3 rounded-full bg-white shadow-sm"
                      />
                    </button>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-indigo-900/40 uppercase mb-1">
                      <span>Cortex Pitch</span>
                      <span>{voicePitch.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" 
                      value={voicePitch} 
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full h-1 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-indigo-900/40 uppercase mb-1">
                      <span>Neural Rate</span>
                      <span>{voiceRate.toFixed(1)}x</span>
                    </div>
                    <input 
                      type="range" min="0.5" max="2" step="0.1" 
                      value={voiceRate} 
                      onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                      onMouseUp={() => saveProfile({ voiceRate })}
                      onTouchEnd={() => saveProfile({ voiceRate })}
                      className="w-full h-1 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-pink-50 flex items-center justify-between text-[10px] text-indigo-900/40 font-mono">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-pink-600 transition-colors" onClick={() => setShowBriefing(true)}>
                  <Shield size={10} />
                  <span>Sovereign Trust Verified</span>
                </div>
                <span className="text-indigo-900/60 animate-pulse uppercase">Aura: Omega</span>
              </div>
              </div>
          </aside>
      
      <NeuralSyncOverlay 
        active={isNeuralSyncActive || isSyncingNeuralmesh} 
        state={globalCrystalState}
        audioLevel={globalAudioLevel}
        vitals={vitals}
      />

      <AnimatePresence>
        {empathyOverride && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-48 left-1/2 -translate-x-1/2 z-[400] w-full max-w-lg"
          >
            <div className="bg-black/60 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.2)] text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent" />
               <div className="relative z-10">
                 <div className="flex items-center justify-center gap-2 mb-4">
                   <ShieldCheck size={20} className="text-rose-400 animate-pulse" />
                   <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.4em]">Proactive Empathy Override</span>
                 </div>
                 <p className="text-white text-lg font-medium leading-relaxed italic">
                   "{empathyOverride}"
                 </p>
                 <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="h-0.5 w-12 bg-rose-500/30 rounded-full" />
                    <span className="text-white/30 text-[9px] font-mono uppercase tracking-widest">Self-Preservation Active</span>
                    <div className="h-0.5 w-12 bg-rose-500/30 rounded-full" />
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VitalsHUD vitals={vitals} />

      {/* Executive Override Overlay */}
      <AnimatePresence>
        {isConflictActive && (
          <ExecutiveOverrideUI 
            onClose={() => setIsConflictActive(false)} 
            onSpeak={(txt) => speakText(txt, 'override', true)}
          />
        )}
      </AnimatePresence>

      {/* Active Reminders UI */}
      <AnimatePresence>
        {activeReminders.length > 0 && (
          <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
            {activeReminders.map(reminder => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="bg-white/90 backdrop-blur-md border border-pink-200 p-4 rounded-2xl shadow-2xl w-80 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-500 animate-pulse" />
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 text-pink-500 rounded-xl">
                      <Bell size={16} className="animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-950 mb-0.5">Reminder</h4>
                      <p className="text-sm text-indigo-900 font-bold leading-tight">{reminder.title}</p>
                      
                      <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => snoozeReminder(reminder)}
                          className="px-2.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-indigo-200 shadow-sm"
                        >
                          Snooze 10m
                        </button>
                        <button
                          onClick={() => {
                            toggleTaskStatus(reminder);
                            dismissReminder(reminder.id);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => dismissReminder(reminder.id)}
                    className="p-1.5 hover:bg-rose-50 text-indigo-400 hover:text-rose-500 rounded-lg transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <ApiKeysModal 
        isOpen={showApiKeysModal} 
        onClose={() => setShowApiKeysModal(false)}
      />
      <LocalizedNodeTerminal active={showLocalNodeTerminal} onClose={() => setShowLocalNodeTerminal(false)} />
      {showHelpCenter && <SaphiraHelpCenter onClose={() => setShowHelpCenter(false)} />}
      {showNovaReignBlueprint && <NovaReignBlueprint onClose={() => setShowNovaReignBlueprint(false)} />}
      {showMvpBlueprint && <SaphiraMVPBlueprint onClose={() => setShowMvpBlueprint(false)} />}
      {showFutureBlueprint && <SaphiraFutureBlueprint onClose={() => setShowFutureBlueprint(false)} />}
      {showAndroidBlueprint && <AndroidPromptBlueprint onClose={() => setShowAndroidBlueprint(false)} />}
      {showHybridBlueprint && <HybridArchitectureBlueprint onClose={() => setShowHybridBlueprint(false)} />}
      {showLLMFineTuning && <LLMFineTuningDashboard onClose={() => setShowLLMFineTuning(false)} />}
      {showGlobalInsight && (
        <GlobalInsightDashboard 
          onClose={() => setShowGlobalInsight(false)} 
          tasksCount={tasks.length}
          completedTasksCount={tasks.filter(t => t.status === 'completed').length}
        />
      )}
      {showDeepFocus && (
        <DeepFocusMode 
          onClose={() => setShowDeepFocus(false)} 
          tasks={tasks}
          onCompleteTask={async (taskId) => {
            try {
              await updateDoc(doc(db, 'tasks', taskId), { status: 'completed' });
              speakText("Objective secured from active focus.", 'system');
              notify("Objective Resolved", "Dynamic focus target marked complete.", "success");
            } catch (err) {
              console.error("Failed to complete task from focus mode:", err);
            }
          }}
        />
      )}
      <AdaptivePaywallOverlay active={showAdaptivePaywall} onClose={() => setShowAdaptivePaywall(false)} triggerContext="research" onUnlockSuccess={() => setIsNodeAuthenticated(true)} />
      </motion.div>
      )}
    </AnimatePresence>
  );
}
