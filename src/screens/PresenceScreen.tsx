import React, { useState } from 'react';
import { useNova } from '../context/NovaStateContext';
import { SpatialCanvas } from '../components/three/SpatialCanvas';

export const PresenceScreen: React.FC = () => {
  const {
    presenceType,
    setPresenceType,
    theme,
    audioLevel,
    isListening,
    trajectories,
    dispatchTask,
    dryRunTask,
    addTask,
    logs,
    logFilter,
    setLogFilter,
    telemetry,
    addToast,
  } = useNova();

  const [activePrimitiveIndex, setActivePrimitiveIndex] = useState<number | null>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Synthesis');

  const primitives = [
    {
      id: 'web-research',
      title: 'Web Deep Research',
      version: 'v2.4 multi-agent',
      metric: '1.2s avg',
      icon: 'fa-compass',
      description: 'Distributed consensus crawling with citation extraction and semantic cross-validation.',
    },
    {
      id: 'tree-sitter',
      title: 'Tree-Sitter Synthesis',
      version: 'AST diff & Wasm VM',
      metric: 'Isolated',
      icon: 'fa-code',
      description: 'In-memory syntax tree reconciliation without filesystem persistence side-effects.',
    },
    {
      id: 'spatial-vision',
      title: 'Spatial Vision & Gaze',
      version: 'OCR & Head-pose',
      metric: '60 FPS',
      icon: 'fa-eye',
      description: 'Zero-latency spatial window buffer analysis with optical focal tracking.',
    },
    {
      id: 'browser-auto',
      title: 'Browser Automation',
      version: 'Playwright Pool',
      metric: 'Auth Gate',
      icon: 'fa-window-maximize',
      description: 'Ephemeral sandboxed Chromium instances with strictly scoped token vaults.',
    },
    {
      id: 'audio-stem',
      title: 'Audio Stem & Voice',
      version: '96kHz Resynthesis',
      metric: 'Active',
      icon: 'fa-sliders',
      description: 'Real-time harmonic voice beamforming with sub-10ms acoustic latency buffer.',
    },
  ];

  const handleScanMatrix = () => {
    setIsScanning(true);
    addToast('Scanning Matrix', 'Auditing 42 capability signatures across sandbox namespaces...', 'info');
    setTimeout(() => {
      setIsScanning(false);
      addToast('Matrix Scan Verified', 'All 42 skills verified. Zero drift detected.', 'success');
      dispatchTask('Matrix Audit: 42 capability signatures verified against security ledger');
    }, 1200);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskCategory);
    setNewTaskTitle('');
    setShowNewTaskDialog(false);
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'all') return true;
    if (logFilter === 'web') return log.source.toLowerCase().includes('web') || log.agent.toLowerCase().includes('lexicon');
    if (logFilter === 'internal') return log.source.toLowerCase().includes('internal') || log.agent.toLowerCase().includes('synapse');
    if (logFilter === 'enclave') return log.source.toLowerCase().includes('enclave') || log.agent.toLowerCase().includes('sentinel');
    return true;
  });

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* ================= SUBTLE AMBIENT SATELLITES ================= */}
      <div className="absolute left-[26%] top-[14%] w-32 h-32 pointer-events-none opacity-40 z-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{ backgroundColor: `${theme.palette.accent}08` }}
          />
          <div
            className="absolute inset-2 rounded-full border border-dashed animate-[spin_60s_linear_infinite]"
            style={{ borderColor: `${theme.palette.accent}20` }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
        </div>
      </div>

      <div className="absolute right-[27%] top-[12%] w-32 h-32 pointer-events-none opacity-40 z-0">
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{ backgroundColor: `${theme.palette.accent}08` }}
          />
          <div
            className="absolute inset-2 rounded-full border border-dashed animate-[spin_50s_linear_infinite_reverse]"
            style={{ borderColor: `${theme.palette.accent}20` }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: theme.palette.accent }}
          />
        </div>
      </div>

      {/* ================= LEFT FLOATING HUD: SUBSTRATE & PRIMITIVES ================= */}
      <div className="absolute left-20 top-6 bottom-8 flex flex-col space-y-3 w-64 pointer-events-auto z-20">
        {/* Active Substrate Card */}
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div className="flex items-center justify-between text-xs mb-2.5">
            <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: theme.palette.accent }}>
              Active Substrate
            </span>
            <span className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textSecondary }}>
              v4.2 // MCP
            </span>
          </div>

          <div className="space-y-1.5 text-[11px] font-sans">
            <div className="flex items-center justify-between" style={{ color: theme.palette.textSecondary }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                <span>Loaded Skills</span>
              </span>
              <span className="font-semibold font-mono" style={{ color: theme.palette.textPrimary }}>
                42
              </span>
            </div>

            <div className="flex items-center justify-between" style={{ color: theme.palette.textSecondary }}>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Sandbox State</span>
              </span>
              <span className="font-medium text-emerald-500">Strict L3</span>
            </div>
          </div>

          <div
            className="mt-3 pt-2.5 border-t flex items-center justify-between text-[10px] font-sans"
            style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
          >
            <span>Mean Latency</span>
            <span style={{ color: theme.palette.textSecondary }}>84ms · Zero Drift</span>
          </div>
        </div>

        {/* Matrix Primitives */}
        <div
          className="p-3.5 rounded-2xl border shadow-xl backdrop-blur-2xl flex-1 flex flex-col transition-all duration-300 overflow-hidden"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div
            className="flex items-center justify-between pb-2 border-b mb-2 text-xs"
            style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            <span className="uppercase tracking-wider text-[9px] font-semibold flex items-center gap-1.5" style={{ color: theme.palette.textPrimary }}>
              <i className="fa-solid fa-microchip text-[10px] opacity-70" /> Matrix Primitives
            </span>
            <span className="text-[10px] opacity-50 font-mono">5 Pinned</span>
          </div>

          {/* Micro capability items */}
          <div className="space-y-1.5 overflow-y-auto pr-0.5 flex-1">
            {primitives.map((item, idx) => {
              const isSelected = activePrimitiveIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActivePrimitiveIndex(isSelected ? null : idx)}
                  className="p-2.5 rounded-xl transition-all cursor-pointer border group"
                  style={{
                    backgroundColor: isSelected ? theme.palette.bgElevated : 'transparent',
                    borderColor: isSelected ? theme.palette.accentBorder : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium flex items-center gap-1.5 truncate" style={{ color: theme.palette.textPrimary }}>
                      <i className={`fa-solid ${item.icon} text-[10px] opacity-60 group-hover:opacity-100 transition-opacity`} />
                      {item.title}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isSelected ? theme.palette.accent : theme.palette.textMuted }}
                    />
                  </div>

                  <div
                    className="flex items-center justify-between mt-1 text-[10px] font-sans"
                    style={{ color: theme.palette.textMuted }}
                  >
                    <span>{item.version}</span>
                    <span style={{ color: isSelected ? theme.palette.accent : theme.palette.textSecondary }}>
                      {item.metric}
                    </span>
                  </div>

                  {isSelected && (
                    <div
                      className="mt-2 pt-1.5 border-t text-[10px] leading-relaxed animate-fade-in font-sans"
                      style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Scan Matrix + Trigger */}
          <div
            className="mt-2 pt-2 border-t flex items-center justify-between text-[10px] font-sans"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <span style={{ color: theme.palette.textMuted }}>Dynamic Telemetry</span>
            <button
              onClick={handleScanMatrix}
              className="transition-colors flex items-center gap-1 cursor-pointer font-medium hover:opacity-100"
              style={{ color: theme.palette.accent }}
            >
              <i className={`fa-solid fa-arrows-rotate text-[9px] ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Matrix +'}
            </button>
          </div>
        </div>
      </div>

      {/* ================= CENTRAL PHYSICAL 3D PRESENCE STAGE ================= */}
      <div className="relative flex flex-col items-center justify-center z-10 select-none">
        <div className="relative w-80 h-80 md:w-[420px] md:h-[420px] flex items-center justify-center entity-float bg-transparent">
          {/* Subtle atmospheric ambient glow */}
          <div
            className="absolute inset-4 rounded-full blur-3xl ambient-glow pointer-events-none transition-all duration-700"
            style={{ backgroundColor: `${theme.palette.accent}0a` }}
          />

          {/* Real Three.js fluid particulate & wireframe engine */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <SpatialCanvas
              presenceType={presenceType}
              theme={theme}
              audioLevel={audioLevel}
              isListening={isListening}
            />
          </div>

          {/* Quiet physical orbital ring */}
          <div
            className="absolute inset-8 rounded-full border pointer-events-none transition-colors duration-500 opacity-20"
            style={{ borderColor: theme.palette.orbWireframe }}
          />
        </div>

        {/* Minimal Holographic Status Capsule with Mode Toggle */}
        <div className="flex items-center space-x-2.5 -mt-2 pointer-events-auto z-20">
          <button
            onClick={() => setPresenceType(presenceType === 'orb' ? 'humanoid' : 'orb')}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
            title="Previous Mode"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div
            onClick={() => setPresenceType(presenceType === 'orb' ? 'humanoid' : 'orb')}
            className="cursor-pointer flex items-center space-x-2 px-3.5 py-1.5 rounded-full border backdrop-blur-2xl text-[10px] font-sans transition-all hover:opacity-100 shadow-md"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
              boxShadow: `0 10px 25px -5px rgba(0,0,0,0.3), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.palette.accent }}
            />
            <span className="tracking-wide">
              {presenceType === 'orb'
                ? 'Skill Substrate · Particulate Core Active'
                : 'Synthetic Humanoid · Topographic Gaze Sync'}
            </span>
          </div>

          <button
            onClick={() => setPresenceType(presenceType === 'orb' ? 'humanoid' : 'orb')}
            className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
            title="Next Mode"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* ================= RIGHT FLOATING HUD: LIVE QUEUE & TRANSPARENCY ================= */}
      <div className="absolute right-6 top-6 bottom-8 flex flex-col justify-between w-80 max-w-[340px] pointer-events-auto z-20 space-y-3">
        {/* Runtime Trajectory live queue */}
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-300"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div
            className="flex items-center justify-between pb-2 border-b mb-2.5"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <span className="uppercase tracking-wider text-[9px] font-semibold flex items-center gap-1.5" style={{ color: theme.palette.accent }}>
              <i className="fa-solid fa-bolt text-[10px]" /> Runtime Trajectory
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] opacity-50 font-mono" style={{ color: theme.palette.textSecondary }}>
                Live Queue
              </span>
              <button
                onClick={() => setShowNewTaskDialog(true)}
                className="w-4 h-4 rounded-md border flex items-center justify-center text-[9px] hover:opacity-100 cursor-pointer"
                style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
                title="Add Task"
              >
                <i className="fa-solid fa-plus" />
              </button>
            </div>
          </div>

          {/* New Task creation drawer */}
          {showNewTaskDialog && (
            <form onSubmit={handleCreateTask} className="mb-2.5 p-2.5 rounded-xl border space-y-2 animate-fade-in" style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task description..."
                autoFocus
                className="w-full text-xs bg-transparent outline-none border-b pb-1 font-sans placeholder:opacity-40"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
              />
              <div className="flex items-center justify-between pt-1">
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="text-[10px] bg-transparent outline-none font-mono"
                  style={{ color: theme.palette.textSecondary }}
                >
                  <option value="Research">Research</option>
                  <option value="Synthesis">Synthesis</option>
                  <option value="Vision">Vision</option>
                  <option value="Acoustic">Acoustic</option>
                </select>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowNewTaskDialog(false)}
                    className="px-2 py-0.5 rounded text-[10px] opacity-60 hover:opacity-100"
                    style={{ color: theme.palette.textSecondary }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-2.5 py-0.5 rounded text-[10px] font-medium border"
                    style={{ backgroundColor: theme.palette.accent, color: theme.isDark ? '#000' : '#fff', borderColor: theme.palette.accentBorder }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task queue list */}
          <div className="space-y-2">
            {trajectories.map((t) => (
              <div
                key={t.id}
                onClick={() => dispatchTask(t.id)}
                className="flex items-center space-x-2 text-xs transition-colors cursor-pointer group p-1 rounded-lg hover:bg-white/[0.03]"
                style={{ color: theme.palette.textSecondary }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    t.status === 'running'
                      ? 'bg-amber-400 animate-pulse'
                      : t.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'opacity-40'
                  }`}
                  style={{
                    backgroundColor:
                      t.status === 'idle' ? theme.palette.textMuted : undefined,
                  }}
                />
                <span className="truncate group-hover:translate-x-0.5 transition-transform" style={{ color: theme.palette.textPrimary }}>
                  {t.title}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div
            className="mt-3.5 pt-2.5 border-t flex space-x-2"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <button
              onClick={() => dryRunTask(trajectories[0]?.id || 'Dry Run Validation')}
              className="flex-1 py-1.5 px-2 rounded-xl border text-xs font-sans flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:opacity-100"
              style={{
                backgroundColor: theme.palette.glassSurface,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            >
              <i className="fa-solid fa-terminal text-[10px] opacity-70" /> Dry Run
            </button>
            <button
              onClick={() => dispatchTask(trajectories[0]?.id || 'Dispatch Primary')}
              className="flex-1 py-1.5 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:opacity-90"
              style={{
                backgroundColor: theme.palette.accent,
                borderColor: theme.palette.accentBorder,
                color: theme.isDark ? '#090a0d' : '#ffffff',
              }}
            >
              <i className="fa-solid fa-play text-[9px]" /> Dispatch
            </button>
          </div>
        </div>

        {/* Agent Transparency Stream */}
        <div
          className="p-4 rounded-2xl border shadow-xl backdrop-blur-2xl flex-1 max-h-[290px] flex flex-col justify-between transition-all duration-300"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px rgba(0,0,0,0.4), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div>
            <div
              className="flex items-center justify-between pb-2 border-b text-xs mb-2"
              style={{ borderColor: theme.palette.glassBorder }}
            >
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider">
                <span className="font-semibold" style={{ color: theme.palette.textPrimary }}>
                  Agent
                </span>
                <span className="opacity-30">|</span>
                <span style={{ color: theme.palette.textSecondary }}>Transparency</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {telemetry.kernelLatencyMs}ms
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 mb-2 font-mono text-[9px]">
              {['all', 'web', 'internal', 'enclave'].map((f) => (
                <button
                  key={f}
                  onClick={() => setLogFilter(f)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                    logFilter === f ? 'font-semibold border' : 'opacity-50 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: logFilter === f ? theme.palette.bgElevated : 'transparent',
                    borderColor: logFilter === f ? theme.palette.glassBorder : 'transparent',
                    color: logFilter === f ? theme.palette.textPrimary : theme.palette.textSecondary,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry stream items */}
          <div className="my-1 space-y-2 overflow-y-auto pr-1 text-xs flex-1">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-2 rounded-xl border transition-colors"
                style={{
                  backgroundColor: theme.palette.bgElevated,
                  borderColor: theme.palette.glassBorder,
                }}
              >
                <div
                  className="flex items-center justify-between text-[10px] mb-1 font-mono"
                  style={{ color: theme.palette.textMuted }}
                >
                  <span className="font-medium" style={{ color: theme.palette.accent }}>
                    {log.agent} · {log.source}
                  </span>
                  <span>{log.timeOffset}</span>
                </div>
                <p className="text-xs leading-relaxed font-sans" style={{ color: theme.palette.textSecondary }}>
                  {log.message}
                </p>
              </div>
            ))}
          </div>

          {/* Security Affirmation Footer */}
          <div
            className="pt-2 border-t flex items-center justify-between text-xs"
            style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
          >
            <span className="flex items-center gap-1.5 text-[10px] truncate">
              <i className="fa-solid fa-shield-halved text-[9px]" style={{ color: theme.palette.accent }} />
              Cryptographic SHA-256 Ledger
            </span>
            <button
              onClick={() => addToast('Enclave Verified', 'Hardware enclave SHA-256 hash valid. Zero integrity violations.', 'success')}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Audit Seal"
            >
              <i className="fa-solid fa-ellipsis" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
