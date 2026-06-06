import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Radio } from 'lucide-react';
import { haptic } from '../services/haptics';

interface SaphiraVoiceHapticEffectProps {
  triggerKey: number; // Increment this to trigger the haptic feedback effect
  commandText?: string;
}

export const SaphiraVoiceHapticEffect: React.FC<SaphiraVoiceHapticEffectProps> = ({ triggerKey, commandText }) => {
  const [active, setActive] = React.useState(false);

  useEffect(() => {
    if (triggerKey > 0) {
      setActive(true);

      // Trigger the specialized physical + sound haptic sequence using Saphira's engine
      try {
        haptic.success();
      } catch (e) {
        console.warn('Physical/audio engine haptic sequence execution failed:', e);
      }

      const timer = setTimeout(() => {
        setActive(false);
      }, 1500); // Effect duration

      return () => clearTimeout(timer);
    }
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center overflow-hidden">
          {/* Subtle camera/viewport shake container */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{
              x: [0, -4, 4, -3, 3, -1, 1, 0],
              y: [0, 3, -3, 2, -2, 1, -1, 0],
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center p-4 bg-transparent"
          >
            {/* Visual shockwave / radiant expansion pulses */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full border-2 border-pink-500/60 shadow-[0_0_50px_20px_rgba(255,0,127,0.4)]"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 0.6 }}
              animate={{ scale: 3.2, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full border border-blue-400/40 shadow-[0_0_40px_15px_rgba(59,130,246,0.3)]"
            />
            <motion.div
              initial={{ scale: 0.1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full border border-purple-500/30"
            />

            {/* Glowing HUD Confirmation Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 180, damping: 15 }}
              className="relative p-0.5 rounded-2xl bg-gradient-to-r from-[#FF007F]/40 via-purple-500/40 to-blue-400/40 shadow-[0_0_25px_rgba(255,0,127,0.25)] backdrop-blur-2xl pointer-events-auto"
            >
              <div className="bg-[#0B0B0C]/90 px-6 py-4 rounded-2xl flex flex-col items-center gap-2 max-w-sm border border-white/5">
                {/* Tactile Transceiver Pulse Symbol */}
                <div className="relative flex items-center justify-center mb-1">
                  <div className="absolute inset-0 bg-[#FF007F]/20 rounded-full animate-ping bubble-fast" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF007F] to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,127,0.5)]">
                    <Radio className="text-white w-5 h-5 animate-pulse" />
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="text-xs font-black uppercase tracking-[0.25em] bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent font-sans">
                    Command Synchronized
                  </h4>
                  {commandText && (
                    <p className="text-[11px] text-white/75 mt-1 font-mono italic max-w-[240px] truncate">
                      "{commandText}"
                    </p>
                  )}
                  <p className="text-[8px] text-white/30 uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1">
                    <Sparkles size={8} className="text-pink-400 animate-spin" /> Tactile Response Complete
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
