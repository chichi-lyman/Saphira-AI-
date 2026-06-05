import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronRight, Check } from 'lucide-react';

export const OnboardingTutorial = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Saphira",
      description: "Your advanced cognitive architecture is online. Let's walk through the core features of your new operating ecosystem."
    },
    {
      title: "The Main Intelligence Stream",
      description: "Center stage. This is where you converse with Saphira, execute commands, and orchestrate projects. It supports text, voice, and contextual reasoning."
    },
    {
      title: "Command Nodes & Telemetry",
      description: "On the left side, you'll find the Control Panel—access agents, settings, tools, and the master system blueprints here."
    },
    {
      title: "Identity & Personalization",
      description: "Customize your environment. Click your profile icon at the top right to change your background, avatar, and system parameters."
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-pink-500/30 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center mb-6 shadow-xl shadow-pink-500/20">
          <Sparkles className="w-8 h-8 text-pink-500" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracker-tight">{steps[step].title}</h2>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {steps[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-pink-500 w-6' : 'bg-slate-300 dark:bg-slate-700'}`} 
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20"
          >
            {step === steps.length - 1 ? (
              <>Initiate Sequence <Check size={14} /></>
            ) : (
              <>Continue <ChevronRight size={14} /></>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
