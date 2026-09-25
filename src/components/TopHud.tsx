import React, { useState, useEffect } from 'react';
import { useNova } from '../context/NovaStateContext';

export const TopHud: React.FC = () => {
  const { currentScreen, isListening, theme, setThemeModalOpen, telemetry } = useNova();
  const [timeString, setTimeString] = useState<string>('');
  const [showStatusPopover, setShowStatusPopover] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="h-11 px-6 flex items-center justify-between z-30 shrink-0 font-sans text-xs border-b backdrop-blur-2xl transition-colors duration-300 relative select-none"
      style={{
        backgroundColor: theme.palette.glassSurface,
        borderColor: theme.palette.glassBorder,
        color: theme.palette.textPrimary,
      }}
    >
      {/* Left: Brand Identity & Kernel Link */}
      <div className="flex items-center space-x-3.5">
        <span className="font-semibold tracking-[0.18em] uppercase text-xs flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
          NOVA
        </span>

        <span className="text-slate-500/40 text-xs">/</span>

        {/* Clickable Substrate status */}
        <div className="relative">
          <button
            onClick={() => setShowStatusPopover(!showStatusPopover)}
            className="text-[11px] flex items-center gap-1.5 font-normal transition-colors hover:opacity-100 cursor-pointer"
            style={{ color: theme.palette.textSecondary }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span>Substrate Synced</span>
            <i className="fa-solid fa-chevron-down text-[8px] opacity-40 ml-0.5" />
          </button>

          {/* Quick status popover */}
          {showStatusPopover && (
            <div
              className="absolute left-0 top-8 w-60 p-3.5 rounded-2xl border shadow-xl backdrop-blur-2xl z-40 text-xs space-y-2 animate-fade-in"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
              }}
            >
              <div className="flex items-center justify-between font-mono text-[10px]" style={{ color: theme.palette.textMuted }}>
                <span>ENCLAVE RUNTIME</span>
                <span className="text-emerald-500 font-medium">CONNECTED</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between" style={{ color: theme.palette.textSecondary }}>
                  <span>Kernel Latency</span>
                  <span className="font-mono text-white font-medium">{telemetry.kernelLatencyMs}ms</span>
                </div>
                <div className="flex justify-between" style={{ color: theme.palette.textSecondary }}>
                  <span>Token Velocity</span>
                  <span className="font-mono text-white font-medium">{telemetry.tokenRate} t/s</span>
                </div>
                <div className="flex justify-between" style={{ color: theme.palette.textSecondary }}>
                  <span>Sandbox Isolation</span>
                  <span className="font-medium text-emerald-400">{telemetry.sandboxLevel}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <span className="hidden md:inline text-[11px] opacity-50" style={{ color: theme.palette.textMuted }}>
          {currentScreen === 'substrate' && 'Autonomous Workspace'}
          {currentScreen === 'runtime' && 'System Architecture & Telemetry'}
          {currentScreen === 'synaptic' && 'Memory & Knowledge Graph'}
        </span>
      </div>

      {/* Center: Acoustic Field Status (Quiet & Elegant) */}
      <div className="flex items-center space-x-2 text-[11px] font-sans">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all ${
            isListening ? 'animate-pulse' : 'opacity-60'
          }`}
          style={{ backgroundColor: isListening ? '#f59e0b' : theme.palette.accent }}
        />
        <span style={{ color: isListening ? theme.palette.textPrimary : theme.palette.textSecondary }}>
          {isListening ? 'Acoustic Field · Active Stream' : 'Acoustic Field · Passive Listening'}
        </span>
      </div>

      {/* Right: Theme Picker button & Clock */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Theme quick trigger button */}
        <button
          onClick={() => setThemeModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] transition-all hover:opacity-100 cursor-pointer"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textSecondary,
          }}
          title="Open Theme Architecture"
        >
          <span className="w-2 h-2 rounded-full border" style={{ backgroundColor: theme.palette.accent, borderColor: theme.palette.glassBorder }} />
          <span className="font-sans font-medium">{theme.name}</span>
          <i className="fa-solid fa-palette text-[9px] opacity-60 ml-0.5" />
        </button>

        <div className="h-3 w-px bg-white/10" />

        <span className="font-mono text-[11px] tabular-nums min-w-[75px] text-right" style={{ color: theme.palette.textSecondary }}>
          {timeString || '2:24:48 PM'}
        </span>
      </div>
    </header>
  );
};
