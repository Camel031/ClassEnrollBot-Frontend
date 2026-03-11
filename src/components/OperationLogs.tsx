import { useEffect, useRef, useState } from 'react';
import { useWebSocket, OperationLog } from '../hooks/useWebSocket';

/**
 * Operation Logs Component
 *
 * Aesthetic Direction: Terminal/Cyberpunk Monitoring Console
 * - Deep dark theme with scanline effects
 * - Neon accent colors for status indicators
 * - Monospace typography (JetBrains Mono)
 * - Smooth auto-scroll with fade gradient
 * - Glowing status indicators
 */

const STATUS_CONFIG: Record<string, { color: string; glow: string; label: string }> = {
  started: {
    color: 'text-cyan-400',
    glow: 'shadow-cyan-400/50',
    label: 'INIT',
  },
  in_progress: {
    color: 'text-amber-400',
    glow: 'shadow-amber-400/50',
    label: 'EXEC',
  },
  success: {
    color: 'text-emerald-400',
    glow: 'shadow-emerald-400/50',
    label: 'DONE',
  },
  failed: {
    color: 'text-rose-400',
    glow: 'shadow-rose-400/50',
    label: 'FAIL',
  },
  retry: {
    color: 'text-violet-400',
    glow: 'shadow-violet-400/50',
    label: 'RETRY',
  },
};

const OPERATION_ICONS: Record<string, { icon: string; color: string }> = {
  login: { icon: '\u{1F511}', color: 'text-cyan-300' },      // 🔑
  captcha: { icon: '\u{1F9E9}', color: 'text-purple-300' },  // 🧩
  search: { icon: '\u{1F50D}', color: 'text-blue-300' },     // 🔍
  enroll: { icon: '\u{1F4DD}', color: 'text-emerald-300' },  // 📝
  drop: { icon: '\u{1F5D1}', color: 'text-rose-300' },       // 🗑
  session: { icon: '\u{1F504}', color: 'text-amber-300' },   // 🔄
  browser: { icon: '\u{1F310}', color: 'text-teal-300' },    // 🌐
  http: { icon: '\u{26A1}', color: 'text-yellow-300' },      // ⚡
};

