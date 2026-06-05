import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

type PipelineState = 'idle' | 'executing' | 'success' | 'throttled' | 'circuit_tripped' | 'disconnected';

interface SystemTelemetry {
  memorySpend: number;
  bucketTokens: number;
  failureCount: number;
  lastFaultLog: string | null;
  grossRevenue: number;
}

interface SaphiraSocketContextType {
  systemState: PipelineState;
  telemetry: SystemTelemetry;
  dispatchTask: (intent: string, code: string) => void;
}

const SaphiraSocketContext = createContext<SaphiraSocketContextType | undefined>(undefined);

export const SaphiraSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemState, setSystemState] = useState<PipelineState>('disconnected');
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    memorySpend: 0,
    bucketTokens: 100,
    failureCount: 0,
    lastFaultLog: null,
    grossRevenue: 0.0
  });

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectDelay = 30000; // Cap backoff at 30 seconds
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    const wsUrl = 'wss://://novaumbrella.com/saphira/telemetry';
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('Saphira Core Web Channel Online.');
      setSystemState('idle');
      reconnectAttempts.current = 0; // Clear exponential rate limits

      // Instantiate local telemetry ping engine to hold firewall channels open
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ action: 'HEARTBEAT_PING' }));
        }
      }, 45000); // 45-second ping frequency
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'PIPELINE_MUTATION') {
          setSystemState(data.state);
          setTelemetry(data.metrics);
        }
      } catch (err) {
        console.error('Failed to parse telemetry event transmission payload:', err);
      }
    };

    ws.onclose = (event) => {
      console.warn(`Saphira Network Link Terminated: Code ${event.code}. Initializing recovery.`);
      setSystemState('disconnected');
      
      // Clean up heartbeat interval
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // Execute exponential backoff reconnect sequencing
      const backoffDelay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), maxReconnectDelay);
      reconnectAttempts.current += 1;
      
      setTimeout(() => {
        console.log(`Reattempting connection... (Attempt ${reconnectAttempts.current})`);
        connectWebSocket();
      }, backoffDelay);
    };

    ws.onerror = (error) => {
      console.error('Saphira Transport Pipeline Anomalous Error Event:', error);
      ws.close(); // Force clean trigger of the onclose recovery logic loop
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  const dispatchTask = useCallback((intent: string, code: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'EXECUTE_AGENT_TASK',
        payload: { intent, initial_code: code }
      }));
    } else {
      console.error('Cannot dispatch transaction task pipeline: Web Channel status Offline.');
    }
  }, []);

  return (
    <SaphiraSocketContext.Provider value={{ systemState, telemetry, dispatchTask }}>
      {children}
    </SaphiraSocketContext.Provider>
  );
};

export const useSaphiraSocket = () => {
  const context = useContext(SaphiraSocketContext);
  if (!context) throw new Error('useSaphiraSocket must be wrapped within a SaphiraSocketProvider');
  return context;
};
