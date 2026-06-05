import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Mic, Activity } from 'lucide-react';

interface SaphiraVoiceOverlayProps {
  active: boolean;
  transcript: string;
  isListening: boolean;
  isSpeaking: boolean;
  spokenText: string;
}

export function SaphiraVoiceOverlay({ active, transcript, isListening, isSpeaking, spokenText }: SaphiraVoiceOverlayProps) {
  // Smoothly accumulate text like an architect typing
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (active && (spokenText || transcript)) {
      setDisplayedText(spokenText || (isListening ? transcript : ""));
    } else {
      setDisplayedText("");
    }
  }, [active, spokenText, transcript, isListening]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(25px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-6 bg-black/40 overflow-hidden"
        >
          {/* Saphira "S" Sphere Concept */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-12">
            <motion.div 
               initial={{ scale: 0.5, y: 50, opacity: 0 }}
               animate={{ scale: 1, y: 0, opacity: 1 }}
               transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
               className="relative z-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center"
            >
              {/* Glassmorphic Shell */}
              <div className="absolute inset-0 rounded-full bg-white/5 border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FF007F]/20 to-transparent" />
                
                {/* Glowing Core (The Neon Pink Center) */}
                <motion.div 
                  animate={{ 
                    scale: (isSpeaking || isListening) ? [1, 1.2, 1] : 1,
                    opacity: (isSpeaking || isListening) ? [0.6, 1, 0.6] : 0.4
                  }}
                  transition={{ 
                    duration: isSpeaking ? 1.5 : (isListening ? 0.8 : 3), 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#FF007F] shadow-[0_0_40px_10px_rgba(255,0,127,0.6)] flex items-center justify-center relative z-10"
                >
                   <span className="text-white font-serif italic text-2xl md:text-3xl pr-1 font-bold tracking-tighter">S</span>
                </motion.div>
                
                {/* Visual Breath Rings */}
                {(isSpeaking || isListening) && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border border-[#FF007F]/50"
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Liquid Glass Text Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl relative"
          >
             <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-[#FF007F]/20 to-transparent rounded-2xl opacity-60 blur-lg" />
             <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl min-h-[120px] flex flex-col items-center justify-center">
                
                <div className="absolute top-4 left-6 flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF007F] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF007F]"></span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/50 font-mono">
                    {isSpeaking ? "Saphira Transmitting" : (isListening ? "Listening..." : "Standing By")}
                  </span>
                </div>

                <motion.p 
                  key={displayedText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg md:text-2xl lg:text-3xl text-white/90 font-medium text-center leading-relaxed tracking-tight"
                >
                  {displayedText || (isListening ? <span className="text-white/30 italic">listening...</span> : <span className="text-white/30 italic">I'm here. What's the objective?</span>)}
                </motion.p>
             </div>
          </motion.div>
          
          <div className="fixed bottom-8 flex gap-4">
             {isListening && (
               <div className="px-4 py-2 bg-[#FF007F]/10 border border-[#FF007F]/30 rounded-full text-[#FF007F] text-xs font-bold uppercase tracking-widest flex items-center gap-2 animate-pulse">
                 <Mic size={14} /> Active Mic
               </div>
             )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
