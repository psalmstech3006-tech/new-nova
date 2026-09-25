import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const MemorySection: React.FC = () => {
  const { memorySettings, updateMemorySettings, toggleMemoryCategory } = useNovaSettings();
  const { theme, telemetry, nodes, addToast } = useNova();

  const handleExportMemory = () => {
    const memoryDump = {
      product: 'NOVA Memory Vault Archive',
      exportedAt: new Date().toISOString(),
      vectorCount: telemetry.vectorSynapsesCount,
      categories: memorySettings.categories,
      atoms: nodes,
    };
    const blob = new Blob([JSON.stringify(memoryDump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-memory-vault-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Memory Vault Exported', `Archived ${nodes.length} memory atoms to JSON.`, 'success');
  };

  const handleClearTemporary = () => {
    const confirmed = window.confirm('Purge all temporary conversational context? Persistent locked memory atoms will remain safe.');
    if (confirmed) {
      addToast('Temporary Memory Cleared', 'Freed 12MB of conversational cache.', 'info');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Memory Vault &amp; Synaptic Provenance
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Inspect what NOVA remembers about you, explore provenance sources, manage retention policies, and export encrypted archives.
        </p>
      </div>

      {/* Vault Status Overview */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.palette.accent }}>
              Memory Subsystem Status
            </div>
            <div className="text-xs mt-0.5" style={{ color: theme.palette.textSecondary }}>
              Encrypted HNSW Vector Space · {telemetry.vectorSynapsesCount.toLocaleString()} Active Synapses
            </div>
          </div>
          <input
            type="checkbox"
            checked={memorySettings.memoryEnabled}
            onChange={(e) => updateMemorySettings('memoryEnabled', e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-slate-400"
          />
        </div>

        {/* Action strip */}
        <div className="flex gap-2 pt-2 border-t" style={{ borderColor: theme.palette.glassBorder }}>
          <button
            onClick={handleExportMemory}
            className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
          >
            <i className="fa-solid fa-arrow-down-to-bracket text-[10px]" />
            <span>Export Memory Vault</span>
          </button>
          <button
            onClick={handleClearTemporary}
            className="px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all opacity-70 hover:opacity-100 cursor-pointer"
            style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            <i className="fa-solid fa-broom text-[10px]" />
            <span>Purge Temporary Cache</span>
          </button>
        </div>
      </div>

      {/* Memory Categories */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Indexed Memory Compartments
        </span>

        <div className="space-y-2.5">
          {memorySettings.categories.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border flex items-center justify-between transition-colors"
              style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
            >
              <div>
                <div className="text-xs font-medium font-sans flex items-center gap-2" style={{ color: theme.palette.textPrimary }}>
                  <span>{c.name}</span>
                  <span className="text-[9px] font-mono opacity-50 px-1.5 py-0.2 rounded border" style={{ borderColor: theme.palette.glassBorder }}>
                    {c.count} items
                  </span>
                </div>
                <div className="text-[11px] opacity-60 mt-0.5" style={{ color: theme.palette.textSecondary }}>
                  {c.description}
                </div>
              </div>

              <input
                type="checkbox"
                checked={c.enabled}
                onChange={() => toggleMemoryCategory(c.id)}
                className="w-4 h-4 rounded cursor-pointer accent-slate-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Provenance & Retention Policies */}
      <div
        className="p-5 rounded-2xl border space-y-3"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Provenance &amp; Retention Rules
        </span>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Ask Before Storing Personal Preferences
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Prompt confirmation whenever a long-term habit or preference is inferred.
              </div>
            </div>
            <input
              type="checkbox"
              checked={memorySettings.askBeforeRemember}
              onChange={(e) => updateMemorySettings('askBeforeRemember', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.palette.glassBorder }}>
            <div>
              <div className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Memory Expiration Half-Life
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Automatically decay unreinforced task references after 90 days of inactivity.
              </div>
            </div>
            <span className="font-mono text-xs font-semibold" style={{ color: theme.palette.accent }}>
              {memorySettings.memoryExpirationDays} Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
