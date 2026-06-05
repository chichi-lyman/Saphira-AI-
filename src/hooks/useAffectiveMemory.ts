import { useState, useCallback } from 'react';

export interface AffectiveMemoryEntry {
  id: string;
  topic: string;
  valence: 'positive' | 'negative' | 'neutral';
  friction: number; // 0-1.0
  timestamp: number;
}

export function useAffectiveMemory() {
  const [memories, setMemories] = useState<AffectiveMemoryEntry[]>([
    {
      id: '1',
      topic: 'Python Optimization',
      valence: 'negative',
      friction: 0.8,
      timestamp: Date.now() - 86400000
    },
    {
      id: '2',
      topic: 'API Integration',
      valence: 'negative',
      friction: 0.9,
      timestamp: Date.now() - 172800000
    }
  ]);

  const addMemory = useCallback((topic: string, valence: 'positive' | 'negative' | 'neutral', friction: number) => {
    setMemories(prev => [
      {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        valence,
        friction,
        timestamp: Date.now()
      },
      ...prev
    ]);
  }, []);

  const checkTopic = useCallback((input: string) => {
    const lowercaseInput = input.toLowerCase();
    return memories.find(m => 
      lowercaseInput.includes(m.topic.toLowerCase()) && m.valence === 'negative'
    );
  }, [memories]);

  return { memories, addMemory, checkTopic };
}
