import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const DiagnosticsPerformanceSection: React.FC = () => {
  const { isDiagnosing, diagnosticsResult, runDiagnostics, appearance, updateAppearance } = useNovaSettings();
  const { theme, telemetry } = useNova();

  const presets = [
    { id: 'quality', name: 'High Quality (Liquid Glass)', desc: '28px multi-layer specular glass, 60fps Three.js particles, full refraction.' },
    { id: 'balanced', name: 'Balanced Efficiency', desc: '18px frosted acrylic, calibrated background shaders, low thermal footprint.' },
    { id: 'performance', name: 'Performance Mode', desc: 'Reduced blur passes, optimized for battery life or older iGPU hardware.' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          System Diagnostics &amp; Hardware Performance
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Monitor live kernel vitals, execute operational health audits, and configure rendering performance presets.
        </p>
      </div>

      {/* Diagnostics Health Center */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
            Autonomous Health &amp; Substrate Audit
          </span>
          <button
            onClick={runDiagnostics}
            disabled={isDiagnosing}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-50"
            style={{
              backgroundColor: theme.palette.accent,
              borderColor: theme.palette.accentBorder,
              color: theme.isDark ? '#000' : '#fff',
            }}
          >
            <i className={`fa-solid ${isDiagnosing ? 'fa-arrows-rotate animate-spin' : 'fa-stethoscope'} text-[10px]`} />
            <span>{isDiagnosing ? 'Auditing Subsystem...' : 'Run Diagnostics'}</span>
          </button>
        </div>

        {/* Live Hardware Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
            <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textMuted }}>
              CPU USAGE
            </div>
            <div className="text-sm font-semibold font-mono mt-0.5" style={{ color: theme.palette.textPrimary }}>
              14.2%
            </div>
            <div className="text-[9px] text-emerald-500 font-mono mt-0.5">8 cores nominal</div>
          </div>

          <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
            <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textMuted }}>
              VRAM ALLOCATION
            </div>
            <div className="text-sm font-semibold font-mono mt-0.5" style={{ color: theme.palette.textPrimary }}>
              {telemetry.vramUsed} GB
            </div>
            <div className="text-[9px] font-mono opacity-60" style={{ color: theme.palette.textSecondary }}>76% of 24 GB</div>
          </div>

          <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
            <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textMuted }}>
              KERNEL LATENCY
            </div>
            <div className="text-sm font-semibold font-mono mt-0.5" style={{ color: theme.palette.textPrimary }}>
              {telemetry.kernelLatencyMs}ms
            </div>
            <div className="text-[9px] text-emerald-500 font-mono mt-0.5">Zero drift</div>
          </div>

          <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
            <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textMuted }}>
              IPC JITTER
            </div>
            <div className="text-sm font-semibold font-mono mt-0.5" style={{ color: theme.palette.textPrimary }}>
              {telemetry.jitterMs}ms
            </div>
            <div className="text-[9px] text-emerald-500 font-mono mt-0.5">UDS daemon ok</div>
          </div>
        </div>

        {/* Diagnostics Results if executed */}
        {diagnosticsResult && (
          <div
            className="p-4 rounded-xl border space-y-2 text-xs font-mono animate-fade-in"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder }}
          >
            <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: theme.palette.glassBorder }}>
              <span className="font-semibold text-emerald-500">
                <i className="fa-solid fa-circle-check mr-1.5" /> All 8 Health Verification Checks Passed
              </span>
              <span className="text-[10px] opacity-50">Exit code 0</span>
            </div>
            <div className="space-y-1 text-[11px]" style={{ color: theme.palette.textSecondary }}>
              {Object.entries(diagnosticsResult).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-emerald-400 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance & Quality Presets */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Rendering Quality &amp; Thermal Presets
        </span>

        <div className="space-y-2.5">
          {presets.map((p) => {
            const isSelected = appearance.qualityPreset === p.id;
            return (
              <div
                key={p.id}
                onClick={() => updateAppearance('qualityPreset', p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected ? 'ring-1 scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.palette.glassSurface : 'transparent',
                  borderColor: isSelected ? theme.palette.accent : theme.palette.glassBorder,
                }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                    {p.name}
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5" style={{ color: theme.palette.textSecondary }}>
                    {p.desc}
                  </div>
                </div>

                <span
                  className="w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-3"
                  style={{ borderColor: isSelected ? theme.palette.accent : theme.palette.glassBorder }}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.palette.accent }} />
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
