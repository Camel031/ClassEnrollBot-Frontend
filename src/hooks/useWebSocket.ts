import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../components/Toast';

export interface OperationLog {
  timestamp: string;
  task: string;
  account_id: string | null;
  operation_type: 'login' | 'captcha' | 'search' | 'enroll' | 'drop' | 'session' | 'browser' | 'http';
  status: 'started' | 'in_progress' | 'success' | 'failed' | 'retry';
  message: string;
  details: Record<string, unknown>;
  sequence: number;
}

export interface WebSocketMessage {
  type: 'operation_log' | 'notification' | 'pong';
  data?: OperationLog | Record<string, unknown>;
}

interface UseWebSocketOptions {
  maxLogs?: number;
  autoConnect?: boolean;
  devMode?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { maxLogs = 100, autoConnect = true, devMode = false } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<OperationLog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);

  const { token } = useAuthStore();

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_API_URL?.replace(/^https?:\/\//, '') || 'localhost:8000';

    if (devMode) {
      return `${protocol}//${host}/api/v1/ws/dev`;
    }

    if (!token) {
      return null;
    }

    return `${protocol}//${host}/api/v1/ws?token=${token}`;
  }, [token, devMode]);

  const connect = useCallback(() => {
    const url = getWebSocketUrl();

    if (!url) {
      setError('No authentication token available');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Start ping interval for keepalive
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'operation_log' && message.data) {
            const log = message.data as OperationLog;

            setLogs((prev) => {
              const newLogs = [...prev, log];
              // Keep only the last maxLogs entries
              return newLogs.slice(-maxLogs);
            });

            // Show toast notifications for important events
            if (log.operation_type === 'enroll') {
              if (log.status === 'success') {
                toast.success('Enrollment Success!', log.message);
              } else if (log.status === 'failed') {
                toast.error('Enrollment Failed', log.message);
              }
            } else if (log.operation_type === 'login') {
              if (log.status === 'success') {
                toast.success('Login Successful', log.message);
              } else if (log.status === 'failed') {
                toast.error('Login Failed', log.message);
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      ws.onerror = () => {
        setError('WebSocket connection error');
      };

      ws.onclose = (event) => {
        setIsConnected(false);

        // Clear ping interval
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }

        // Attempt reconnection with exponential backoff
        if (event.code !== 1000 && reconnectAttempts.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (e) {
      setError(`Failed to connect: ${e}`);
    }
  }, [getWebSocketUrl, maxLogs]);

  const disconnect = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect && (devMode || token)) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, devMode, token, connect, disconnect]);

  return {
    isConnected,
    logs,
    error,
    connect,
    disconnect,
    clearLogs,
  };
}
