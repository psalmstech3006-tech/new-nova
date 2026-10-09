import React, { useState, useEffect } from 'react';
import { useNova } from '../context/NovaStateContext';
import { useNovaAuth } from '../context/NovaAuthContext';

export const TopHud: React.FC = () => {
  const { currentScreen, isListening, theme, setThemeModalOpen, telemetry } = useNova();
  const { currentUser, lockSession, relaunchOnboarding, signOut } = useNovaAuth();
  const [timeString, setTimeString] = useState<string>('');
  const [showStatusPopover, setShowStatusPopover] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

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

        {/* User Profile Pill & Dropdown */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 py-0.5 rounded-xl border text-[11px] transition-all hover:opacity-100 cursor-pointer"
              style={{
                backgroundColor: theme.palette.glassSurface,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textPrimary,
              }}
              title="User Account & Session"
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-900"
                style={{ backgroundColor: currentUser.avatarColor || theme.palette.accent }}
              >
                {currentUser.avatarInitials}
              </span>
              <span className="font-medium hidden sm:inline">{currentUser.callingName || currentUser.name}</span>
              <i className="fa-solid fa-chevron-down text-[8px] opacity-40 ml-0.5" />
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 top-9 w-64 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-3xl z-50 text-xs space-y-3"
                style={{
                  backgroundColor: theme.palette.bgElevated,
                  borderColor: theme.palette.glassBorder,
                  boxShadow: `0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
                }}
              >
                <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-900"
                    style={{ backgroundColor: currentUser.avatarColor || theme.palette.accent }}
                  >
                    {currentUser.avatarInitials}
                  </span>
                  <div className="overflow-hidden">
                    <div className="font-semibold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Role</span>
                    <span className="text-white truncate max-w-[140px]">{currentUser.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tone</span>
                    <span className="text-sky-300 capitalize">{currentUser.tone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      lockSession();
                    }}
                    className="w-full h-8 px-2.5 rounded-lg border text-left text-[11px] flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    style={{
                      borderColor: theme.palette.glassBorder,
                      color: theme.palette.textSecondary,
                    }}
                  >
                    <span>Lock Session (Test Returning Flow)</span>
                    <i className="fa-solid fa-lock text-[10px] opacity-60" />
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      relaunchOnboarding();
                    }}
                    className="w-full h-8 px-2.5 rounded-lg border text-left text-[11px] flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    style={{
                      borderColor: theme.palette.glassBorder,
                      color: theme.palette.textSecondary,
                    }}
                  >
                    <span>Relaunch Onboarding Setup</span>
                    <i className="fa-solid fa-rotate-left text-[10px] opacity-60" />
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="w-full h-8 px-2.5 rounded-lg text-left text-[11px] flex items-center justify-between text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <span>Sign Out</span>
                    <i className="fa-solid fa-arrow-right-from-bracket text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="h-3 w-px bg-white/10" />

        <span className="font-mono text-[11px] tabular-nums min-w-[75px] text-right" style={{ color: theme.palette.textSecondary }}>
          {timeString || '2:24:48 PM'}
        </span>
      </div>
    </header>
  );
};