interface OperationLogsProps {
  maxHeight?: string;
  showHeader?: boolean;
  devMode?: boolean;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatMillis(timestamp: string): string {
  const date = new Date(timestamp);
  return String(date.getMilliseconds()).padStart(3, '0');
}

function LogEntry({ log, index }: { log: OperationLog; index: number }) {
  const opConfig = OPERATION_ICONS[log.operation_type] || {
    icon: '\u{1F4CB}',
    color: 'text-gray-400',
  };
  const statusConfig = STATUS_CONFIG[log.status] || {
    color: 'text-gray-400',
    glow: '',
    label: 'UNKN',
  };

  return (
    <div
      className="group flex items-start gap-3 py-2 px-4 hover:bg-white/[0.02] transition-all duration-200 border-l-2 border-transparent hover:border-cyan-500/50"
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Sequence Number */}
      <span className="text-[10px] text-gray-600 font-mono w-6 text-right tabular-nums">
        {String(log.sequence).padStart(3, '0')}
      </span>

      {/* Timestamp */}
      <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
        <span className="text-gray-400">{formatTime(log.timestamp)}</span>
        <span className="text-gray-600">.{formatMillis(log.timestamp)}</span>
      </span>

      {/* Operation Icon */}
      <span className={`text-sm ${opConfig.color}`} role="img" aria-label={log.operation_type}>
        {opConfig.icon}
      </span>

      {/* Operation Type Tag */}
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-14 font-mono">
        [{log.operation_type.slice(0, 6)}]
      </span>

      {/* Status Badge */}
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono tracking-wider ${statusConfig.color} bg-current/10 shadow-sm ${statusConfig.glow}`}
      >
        {statusConfig.label}
      </span>

      {/* Message */}
      <span className="text-sm text-gray-300 flex-1 truncate group-hover:text-gray-100 transition-colors font-mono">
        {log.message}
      </span>

      {/* Ping indicator for recent entries */}
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-ping opacity-0 group-hover:opacity-100" />
    </div>
  );
}

function ScanlineOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.03) 2px,
          rgba(0, 0, 0, 0.03) 4px
        )`,
      }}
    />
  );
}

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span
          className={`block w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-400' : 'bg-rose-500'
          }`}
        />
        {isConnected && (
          <span className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        )}
      </div>
      <span
        className={`text-[10px] font-mono font-bold tracking-widest ${
          isConnected ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {isConnected ? 'CONNECTED' : 'OFFLINE'}
      </span>
    </div>
  );
}

export function OperationLogs({
  maxHeight = '400px',
  showHeader = true,
  devMode = true,
}: OperationLogsProps) {
  const { isConnected, logs, error, clearLogs } = useWebSocket({ devMode });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Detect manual scroll to disable auto-scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="relative bg-[#0a0a0f] rounded-xl border border-gray-800/50 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Ambient glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <ScanlineOverlay />

      {showHeader && (
        <div className="relative z-20 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900/80 to-gray-900/60 border-b border-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Terminal icon */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 tracking-wider">
                NTNU://OPERATION_MONITOR
              </span>
              <span className="text-[10px] text-gray-600 font-mono">v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ConnectionStatus isConnected={isConnected} />

            <div className="h-4 w-px bg-gray-700" />

            <span className="text-[10px] text-gray-500 font-mono tabular-nums">
              {logs.length} ENTRIES
            </span>

            <button
              onClick={clearLogs}
              className="text-[10px] font-mono font-bold text-gray-500 hover:text-cyan-400 px-2 py-1 rounded border border-gray-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-200 tracking-wider"
            >
              CLEAR
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="relative z-20 px-4 py-2 bg-rose-500/10 border-b border-rose-500/20">
          <p className="text-xs text-rose-400 font-mono">
            <span className="font-bold">[ERROR]</span> {error}
          </p>
        </div>
      )}

      {/* Logs container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-20 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 hover:scrollbar-thumb-gray-600"
        style={{ maxHeight }}
      >
        {/* Top fade gradient */}
        <div className="sticky top-0 h-4 bg-gradient-to-b from-[#0a0a0f] to-transparent pointer-events-none z-10" />

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-gray-700 border-t-cyan-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">📡</span>
              </div>
            </div>
            <p className="mt-4 text-sm font-mono">
              {isConnected ? 'AWAITING OPERATIONS...' : 'ESTABLISHING CONNECTION...'}
            </p>
            <p className="mt-1 text-[10px] text-gray-600 font-mono">
              {isConnected ? 'System ready for monitoring' : 'Please wait'}
            </p>
          </div>
        ) : (
          <div className="py-2">
            {logs.map((log, index) => (
              <LogEntry key={`${log.timestamp}-${log.sequence}`} log={log} index={index} />
            ))}
          </div>
        )}

        {/* Bottom fade gradient */}
        <div className="sticky bottom-0 h-4 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />

        <div ref={logsEndRef} />
      </div>

      {/* Auto-scroll indicator */}
      {!autoScroll && logs.length > 0 && (
        <button
          onClick={() => {
            setAutoScroll(true);
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-mono font-bold transition-all duration-200 backdrop-blur-sm"
        >
          <span className="animate-bounce">↓</span>
          SCROLL TO BOTTOM
        </button>
      )}
    </div>
  );
}

// Compact widget version for sidebar
export function OperationLogsCompact({ devMode = true }: { devMode?: boolean }) {
  const { isConnected, logs } = useWebSocket({ devMode, maxLogs: 5 });
  const recentLogs = logs.slice(-5);

  return (
    <div className="bg-[#0a0a0f] rounded-lg border border-gray-800/50 p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-gray-500 tracking-wider">
          LIVE ACTIVITY
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className={`text-[9px] font-mono ${isConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isConnected ? 'LIVE' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Recent logs */}
      <div className="space-y-1">
        {recentLogs.length === 0 ? (
          <p className="text-[10px] text-gray-600 font-mono py-2 text-center">
            No recent activity
          </p>
        ) : (
          recentLogs.map((log, index) => {
            const opConfig = OPERATION_ICONS[log.operation_type] || { icon: '📋', color: 'text-gray-400' };
            const statusConfig = STATUS_CONFIG[log.status];

            return (
              <div
                key={`${log.timestamp}-${index}`}
                className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded font-mono ${
                  log.status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300'
                    : log.status === 'failed'
                    ? 'bg-rose-500/10 text-rose-300'
                    : 'bg-gray-800/50 text-gray-400'
                }`}
              >
                <span>{opConfig.icon}</span>
                <span className="truncate flex-1">{log.message}</span>
                <span className={`${statusConfig.color} font-bold`}>
                  {statusConfig.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
