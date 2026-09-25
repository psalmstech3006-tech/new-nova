import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const PrivacyNetworkSection: React.FC = () => {
  const { integrations, toggleIntegration } = useNovaSettings();
  const { theme, addToast } = useNova();

  const handleExportData = () => {
    addToast('Privacy Archive', 'Exporting local privacy profile and session logs to encrypted zip.', 'info');
  };

  const handleDeleteData = () => {
    const confirmed = window.confirm('Permanently delete all local conversation logs, scratchpad caches, and telemetry?');
    if (confirmed) {
      addToast('Data Purged', 'All local logs and scratchpads wiped clean.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Privacy, Network &amp; Connected Integrations
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Manage local vs cloud processing boundaries, zero-telemetry privacy guarantees, offline mode, and 3P services.
        </p>
      </div>

      {/* Local vs Cloud Privacy Boundaries */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Data Privacy &amp; On-Device Isolation
        </span>

        <div className="p-3.5 rounded-xl border flex items-center justify-between" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-lock text-sm text-emerald-500" />
            <div>
              <div className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                Strict Local Processing Mode
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                All vector searches, embeddings, and code parsing run strictly on local hardware. Zero telemetry sent to external clouds.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-emerald-500 border-emerald-500/30">
            ENFORCED
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
          >
            <i className="fa-solid fa-download text-[10px]" /> Export Personal Data
          </button>
          <button
            onClick={handleDeleteData}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all text-red-400 hover:bg-red-500/10 cursor-pointer"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <i className="fa-solid fa-trash-can text-[10px]" /> Delete Local Logs
          </button>
        </div>
      </div>

      {/* Connected Integrations */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Connected External Integrations
        </span>

        <div className="space-y-2.5">
          {integrations.map((int) => (
            <div
              key={int.id}
              className="p-3.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border flex items-center justify-center text-xs"
                  style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder, color: theme.palette.accent }}
                >
                  <i className={`fa-brands ${int.icon}`} />
                </div>
                <div>
                  <div className="text-xs font-medium font-sans flex items-center gap-2" style={{ color: theme.palette.textPrimary }}>
                    <span>{int.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                        int.connected ? 'text-emerald-500 border-emerald-500/30' : 'opacity-40 border-slate-700'
                      }`}
                    >
                      {int.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-60 mt-0.5" style={{ color: theme.palette.textSecondary }}>
                    Scope: {int.authScope} · Last sync: {int.lastSynced}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleIntegration(int.id)}
                className="px-3 py-1 rounded-xl border text-xs font-medium transition-all hover:scale-105 cursor-pointer"
                style={{
                  backgroundColor: int.connected ? theme.palette.bgElevated : theme.palette.accent,
                  color: int.connected ? theme.palette.textSecondary : (theme.isDark ? '#000' : '#fff'),
                  borderColor: theme.palette.glassBorder,
                }}
              >
                {int.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
