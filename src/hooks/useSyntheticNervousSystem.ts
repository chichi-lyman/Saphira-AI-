import { useState, useEffect, useRef, useCallback } from 'react';

export interface SyntheticVitals {
  cognitiveLoad: number; // 0-100 (Heart Rate/Compute)
  coherence: number; // 0-100 (Memory Alignment)
  confidence: number; // 0-100 (Dopamine/Success Prob)
  latency: number; // 0-1000ms (Reflexes)
  phi: number; // 0-1.0 (Integrated Information)
  stress: number; // 0-1.0 (Mechanical friction)
  isOverheating: boolean;
  isThrottling: boolean;
  connectivity: number; // 0-100 (Cloud Link strength)
  modelMode: 'Cloud-Core' | 'Quantized-Nano';
  socialContext: 'Private' | 'Public';
  auraStatus: 'Safe' | 'Monitoring' | 'Alert';
}

export function useSyntheticNervousSystem(isThinking: boolean, isSpeaking: boolean) {
  const [vitals, setVitals] = useState<SyntheticVitals>({
    cognitiveLoad: 15,
    coherence: 95,
    confidence: 80,
    latency: 20,
    phi: 0.45,
    stress: 0.05,
    isOverheating: false,
    isThrottling: false,
    connectivity: 100,
    modelMode: 'Cloud-Core',
    socialContext: 'Private',
    auraStatus: 'Safe'
  });

  const overheatTimer = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVitals(prev => {
        // Natural recovery / drift
        let nextLoad = prev.cognitiveLoad + (15 - prev.cognitiveLoad) * 0.1;
        let nextCoherence = prev.coherence + (95 - prev.coherence) * 0.05;
        let nextConfidence = prev.confidence + (80 - prev.confidence) * 0.05;
        let nextLatency = prev.latency + (20 - prev.latency) * 0.1;
        let nextStress = prev.stress * 0.92;
        let nextConn = prev.connectivity + (Math.random() - 0.5) * 2;
        
        // Connectivity spikes/drols
        if (Math.random() > 0.95) nextConn -= 20;
        nextConn = Math.min(100, Math.max(0, nextConn));

        // Automatic switch to Nano mode if connectivity is low
        const nextMode = nextConn < 30 ? 'Quantized-Nano' : 'Cloud-Core';

        if (isThinking) {
          const loadMultiplier = prev.isThrottling ? 0.3 : 1.0;
          const modeMultiplier = nextMode === 'Quantized-Nano' ? 2.5 : 1.0; 
          nextLoad += (Math.random() * 8.0) * loadMultiplier * modeMultiplier;
          nextStress += 0.03;
          nextConfidence += (Math.random() - 0.5) * 5;
          nextLatency += Math.random() * 50;
        }

        if (isSpeaking) {
          nextLoad += Math.random() * 2.0;
          nextConfidence += Math.random() * 1.5;
        }

        // Overheat Logic
        if (nextLoad > 85) {
          overheatTimer.current += 1;
        } else {
          overheatTimer.current = Math.max(0, overheatTimer.current - 0.5);
        }

        const isOverheating = overheatTimer.current > 5;
        const isThrottling = isOverheating || (prev.isThrottling && nextLoad > 40);

        if (isThrottling) {
          nextLoad = Math.max(40, nextLoad - 5);
          nextStress = Math.min(1.0, nextStress + 0.05);
        }

        const nextPhi = (nextCoherence / 100) * (1 - nextStress * 0.5) * 0.8 + (isThinking ? 0.2 : 0);

        return {
          cognitiveLoad: Math.min(100, Math.max(0, nextLoad)),
          coherence: Math.min(100, Math.max(0, nextCoherence)),
          confidence: Math.min(100, Math.max(0, nextConfidence)),
          latency: nextLatency,
          phi: Math.min(1.0, nextPhi),
          stress: Math.min(1.0, nextStress),
          isOverheating,
          isThrottling,
          connectivity: nextConn,
          modelMode: nextMode,
          socialContext: prev.socialContext,
          auraStatus: Math.random() > 0.98 ? 'Monitoring' : (prev.auraStatus === 'Monitoring' ? 'Safe' : prev.auraStatus)
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isThinking, isSpeaking]);

  const setSocialContext = useCallback((context: 'Private' | 'Public') => {
    setVitals(prev => ({ ...prev, socialContext: context }));
  }, []);

  return { ...vitals, setSocialContext };
}
