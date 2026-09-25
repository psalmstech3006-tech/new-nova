import React, { useState } from 'react';
import { useNova } from '../context/NovaStateContext';
import { NOVA_THEMES } from '../theme/themes';
import { ThemeId } from '../types/nova';

export const RuntimeSettingsScreen: React.FC = () => {
  const {
    presenceType,
    setPresenceType,
    theme,
    themeId,
    setThemeId,
    glassOpacity,
    setGlassOpacity,
    monospaceKern,
    setMonospaceKern,
    voiceThreshold,
    setVoiceThreshold,
    telemetry,
    addToast,
    dispatchTask,
  } = useNova();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSync = () => {
    setIsSyncing(true);
    addToast('Syncing Secure Vault', 'Reconciling 18,490 vectors with local enclave...', 'info');
    setTimeout(() => {
      setIsSyncing(false);
      addToast('Vault Synchronized', '18,490 vectors reconciled with hardware enclave.', 'success');
      dispatchTask('Vault Reconciliation: Vector ledger matched against local SHA-512 seal');
    }, 1100);
  };

  const handleExport = () => {
    const backupData = {
      product: 'NOVA OS 4.2',
      exportTimestamp: new Date().toISOString(),
      activeTheme: themeId,
      presenceManifestation: presenceType,
      telemetrySnapshot: telemetry,
      acrylicOpacity: glassOpacity,
      monospacedKerning: monospaceKern,
      voiceActivationDbfs: `-${voiceThreshold} dBFS`,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-system-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Profile Exported', 'Downloaded system architecture configuration.', 'success');
  };

  const themeList = Object.values(NOVA_THEMES);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 overflow-hidden select-none">
      {/* ================= LEFT FLOATING WIDGET: SYSTEM RUNTIME & TELEMETRY ================= */}
      <div className="absolute left-20 top-6 bottom-8 flex flex-col space-y-3 w-64 pointer-events-auto z-20">
        {/* Telemetry Card */}
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div>
            <div
              className="flex items-center justify-between text-xs pb-2 border-b mb-3"
              style={{ borderColor: theme.palette.glassBorder }}
            >
              <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: theme.palette.accent }}>
                System Runtime
              </span>
              <span className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textSecondary }}>
                SYS-PID 0x889F
              </span>
            </div>

            {/* Engine status */}
            <div className="space-y-2 text-xs font-sans">
              <div
                className="flex items-center justify-between p-2 rounded-xl border"
                style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span style={{ color: theme.palette.textSecondary }}>Local Engine</span>
                </div>
                <span className="font-medium font-mono text-[11px]" style={{ color: theme.palette.textPrimary }}>
                  Nominal ({telemetry.kernelLatencyMs}ms)
                </span>
              </div>

              {/* Latent Space */}
              <div className="flex items-center justify-between px-1" style={{ color: theme.palette.textSecondary }}>
                <span className="flex items-center gap-1.5">
                  <i className="fa-solid fa-brain text-[11px] opacity-60" />
                  Latent Units
                </span>
                <span className="font-semibold font-mono" style={{ color: theme.palette.textPrimary }}>
                  {telemetry.latentUnits} Units
                </span>
              </div>

              {/* VRAM Gauge */}
              <div className="px-1 pt-1 space-y-1">
                <div className="flex items-center justify-between text-[11px]" style={{ color: theme.palette.textMuted }}>
                  <span>VRAM Allocation</span>
                  <span className="font-mono" style={{ color: theme.palette.textSecondary }}>
                    {telemetry.vramUsed} / {telemetry.vramTotal} GB
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(telemetry.vramUsed / telemetry.vramTotal) * 100}%`,
                      backgroundColor: theme.palette.accent,
                    }}
                  />
                </div>
              </div>

              {/* Execution Tier */}
              <div
                className="flex items-center justify-between px-1 pt-1.5 border-t text-[11px]"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
              >
                <span>Execution Tier</span>
                <span className="font-medium" style={{ color: theme.palette.accent }}>
                  Tier-0 Enclave
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-4 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono"
            style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
          >
            <span>vLLM · Metal Backend</span>
            <span className="text-emerald-500 font-medium">
              {telemetry.tokenRate} t/s
            </span>
          </div>
        </div>

        {/* IPC Socket Bus */}
        <div
          className="p-3.5 rounded-2xl border shadow-xl backdrop-blur-2xl text-xs transition-all duration-300"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div className="flex items-center justify-between" style={{ color: theme.palette.textSecondary }}>
            <span className="flex items-center gap-1.5 font-medium">
              <i className="fa-solid fa-network-wired text-[10px] opacity-70" />
              IPC Socket Bus
            </span>
            <span className="font-mono text-[10px]" style={{ color: theme.palette.accent }}>
              {telemetry.jitterMs}ms jitter
            </span>
          </div>
          <div className="mt-1 text-[10px] font-mono opacity-50 truncate" style={{ color: theme.palette.textMuted }}>
            UDS daemon: {telemetry.ipcSocket}
          </div>
        </div>
      </div>

      {/* ================= CENTER / MAIN FLOATING SPATIAL CARD ================= */}
      <div className="relative w-full max-w-xl mx-auto flex flex-col z-20 space-y-3 pointer-events-auto">
        <div
          className="p-5 rounded-3xl border shadow-2xl backdrop-blur-3xl transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-start justify-between pb-3.5 border-b mb-4"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.palette.accent }}
                />
                <span
                  className="font-mono text-[10px] uppercase tracking-wider font-semibold"
                  style={{ color: theme.palette.accent }}
                >
                  Visual Manifestation &amp; Acoustic Core
                </span>
              </div>
              <h1 className="text-base font-medium tracking-tight mt-0.5" style={{ color: theme.palette.textPrimary }}>
                Spatial Topology &amp; Acoustic Cadence
              </h1>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border opacity-70"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            >
              WebGL v3 // Metal
            </span>
          </div>

          {/* Presence Selectors (Volumetric Orb vs Synthetic Humanoid) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Option 1: Volumetric Reactive Orb */}
            <div
              onClick={() => {
                setPresenceType('orb');
                addToast('Manifestation Set', 'Volumetric particulate core active.', 'info');
              }}
              className="cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between group"
              style={{
                backgroundColor: presenceType === 'orb' ? theme.palette.bgElevated : 'transparent',
                borderColor: presenceType === 'orb' ? theme.palette.accent : theme.palette.glassBorder,
                boxShadow: presenceType === 'orb' ? `0 10px 25px -5px ${theme.palette.glow}` : 'none',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-xl border flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: theme.palette.glassSurface,
                      borderColor: theme.palette.glassBorder,
                      color: theme.palette.accent,
                    }}
                  >
                    <i className="fa-solid fa-atom" />
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                    style={{ borderColor: presenceType === 'orb' ? theme.palette.accent : theme.palette.glassBorder }}
                  >
                    {presenceType === 'orb' && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                    )}
                  </div>
                </div>

                <div className="text-xs font-medium font-sans" style={{ color: theme.palette.textPrimary }}>
                  Volumetric Particulate Core
                </div>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.palette.textSecondary }}>
                  Harmonic particulate lattice responsive to acoustic stream cadence.
                </p>
              </div>

              <div
                className="mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
              >
                <span style={{ color: theme.palette.accent }}>12k points</span>
                <span>60 FPS target</span>
              </div>
            </div>

            {/* Option 2: Synthetic Topographic Humanoid */}
            <div
              onClick={() => {
                setPresenceType('humanoid');
                addToast('Manifestation Set', 'Synthetic wireframe humanoid with gaze tracking active.', 'info');
              }}
              className="cursor-pointer p-3.5 rounded-2xl border transition-all flex flex-col justify-between group"
              style={{
                backgroundColor: presenceType === 'humanoid' ? theme.palette.bgElevated : 'transparent',
                borderColor: presenceType === 'humanoid' ? theme.palette.accent : theme.palette.glassBorder,
                boxShadow: presenceType === 'humanoid' ? `0 10px 25px -5px ${theme.palette.glow}` : 'none',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-7 h-7 rounded-xl border flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: theme.palette.glassSurface,
                      borderColor: theme.palette.glassBorder,
                      color: theme.palette.accent,
                    }}
                  >
                    <i className="fa-solid fa-user-astronaut" />
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border flex items-center justify-center"
                    style={{ borderColor: presenceType === 'humanoid' ? theme.palette.accent : theme.palette.glassBorder }}
                  >
                    {presenceType === 'humanoid' && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                    )}
                  </div>
                </div>

                <div className="text-xs font-medium font-sans" style={{ color: theme.palette.textPrimary }}>
                  Synthetic Wireframe Humanoid
                </div>
                <p className="text-[11px] leading-relaxed mt-1" style={{ color: theme.palette.textSecondary }}>
                  Topographic facial contour mesh with real-time cursor gaze tracking.
                </p>
              </div>

              <div
                className="mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
              >
                <span style={{ color: theme.palette.accent }}>Topographic mesh</span>
                <span>Sub-cortex sync</span>
              </div>
            </div>
          </div>

          {/* Ambient Glass Opacity Slider */}
          <div
            className="p-3.5 rounded-2xl border space-y-2 mb-3"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="flex items-center gap-1.5" style={{ color: theme.palette.textSecondary }}>
                <i className="fa-solid fa-sliders text-[10px]" style={{ color: theme.palette.accent }} />
                Ambient Acrylic Material Density
              </span>
              <span className="font-mono text-xs font-medium" style={{ color: theme.palette.accent }}>
                {glassOpacity}% transmission
              </span>
            </div>
            <div className="relative flex items-center">
              <input
                type="range"
                min="30"
                max="95"
                value={glassOpacity}
                onChange={(e) => setGlassOpacity(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] opacity-50 px-0.5" style={{ color: theme.palette.textMuted }}>
              <span>30% (Ethereal Liquid)</span>
              <span>Refractive Acrylic Transmission</span>
              <span>95% (Dense Matte)</span>
            </div>
          </div>

          {/* Theme Spectrum Selector */}
          <div
            className="p-3.5 rounded-2xl border flex items-center justify-between"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Product Identity Themes
              </div>
              <div className="text-[10px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                5 calibrated environmental palettes
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {themeList.map((t) => {
                const isSelected = themeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id as ThemeId);
                      addToast('Theme Activated', `${t.name} applied across system.`, 'info');
                    }}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected ? 'scale-110 shadow-md ring-1 ring-white/50' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: t.palette.bgBase,
                      borderColor: t.palette.glassBorder,
                    }}
                    title={t.name}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.palette.accent }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Voice Runtime Breadcrumb */}
        <div
          className="px-4 py-2.5 rounded-2xl border backdrop-blur-2xl flex items-center justify-between text-xs"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textSecondary,
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: theme.palette.accent }}>✦</span>
            <span>
              VOICE RUNTIME: <span style={{ color: theme.palette.textPrimary }}>NOVA 96kHz</span>
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span>Hold</span>
            <kbd
              className="px-1.5 py-0.5 rounded border text-[9px]"
              style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              SPACE
            </kbd>
            <span>to speak</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FLOATING WIDGET: HARDWARE & SENSITIVITY ================= */}
      <div className="absolute right-6 top-6 bottom-8 flex flex-col justify-between w-72 pointer-events-auto z-20 space-y-3">
        {/* Hardware & Voice Sensitivity Card */}
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300 flex flex-col space-y-3.5"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div
            className="flex items-center justify-between pb-2 border-b text-xs"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: theme.palette.accent }}>
              Hardware &amp; Sensitivity
            </span>
            <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
            </span>
          </div>

          {/* Voice Activation Threshold */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between" style={{ color: theme.palette.textSecondary }}>
              <span>Voice Activation Gate</span>
              <span className="font-mono font-medium" style={{ color: theme.palette.accent }}>
                -{voiceThreshold} dBFS
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="55"
              value={voiceThreshold}
              onChange={(e) => setVoiceThreshold(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
            <div className="flex justify-between font-mono text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>
              <span>Barge-in: 84%</span>
              <span>Zero-Phase ANC</span>
            </div>
          </div>

          {/* Monospaced Kern Tuning */}
          <div
            className="p-2.5 rounded-xl border space-y-2"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center justify-between text-xs" style={{ color: theme.palette.textSecondary }}>
              <span>Monospace Kerning</span>
              <span className="font-mono text-[11px]" style={{ color: theme.palette.textPrimary }}>
                JetBrains Mono
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
              {['0.95x', '1.35x', '1.50x'].map((kern) => {
                const isSelected = monospaceKern === kern;
                return (
                  <button
                    key={kern}
                    onClick={() => {
                      setMonospaceKern(kern);
                      addToast('Kerning Updated', `Applied ${kern} optical scale.`, 'info');
                    }}
                    className="py-1 rounded-lg border transition-all cursor-pointer font-medium"
                    style={{
                      backgroundColor: isSelected ? theme.palette.accent : 'transparent',
                      color: isSelected ? (theme.isDark ? '#000' : '#fff') : theme.palette.textSecondary,
                      borderColor: isSelected ? theme.palette.accentBorder : theme.palette.glassBorder,
                    }}
                  >
                    {kern}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MCP Secure Vault Status */}
          <div
            className="p-2.5 rounded-xl border space-y-1.5"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center justify-between text-xs" style={{ color: theme.palette.textSecondary }}>
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-[10px]" style={{ color: theme.palette.accent }} />
                MCP Secure Vault
              </span>
              <span className="font-mono text-[10px] text-emerald-500 font-medium">AES-256</span>
            </div>
            <div className="space-y-1 font-mono text-[10px]" style={{ color: theme.palette.textMuted }}>
              <div className="flex items-center justify-between">
                <span>Synaptic Vectors</span>
                <span style={{ color: theme.palette.textPrimary }}>{telemetry.vectorSynapsesCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Memory Decay</span>
                <span style={{ color: theme.palette.accent }}>90d Half-Life</span>
              </div>
            </div>
          </div>

          {/* Export & Sync Actions */}
          <div className="pt-1 flex space-x-2">
            <button
              onClick={handleExport}
              className="flex-1 py-1.5 px-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:opacity-100"
              style={{
                backgroundColor: theme.palette.glassSurface,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            >
              <i className="fa-solid fa-arrow-down-to-bracket text-[10px]" /> Export
            </button>
            <button
              onClick={handleSync}
              className="flex-1 py-1.5 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:opacity-90"
              style={{
                backgroundColor: theme.palette.accent,
                borderColor: theme.palette.accentBorder,
                color: theme.isDark ? '#000000' : '#ffffff',
              }}
            >
              <i className={`fa-solid fa-rotate text-[10px] ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
          </div>
        </div>

        {/* Lower Right Hardware Enclave Badge */}
        <div
          className="p-3 rounded-2xl border shadow-xl backdrop-blur-2xl text-xs flex items-center justify-between"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <span className="flex items-center gap-1.5 text-[10px] truncate" style={{ color: theme.palette.textSecondary }}>
            <i className="fa-solid fa-circle-check text-[10px] text-emerald-500" />
            Hardware Enclave Locked
          </span>
          <span className="font-mono text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>
            SHA-512
          </span>
        </div>
      </div>
    </div>
  );
};
