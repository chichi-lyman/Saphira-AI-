import React, { useEffect, useState, useRef } from 'react';
import { Task } from '../App';
import { motion } from 'motion/react';
import { Network, X, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { cn } from '../lib/utils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export function TaskDependencyVisualizer({ tasks, onClose }: { tasks: Task[], onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: 600 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        w: containerRef.current.clientWidth,
        h: containerRef.current.clientHeight
      });
    }
  }, []);

  const nodes = tasks.map((task, idx) => {
    // Determine depth based on dependencies
    let depth = 0;
    
    const calculateDepth = (taskId: string, currentDepth: number, visited: Set<string>): number => {
      if (visited.has(taskId)) return currentDepth; // Prevent infinite loops
      visited.add(taskId);
      
      const t = tasks.find(t => t.id === taskId);
      if (!t) return currentDepth;
      
      const deps = [...(t.dependentOnTaskIds || [])];
      if (t.dependentOnTaskId && !deps.includes(t.dependentOnTaskId)) {
        deps.push(t.dependentOnTaskId);
      }
      
      if (deps.length === 0) return currentDepth;
      
      return Math.max(...deps.map(d => calculateDepth(d, currentDepth + 1, new Set(visited))));
    };

    depth = calculateDepth(task.id, 0, new Set());
    return { ...task, depth };
  });

  // Group by depth
  const depthGroups: Record<number, typeof nodes> = {};
  nodes.forEach(n => {
    if (!depthGroups[n.depth]) depthGroups[n.depth] = [];
    depthGroups[n.depth].push(n);
  });

  const maxDepth = Math.max(0, ...Object.keys(depthGroups).map(Number));

  // Assign coordinates based on a fixed large canvas size
  const CANVAS_WIDTH = Math.max(1600, dimensions.w);
  const CANVAS_HEIGHT = Math.max(1200, dimensions.h);

  const positionedNodes = nodes.map(n => {
    const group = depthGroups[n.depth];
    const groupIdx = group.findIndex(g => g.id === n.id);
    const totalInGroup = group.length;
    
    // Y is based on depth
    const y = maxDepth === 0 ? CANVAS_HEIGHT / 2 : CANVAS_HEIGHT * 0.15 + (n.depth / maxDepth) * (CANVAS_HEIGHT * 0.7);
    
    // X is spaced out across width
    const x = CANVAS_WIDTH * 0.2 + ((groupIdx + 1) / (totalInGroup + 1)) * (CANVAS_WIDTH * 0.6);
    
    return { ...n, x, y };
  });

  const lines: { x1: number; y1: number; x2: number; y2: number; active: boolean }[] = [];
  
  positionedNodes.forEach(node => {
    const deps = [...(node.dependentOnTaskIds || [])];
    if (node.dependentOnTaskId && !deps.includes(node.dependentOnTaskId)) deps.push(node.dependentOnTaskId);
    
    deps.forEach(depId => {
      const parent = positionedNodes.find(p => p.id === depId);
      if (parent) {
        lines.push({
          x1: parent.x,
          y1: parent.y,
          x2: node.x,
          y2: node.y,
          active: parent.status === 'completed'
        });
      }
    });
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl">
      <div className="w-full h-full max-w-[95vw] max-h-[90vh] relative bg-[#0A0F1E]/80 border border-indigo-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.2)] flex flex-col">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-10">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
               <Network className="text-indigo-400" size={24} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest font-display">Causal Topology</h2>
               <p className="text-[10px] text-indigo-400 font-mono tracking-[0.2em] uppercase mt-1">Multi-step execution graph</p>
             </div>
           </div>
           <button onClick={onClose} className="px-6 py-3 border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-xl text-xs uppercase font-bold tracking-widest hidden md:block">
             Close Topology
           </button>
           <button onClick={onClose} className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full md:hidden">
             <X size={20} />
           </button>
        </div>
        
        <div className="flex-1 relative overflow-hidden bg-[#050811]" ref={containerRef}>
          <TransformWrapper
            initialScale={1}
            initialPositionX={0}
            initialPositionY={0}
            minScale={0.1}
            maxScale={4}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, centerView }) => (
              <>
                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                  <button onClick={() => zoomIn()} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white shadow-lg backdrop-blur-md">
                    <ZoomIn size={18} />
                  </button>
                  <button onClick={() => zoomOut()} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white shadow-lg backdrop-blur-md">
                    <ZoomOut size={18} />
                  </button>
                  <button onClick={() => centerView()} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white shadow-lg backdrop-blur-md">
                    <Maximize size={18} />
                  </button>
                </div>

                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full border-0">
                  <div style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} className="relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <defs>
                        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      {lines.map((line, i) => (
                        <line 
                          key={i} 
                          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
                          stroke={line.active ? "url(#activeGradient)" : "rgba(255, 255, 255, 0.05)"} 
                          strokeWidth={line.active ? 4 : 2}
                          strokeDasharray={line.active ? "none" : "8,8"}
                        />
                      ))}
                    </svg>
                    
                    {positionedNodes.map(node => (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: node.depth * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                        className={cn(
                          "absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl p-4 border cursor-pointer w-48 sm:w-56 transition-all z-10",
                          node.status === 'completed' ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]" : "bg-[#131A2A]/90 border-white/10 shadow-xl backdrop-blur-xl",
                          selectedNode === node.id && "ring-2 ring-pink-500 ring-offset-2 ring-offset-[#050811] scale-110 shadow-[0_0_40px_rgba(236,72,153,0.3)] z-50",
                          selectedNode !== null && selectedNode !== node.id && "opacity-40"
                        )}
                        style={{ left: node.x, top: node.y }}
                        onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                      >
                        <div className={cn("text-[9px] uppercase tracking-[0.2em] font-black opacity-60 mb-2 truncate block", node.status === 'completed' ? "text-emerald-400" : "text-indigo-400")}>
                          {node.status}
                        </div>
                        <div className="text-sm font-bold text-white truncate leading-snug">
                          {node.title}
                        </div>
                        {node.priority === 'critical' && <div className="mt-3 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>}
                        {node.priority === 'high' && <div className="mt-3 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>}
                        {node.priority === 'medium' && <div className="mt-3 w-full h-1 bg-indigo-500/50 rounded-full"></div>}
                      </motion.div>
                    ))}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}

