import { useEffect, useState, useRef } from 'react';

export const useWakeWord = (onWake: () => void) => {
  const [isListening, setIsListening] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase();
      
      const hasOkaySaphira = transcript.includes('okay saphira') || transcript.includes('ok saphira') || transcript.includes('okay, saphira');
      const hasHeySaphira = transcript.includes('hey saphira') || transcript.includes('hey, saphira') || transcript.includes('hay saphira') || transcript.includes('hi saphira');
      
      if (hasOkaySaphira || hasHeySaphira) {
        console.log('Wake word detected in hook:', transcript);
        onWake();
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setHasPermission(false);
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart to continuously listen if we still want it to listen for the wake word
      if (isListening && hasPermission !== false) {
        try {
          recognition.start();
        } catch (e) {
          console.error("Failed to restart recognition", e);
        }
      }
    };

    recognitionRef.current = recognition;

  }, [onWake, isListening, hasPermission]);

  const startListening = () => {
    if (recognitionRef.current && hasPermission !== false) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setHasPermission(true);
      } catch (e) {
        console.error("Speech recognition is already started or failed to start", e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening, hasPermission };
};
