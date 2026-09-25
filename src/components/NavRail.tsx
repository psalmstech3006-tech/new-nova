import React from 'react';
import { useNova } from '../context/NovaStateContext';

export const NavRail: React.FC = () => {
  const { currentScreen, setCurrentScreen, theme, setThemeModalOpen, telemetry } = useNova();

  return (
    <div
      className="w-10 h-fit py-3 px-1 rounded-2xl border flex flex-col items-center space-y-3 shadow-xl shrink-0 z-20 transition-all duration-300 backdrop-blur-2xl"
      style={{
        backgroundColor: theme.palette.glassSurface,
        borderColor: theme.palette.glassBorder,
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
      }}
    >
      {/* Top Badge: Active capabilities / cognitive threads */}
      <button
        onClick={() => setCurrentScreen(currentScreen === 'substrate' ? 'runtime' : 'substrate')}
        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-transform hover:scale-105 cursor-pointer border"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
          color: theme.palette.accent,
        }}
        title="Active Cognitive Threads (Click to Toggle)"
      >
        {currentScreen === 'substrate' ? 42 : telemetry.mcpConnectedPipes}
      </button>

      {/* 1. Presence Arena / Skill Substrate */}
      <button
        onClick={() => setCurrentScreen('substrate')}
        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
          currentScreen === 'substrate' ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
        }`}
        style={{
          backgroundColor: currentScreen === 'substrate' ? theme.palette.bgElevated : 'transparent',
          color: currentScreen === 'substrate' ? theme.palette.textPrimary : theme.palette.textSecondary,
        }}
        title="Skill Substrate & Presence Arena (Key: 1)"
      >
        <i className="fa-solid fa-shapes text-xs" />
        {currentScreen === 'substrate' && (
          <span
            className="absolute -right-0.5 top-1 w-1 h-1 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
        )}
      </button>

      {/* 2. Synaptic Mind Map & Memory Vault */}
      <button
        onClick={() => setCurrentScreen('synaptic')}
        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
          currentScreen === 'synaptic' ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
        }`}
        style={{
          backgroundColor: currentScreen === 'synaptic' ? theme.palette.bgElevated : 'transparent',
          color: currentScreen === 'synaptic' ? theme.palette.textPrimary : theme.palette.textSecondary,
        }}
        title="Synaptic Mind Map & Memory Vault (Key: 2)"
      >
        <i className="fa-solid fa-diagram-project text-xs" />
        {currentScreen === 'synaptic' && (
          <span
            className="absolute -right-0.5 top-1 w-1 h-1 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
        )}
      </button>

      {/* 3. System Architecture & Settings */}
      <button
        onClick={() => setCurrentScreen('runtime')}
        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
          currentScreen === 'runtime' ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
        }`}
        style={{
          backgroundColor: currentScreen === 'runtime' ? theme.palette.bgElevated : 'transparent',
          color: currentScreen === 'runtime' ? theme.palette.textPrimary : theme.palette.textSecondary,
        }}
        title="Settings & Control Center (Key: 3 or ⌘,)"
      >
        <i className="fa-solid fa-gear text-xs" />
        {currentScreen === 'runtime' && (
          <span
            className="absolute -right-0.5 top-1 w-1 h-1 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
        )}
      </button>

      <div className="w-4 h-px opacity-20" style={{ backgroundColor: theme.palette.textMuted }} />

      {/* Theme Architecture Modal Trigger */}
      <button
        onClick={() => setThemeModalOpen(true)}
        className="w-7 h-7 rounded-xl flex items-center justify-center transition-all opacity-60 hover:opacity-100 cursor-pointer"
        style={{ color: theme.palette.textSecondary }}
        title="Select Environmental Theme"
      >
        <i className="fa-solid fa-palette text-xs" />
      </button>
    </div>
  );
};
