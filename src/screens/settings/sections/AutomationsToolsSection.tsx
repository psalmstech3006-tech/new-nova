import React, { useState } from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const AutomationsToolsSection: React.FC = () => {
  const {
    automations,
    toggleAutomation,
    deleteAutomation,
    addAutomation,
    pauseAllAutomations,
    setPauseAllAutomations,
    capabilities,
    toggleCapability,
    setCapabilityPermission,
  } = useNovaSettings();
  const { theme } = useNova();

  const [showAddAuto, setShowAddAuto] = useState(false);
  const [autoName, setAutoName] = useState('');
  const [autoTrigger, setAutoTrigger] = useState('');
  const [autoAction, setAutoAction] = useState('');

  const handleCreateAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!autoName.trim() || !autoTrigger.trim() || !autoAction.trim()) return;
    addAutomation({
      name: autoName.trim(),
      trigger: autoTrigger.trim(),
      action: autoAction.trim(),
      enabled: true,
      type: 'conditional',
    });
    setAutoName('');
    setAutoTrigger('');
    setAutoAction('');
    setShowAddAuto(false);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Automations, Routines &amp; Tool Capabilities
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure event-driven background routines, scheduled maintenance, and capability permission gates.
        </p>
      </div>

      {/* Automations List */}
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
            <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
              Active Background Automations
            </span>
            <span className="text-xs opacity-60" style={{ color: theme.palette.textSecondary }}>
              {automations.filter((a) => a.enabled).length} of {automations.length} active
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPauseAllAutomations(!pauseAllAutomations)}
              className="px-3 py-1 rounded-xl border text-xs font-medium cursor-pointer"
              style={{
                backgroundColor: pauseAllAutomations ? 'rgba(239, 68, 68, 0.15)' : theme.palette.glassSurface,
                borderColor: pauseAllAutomations ? '#ef4444' : theme.palette.glassBorder,
                color: pauseAllAutomations ? '#ef4444' : theme.palette.textSecondary,
              }}
            >
              {pauseAllAutomations ? 'Resume All' : 'Pause All'}
            </button>
            <button
              onClick={() => setShowAddAuto(true)}
              className="px-3 py-1 rounded-xl border text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
              style={{
                backgroundColor: theme.palette.accent,
                borderColor: theme.palette.accentBorder,
                color: theme.isDark ? '#000' : '#fff',
              }}
            >
              <i className="fa-solid fa-plus text-[10px]" />
              <span>Add Routine</span>
            </button>
          </div>
        </div>

        {/* Modal / Inline Add Form */}
        {showAddAuto && (
          <form onSubmit={handleCreateAutomation} className="p-3.5 rounded-xl border space-y-2.5 animate-fade-in" style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}>
            <div className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
              Create Automation Routine
            </div>
            <input
              type="text"
              placeholder="Routine Name (e.g. Workspace Clean)"
              value={autoName}
              onChange={(e) => setAutoName(e.target.value)}
              required
              className="w-full text-xs p-2 rounded-lg border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
            <input
              type="text"
              placeholder="Trigger Condition (e.g. When Wi-Fi is connected at Lab)"
              value={autoTrigger}
              onChange={(e) => setAutoTrigger(e.target.value)}
              required
              className="w-full text-xs p-2 rounded-lg border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
            <input
              type="text"
              placeholder="Action to Execute (e.g. Index workspace and pull git origin)"
              value={autoAction}
              onChange={(e) => setAutoAction(e.target.value)}
              required
              className="w-full text-xs p-2 rounded-lg border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddAuto(false)}
                className="px-2.5 py-1 text-xs opacity-60 hover:opacity-100"
                style={{ color: theme.palette.textSecondary }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg text-xs font-medium border"
                style={{ backgroundColor: theme.palette.accent, color: theme.isDark ? '#000' : '#fff', borderColor: theme.palette.accentBorder }}
              >
                Create Rule
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {automations.map((a) => (
            <div
              key={a.id}
              className="p-3.5 rounded-xl border flex items-center justify-between"
              style={{
                backgroundColor: theme.palette.glassSurface,
                borderColor: theme.palette.glassBorder,
                opacity: pauseAllAutomations ? 0.5 : 1,
              }}
            >
              <div>
                <div className="text-xs font-medium font-sans flex items-center gap-2" style={{ color: theme.palette.textPrimary }}>
                  <span>{a.name}</span>
                  <span className="text-[9px] font-mono opacity-50 px-1.5 rounded border" style={{ borderColor: theme.palette.glassBorder }}>
                    {a.type}
                  </span>
                </div>
                <div className="text-[11px] opacity-70 mt-0.5" style={{ color: theme.palette.textSecondary }}>
                  Trigger: <span className="italic">{a.trigger}</span> → {a.action}
                </div>
                {a.lastRun && (
                  <div className="text-[9px] font-mono opacity-40 mt-1" style={{ color: theme.palette.textMuted }}>
                    Last fired: {a.lastRun}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <input
                  type="checkbox"
                  checked={a.enabled && !pauseAllAutomations}
                  onChange={() => toggleAutomation(a.id)}
                  disabled={pauseAllAutomations}
                  className="w-4 h-4 rounded cursor-pointer accent-slate-400"
                />
                <button
                  onClick={() => deleteAutomation(a.id)}
                  className="text-slate-400 hover:text-red-400 text-xs transition-colors p-1"
                  title="Delete Routine"
                >
                  <i className="fa-solid fa-trash-can" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Capabilities Manager */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Capability Sandboxes &amp; Worker Scopes
        </span>

        <div className="space-y-2.5">
          {capabilities.map((c) => (
            <div
              key={c.id}
              className="p-3 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
            >
              <div>
                <div className="text-xs font-medium font-sans flex items-center gap-2" style={{ color: theme.palette.textPrimary }}>
                  <span>{c.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border" style={{ borderColor: theme.palette.glassBorder, color: theme.palette.accent }}>
                    {c.category}
                  </span>
                </div>
                <div className="text-[11px] opacity-60 mt-0.5" style={{ color: theme.palette.textSecondary }}>
                  {c.description} · Last used: {c.lastUsed}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-3">
                <select
                  value={c.permissionLevel}
                  onChange={(e) => setCapabilityPermission(c.id, e.target.value as typeof c.permissionLevel)}
                  className="text-[10px] p-1 rounded-lg border bg-transparent font-mono"
                  style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
                >
                  <option value="always-ask">Always Ask</option>
                  <option value="ask-sensitive">Ask Sensitive</option>
                  <option value="trusted">Trusted</option>
                </select>
                <input
                  type="checkbox"
                  checked={c.enabled}
                  onChange={() => toggleCapability(c.id)}
                  className="w-4 h-4 rounded cursor-pointer accent-slate-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
