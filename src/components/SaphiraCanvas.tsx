import React, { useState, useEffect } from 'react';

// --- STAGE 1: TYPE DEFINITIONS FOR PIPELINE STATES ---
type PipelineState = 'idle' | 'executing' | 'success' | 'throttled' | 'circuit_tripped';

interface TelemetryMetrics {
  memorySpend: number;       // Current token context consumption (up to 2M)
  bucketTokens: number;      // Remaining items in Redis rate limiter bucket
  sandboxExitCode: number | null;
  failureCount: number;      // Circuit breaker iteration tracking (0-5)
  lastFaultLog: string | null;
}

interface SaphiraCanvasProps {
  initialState?: PipelineState;
  initialMetrics?: TelemetryMetrics;
  taskIntent?: string;
}

export const SaphiraCanvas: React.FC<SaphiraCanvasProps> = ({
  initialState = 'idle',
  initialMetrics = { memorySpend: 142000, bucketTokens: 100, sandboxExitCode: null, failureCount: 0, lastFaultLog: null },
  taskIntent = "Orchestrate autonomous container self-patch routine"
}) => {
  const [pipelineState, setPipelineState] = useState<PipelineState>(initialState);
  const [metrics, setMetrics] = useState<TelemetryMetrics>(initialMetrics);

  // Dynamic context percentage calculation for the 2M token ceiling
  const contextPercentage = Math.min((metrics.memorySpend / 2000000) * 100, 100);

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#121212] font-sans antialiased p-6 flex flex-col justify-between relative overflow-hidden selection:bg-[#FF007F] selection:text-white">
      
      {/* BACKGROUND GRAPHIC ACCENTS: Subtle high-fidelity spatial gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF007F]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-gray-200 to-transparent blur-2xl pointer-events-none" />

      {/* --- HEADER: PLATFORM IDENTIFIER --- */}
      <header className="w-full flex justify-between items-center z-10">
        <div>
          <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">Sovereign Intelligence Ecosystem</span>
          <h1 className="text-2xl font-bold tracking-tight text-black mt-0.5">Saphira <span className="text-[#FF007F]">AI</span></h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-[#FF007F] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-500">Nova Umbrella</span>
        </div>
      </header>

      {/* --- MAIN CORE INTERFACE: THE LIQUID GLASS CANVAS --- */}
      <main className="w-full max-w-md mx-auto my-auto z-10 py-8 space-y-6">
        
        {/* TASK INTENT CARD (Pristine Light Panel) */}
        <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]">
          <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">Target Intent Execution</span>
          <p className="text-sm font-medium text-gray-800 leading-relaxed font-mono">{taskIntent}</p>
        </div>

        {/* PRIMARY CONTROLLER / OUTPUT STATUS GLASS MODAL */}
        <div className={`relative transition-all duration-500 ease-out rounded-[32px] p-6 border shadow-[0_24px_64px_-16px_rgba(0,0,0,0.04)]
          ${pipelineState === 'circuit_tripped' 
            ? 'bg-white/40 backdrop-blur-xl border-[#FF007F]/30 shadow-[0_24px_64px_-16px_rgba(255,0,127,0.06)]' 
            : 'bg-white/60 backdrop-blur-lg border-white/80'
          }`}
        >
          {/* Neon Pink Alert Mesh Overlay — Active only during Circuit Breaker Trips */}
          {pipelineState === 'circuit_tripped' && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF007F]/[0.02] to-transparent rounded-[32px] pointer-events-none animate-fade-in" />
          )}

          <div className="relative z-10 space-y-6">
            
            {/* Dynamic Status Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-0.5">Core System State</span>
                <h2 className="text-xl font-bold tracking-tight uppercase font-mono">
                  {pipelineState === 'idle' && 'System Idle'}
                  {pipelineState === 'executing' && <span className="text-gray-900 animate-pulse">Running Crucible...</span>}
                  {pipelineState === 'success' && <span className="text-emerald-600">Skill Validated</span>}
                  {pipelineState === 'throttled' && <span className="text-amber-500">Throttled</span>}
                  {pipelineState === 'circuit_tripped' && <span className="text-[#FF007F]">Breaker Tripped</span>}
                </h2>
              </div>
              
              {/* Iteration Micro-Matrix Counters */}
              <div className="flex space-x-1 pt-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div 
                    key={step}
                    className={`h-1.5 w-3 rounded-full transition-all duration-300 
                      ${step <= metrics.failureCount 
                        ? 'bg-[#FF007F] shadow-[0_0_8px_rgba(255,0,127,0.6)]' 
                        : 'bg-gray-200'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* PIPELINE OUTPUT TEXT ZONE */}
            <div className="min-h-[100px] bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col justify-between font-mono text-xs">
              {pipelineState === 'idle' && (
                <span className="text-gray-400 italic">Standing by for next strategic command payload...</span>
              )}
              {pipelineState === 'executing' && (
                <span className="text-gray-600 animate-pulse">[saphira_sandbox.py] Spinning up isolated container cell; executing fuzz vectors...</span>
              )}
              {pipelineState === 'success' && (
                <div className="space-y-1">
                  <span className="text-emerald-600 font-bold">[++] SUCCESS_CRITERIA_MET</span>
                  <p className="text-gray-600 text-[11px]">Logic registered perfectly. Module committed to persistent saphira_skill_store.json.</p>
                </div>
              )}
              {pipelineState === 'throttled' && (
                <div className="space-y-1">
                  <span className="text-amber-600 font-bold">[-] RATE_LIMIT_EXHAUSTED</span>
                  <p className="text-gray-600 text-[11px]">Redis Token Bucket depleted. Active throttle engaged to guard infrastructure spend limits.</p>
                </div>
              )}
              {pipelineState === 'circuit_tripped' && (
                <div className="space-y-1.5">
                  <span className="text-[#FF007F] font-bold">[!!!] TERMINAL_CIRCUIT_BREAKER_TRIPPED</span>
                  <p className="text-gray-700 text-[11px] leading-normal font-sans bg-white/80 border border-[#FF007F]/20 p-2 rounded-lg text-[#FF007F]">
                    {metrics.lastFaultLog || "Recursive self-patch loop halted at limit (5/5 attempts) to prevent environment degradation."}
                  </p>
                </div>
              )}
            </div>

            {/* REAL-TIME METRIC GRAPH COMPONENT */}
            <div className="space-y-4 pt-2 border-t border-gray-100/80">
              {/* Context Metric Window Tracker */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Context Window Capacity</span>
                  <span className="font-bold text-gray-700">{(metrics.memorySpend / 1000).toFixed(0)}k / 2,000k tokens</span>
                </div>
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${contextPercentage}%` }}
                  />
                </div>
              </div>

              {/* Ingress Token Bucket State */}
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-gray-400">Redis Limiter Capacity</span>
                <span className={`font-bold ${metrics.bucketTokens < 20 ? 'text-[#FF007F]' : 'text-gray-700'}`}>
                  {metrics.bucketTokens}% Operational Balance
                </span>
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* --- BOTTOM INTERACTIVE TRIGGER DECK: FOR TESTING RUNTIME STATES --- */}
      <footer className="w-full max-w-md mx-auto z-10 bg-white/50 backdrop-blur-md border border-white/40 p-2.5 rounded-2xl shadow-sm flex justify-between gap-1.5 overflow-x-auto">
        <button 
          onClick={() => {
            setPipelineState('executing');
            setMetrics(m => ({ ...m, failureCount: 0, lastFaultLog: null }));
          }}
          className="px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all bg-gradient-to-r from-[#FF007F] to-[#87CEEB] text-white"
        >
          Run
        </button>
        <button 
          onClick={() => {
            setPipelineState('success');
            setMetrics(m => ({ ...m, failureCount: 0, lastFaultLog: null }));
          }}
          className="px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50"
        >
          Success
        </button>
        <button 
          onClick={() => {
            setPipelineState('throttled');
            setMetrics(m => ({ ...m, bucketTokens: 0 }));
          }}
          className="px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50"
        >
          Throttle
        </button>
        <button 
          onClick={() => {
            setPipelineState('circuit_tripped');
            setMetrics(m => ({ 
              ...m, 
              failureCount: 5, 
              lastFaultLog: "SyntaxError: local variable 'compiled_struct' referenced before assignment in saphira_sandbox.py:line 42" 
            }));
          }}
          className="px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all bg-[#FF007F]/5 text-[#FF007F] hover:bg-[#FF007F]/10 border border-[#FF007F]/20"
        >
          Trip Loop
        </button>
      </footer>

    </div>
  );
};
