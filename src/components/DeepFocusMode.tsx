import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Sparkles, 
  CheckCircle, ArrowLeft, Headphones, Compass, Award, Music 
} from 'lucide-react';
import { haptic } from '../services/haptics';
import { cn } from '../lib/utils';

// Core Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface DeepFocusModeProps {
  onClose: () => void;
  tasks: Task[];
  onCompleteTask: (taskId: string) => void;
}

type AudioPreset = 'delta' | 'solfeggio' | 'golden' | 'off';

export function DeepFocusMode({ onClose, tasks, onCompleteTask }: DeepFocusModeProps) {
  // Timer States
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  
  // Audio Synthesis States
  const [audioPreset, setAudioPreset] = useState<AudioPreset>('off');
  const [volume, setVolume] = useState(0.3);
  
  // Selected Focus Objective
  const [selectedTask, setSelectedTask] = useState<Task | null>(() => {
    const pending = tasks.filter(t => t.status !== 'completed');
    return pending.length > 0 ? pending[0] : null;
  });

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Success celebration particles
  const [showSplash, setShowSplash] = useState(false);

  // Initialize and update Audio oscillators
  useEffect(() => {
    return () => {
      stopOscillators();
    };
  }, []);

  // Sync volume with gain node
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Handle Preset Changes
  useEffect(() => {
    if (audioPreset === 'off') {
      stopOscillators();
    } else {
      startOscillators(audioPreset);
    }
  }, [audioPreset]);

  const startOscillators = (preset: AudioPreset) => {
    try {
      stopOscillators();

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create Nodes
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(volume, ctx.currentTime);

      // Frequencies for binaural effect (separated slightly to trigger binaural beat in brain)
      let freq1 = 200;
      let freq2 = 204; // 4Hz difference: Deep Theta/Delta

      if (preset === 'solfeggio') {
        freq1 = 432; // Cosmic tuning
        freq2 = 436; // 4Hz beat
      } else if (preset === 'golden') {
        freq1 = 144; // Golden Ratio base
        freq2 = 149.618; // Golden phi beat
      } else if (preset === 'delta') {
        freq1 = 100;
        freq2 = 104.5;
      }

      osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime);

      // Low-pass filter to make sound smooth, safe, and warm
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, ctx.currentTime);

      // Route
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      gainNodeRef.current = gain;
      
      haptic.medium();
    } catch (e) {
      console.error('Failed to synthesize audio neural loops:', e);
    }
  };

  const stopOscillators = () => {
    try {
      if (osc1Ref.current) {
        osc1Ref.current.stop();
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        osc2Ref.current.stop();
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    } catch (e) {
      // already stopped
    }
  };

  // Timer Interval Engine
  useEffect(() => {
    let timerId: any = null;
    if (isRunning && secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerCompleted();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, secondsLeft]);

  const handleTimerCompleted = () => {
    setIsRunning(false);
    haptic.success();
    // Vibrate browser strongly
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
    setShowSplash(true);
  };

  const toggleTimer = () => {
    haptic.light();
    setIsRunning(!isRunning);
    
    // Resume audio context if custom focus audio is selected
    if (!isRunning && audioPreset !== 'off' && audioCtxRef.current) {
      audioCtxRef.current.resume();
    }
  };

  const resetTimer = (mins: number = 25) => {
    haptic.light();
    setIsRunning(false);
    setSecondsLeft(mins * 60);
    setTotalSeconds(mins * 60);
  };

  const selectTaskAsObjective = (task: Task) => {
    haptic.light();
    setSelectedTask(task);
  };

  const resolveObjective = () => {
    if (!selectedTask) return;
    
    haptic.success();
    onCompleteTask(selectedTask.id);
    
    // Show beautiful success celebration
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    // Auto select next pending task
    const remaining = tasks.filter(t => t.status !== 'completed' && t.id !== selectedTask.id);
    if (remaining.length > 0) {
      setSelectedTask(remaining[0]);
    } else {
      setSelectedTask(null);
    }
  };

  // Timer format utility
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-950 text-white flex flex-col items-center justify-between p-6 md:p-12 overflow-hidden select-none">
      
      {/* Absolute Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
        
        {/* Subtle geometric calibration grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvc3ZnPg==')] opacity-60"></div>
      </div>

      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-pink-500/10 z-[130] backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -30 }}
              className="bg-slate-900 border border-pink-500/30 rounded-3xl p-8 max-w-sm shadow-[0_0_50px_rgba(236,72,153,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-indigo-400 to-pink-500" />
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400 border border-pink-500/20 mx-auto mb-4 animate-bounce">
                <Award size={36} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white font-display">Deep Sync Accomplished</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-2.5">
                Excellent focus. Your neural capacity has been optimized and the core objective logged securely. Standby for subsequent tactical phases.
              </p>
              <button 
                onClick={() => { haptic.light(); setShowSplash(false); }}
                className="mt-6 px-8 py-2.5 bg-pink-500 text-white rounded-xl text-2xl font-black font-display tracking-widest hover:bg-pink-600 transition-colors uppercase text-[9px]"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Header */}
      <header className="w-full relative z-10 flex items-center justify-between">
        <button 
          onClick={() => {
            haptic.light();
            stopOscillators();
            onClose();
          }}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all backdrop-blur-md"
        >
          <ArrowLeft size={14} /> Exit Sanctuary
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400">Deep Focus Engine</span>
        </div>
      </header>

      {/* Main Focus Clock Grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10 my-auto">
        
        {/* Left Column: Countdown Zen Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-white/5 flex items-center justify-center relative">
            
            {/* Pulsing Concentric Visual Ring */}
            <div className={cn(
              "absolute inset-3 rounded-full border-2 border-dashed border-indigo-500/10 transition-all duration-1000",
              isRunning ? "animate-[spin_120s_linear_infinite] border-pink-500/20" : ""
            )} />
            
            {/* Constant Breath Light in core */}
            <motion.div 
              animate={{ 
                scale: isRunning ? [1, 1.08, 1] : [1, 1.03, 1],
                opacity: isRunning ? [0.15, 0.35, 0.15] : [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-10 rounded-full bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 blur-xl pointer-events-none"
            />

            {/* Glowing countdown state */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="50%" 
                cy="50%" 
                r="46%" 
                fill="transparent" 
                stroke="rgba(255,255,255,0.02)" 
                strokeWidth="4"
              />
              <motion.circle 
                cx="50%" 
                cy="50%" 
                r="46%" 
                fill="transparent" 
                stroke="url(#progressGradient)" 
                strokeWidth="6"
                strokeDasharray="289%" /* approximate circle perimeter percentage */
                strokeDashoffset={`${100 - progressPercentage}%`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Numeric Clock */}
            <div className="text-center relative z-10">
              <motion.div 
                key={secondsLeft}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="text-5xl md:text-6xl font-thin tracking-tight font-mono text-white/90"
              >
                {formatTime(secondsLeft)}
              </motion.div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1 block">
                {isRunning ? 'FOCUS UNWINDING' : 'ZEN SUSPENDED'}
              </span>
            </div>
          </div>

          {/* Clock Control Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button 
              onClick={toggleTimer}
              className={cn(
                "px-8 py-3.5 rounded-2xl text-[10px] uppercase font-black tracking-widest shadow-xl transition-all duration-305 flex items-center gap-2",
                isRunning ? "bg-white text-slate-950 hover:bg-slate-100" : "bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/20"
              )}
            >
              {isRunning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              {isRunning ? 'Interrupt' : 'Engage Focus'}
            </button>
            <button 
              onClick={() => resetTimer(25)}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 hover:border-white/10 transition-transform hover:rotate-45"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Quick preset timers */}
          <div className="flex gap-2 mt-4 text-[9px] font-bold uppercase tracking-wider text-slate-500">
            <button onClick={() => resetTimer(15)} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10">15m</button>
            <button onClick={() => resetTimer(25)} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10">25m</button>
            <button onClick={() => resetTimer(45)} className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/20">45m</button>
          </div>
        </div>

        {/* Right Column: Singled Focus Objective & Ambient Waves */}
        <div className="space-y-6">
          
          {/* Objective Box */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-400 block mb-2.5">
              Primary Calibration Target
            </span>

            {selectedTask ? (
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-1.5">{selectedTask.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedTask.description || "No specific sub-description logged for this digital priority."}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  {/* Priority indicator */}
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                    selectedTask.priority === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    selectedTask.priority === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    selectedTask.priority === 'medium' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-slate-500/10 text-slate-400 border-white/5'
                  )}>
                    {selectedTask.priority}
                  </span>

                  <button 
                    onClick={resolveObjective}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 border border-[#39FF14]/30 text-[#39FF14] rounded-xl text-[9px] font-black tracking-widest uppercase transition-all"
                  >
                    <CheckCircle size={10} /> Mark Resolved
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-slate-500 italic">No pending objectives selected.</p>
              </div>
            )}
          </div>

          {/* Ambient Sounds Synth Container */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-pink-400 flex items-center gap-1.5">
                <Music size={12} /> Ambient Neural Oscillator Loop
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                Web Audio Synth (432Hz Core)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'delta', label: 'Binaural Delta Wave (Deep)', desc: '100Hz base • 4Hz Alpha beat' },
                { id: 'solfeggio', label: 'Harmonic Solfeggio', desc: '432Hz base frequency code' },
                { id: 'golden', label: 'Golden Ratio phi Beat', desc: '144Hz • 5.6Hz calming beat' },
                { id: 'off', label: 'Silence / Off', desc: 'Mute continuous oscillator' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setAudioPreset(preset.id as AudioPreset)}
                  className={cn(
                    "p-3 rounded-2xl border text-left transition-all relative overflow-hidden group",
                    audioPreset === preset.id
                      ? "bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border-pink-500/40 text-white ring-1 ring-pink-500/20"
                      : "bg-white/[0.01] hover:bg-white/[0.04] border-white/5 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <div className="font-bold text-[10px] uppercase tracking-wider">{preset.label}</div>
                  <div className="text-[8px] opacity-75 mt-0.5">{preset.desc}</div>
                </button>
              ))}
            </div>

            {/* Audio Volume Controller */}
            {audioPreset !== 'off' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 pt-2"
              >
                <Compass size={14} className="text-pink-400 rotate-180" />
                <input 
                  type="range" 
                  min="0" 
                  max="0.8" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-pink-500 h-1 bg-white/10 rounded-full cursor-pointer touch-none"
                />
                <span className="font-mono text-[9px] text-slate-400 w-8 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </motion.div>
            )}
          </div>

          {/* Pending Objectives Selector list */}
          <div className="space-y-2">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 block pl-2">
              Select Alternate Objective
            </span>
            <div className="max-h-[160px] overflow-y-auto pr-1 nice-scrollbar space-y-1 bg-white/[0.01] p-2 rounded-2xl border border-white/5">
              {tasks.filter(t => t.status !== 'completed').map((task) => (
                <button
                  key={task.id}
                  onClick={() => selectTaskAsObjective(task)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 bg-[#0c1020]",
                    selectedTask?.id === task.id
                      ? "border-pink-500/30 text-white"
                      : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
                  )}
                >
                  <span className="truncate font-bold tracking-tight">{task.title}</span>
                  <span className={cn(
                    "text-[7px] font-black uppercase tracking-widest leading-none px-1.5 py-0.5 rounded",
                    task.priority === 'critical' ? 'text-rose-400 bg-rose-500/10' :
                    task.priority === 'high' ? 'text-amber-400 bg-amber-500/10' :
                    'text-slate-500 bg-slate-500/10'
                  )}>
                    {task.priority}
                  </span>
                </button>
              ))}
              {tasks.filter(t => t.status !== 'completed').length === 0 && (
                <div className="py-4 text-center cursor-default">
                  <span className="text-[10px] text-slate-600 font-mono italic">No remaining pending objectives.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer System Lock */}
      <footer className="w-full relative z-10 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5 pt-6 text-center text-slate-500">
        <span className="text-[8px] font-black uppercase tracking-[0.2em]">
          Sanctuary Calibration Unit • Identity Lock: Chelsea Woods
        </span>
        <div className="flex gap-4 text-[8px] font-black uppercase tracking-[0.1em]">
          <span>432hz SOLFEGGIO ACTUATORS: STANDBY</span>
          <span>COGNITIVE FOCUS BUFFER: SECURED</span>
        </div>
      </footer>
    </div>
  );
}
export default DeepFocusMode;
