import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const IdentitySection: React.FC = () => {
  const { identity, updateIdentity } = useNovaSettings();
  const { theme } = useNova();

  const presenceModes = [
    { id: 'active', name: 'Active / Available', icon: 'fa-circle-check', color: '#10b981' },
    { id: 'focus', name: 'Deep Focus Sprint', icon: 'fa-brain', color: '#6366f1' },
    { id: 'meeting', name: 'In a Meeting', icon: 'fa-users', color: '#f59e0b' },
    { id: 'away', name: 'Away from Terminal', icon: 'fa-clock', color: '#64748b' },
    { id: 'dnd', name: 'Do Not Disturb', icon: 'fa-ban', color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Identity &amp; Companion Presence
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure user profile metadata, acoustic voice recognition, and contextual presence states.
        </p>
      </div>

      {/* User Profile */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Primary Operator Profile
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Operator Name
            </label>
            <input
              type="text"
              value={identity.userName}
              onChange={(e) => updateIdentity('userName', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Preferred Addressing Form
            </label>
            <input
              type="text"
              value={identity.preferredName}
              onChange={(e) => updateIdentity('preferredName', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
          </div>
        </div>
      </div>

      {/* Presence States */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Active Presence &amp; Availability State
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {presenceModes.map((mode) => {
            const isSelected = identity.presenceStatus === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => updateIdentity('presenceStatus', mode.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isSelected ? 'ring-1 scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.palette.glassSurface : 'transparent',
                  borderColor: isSelected ? theme.palette.accent : theme.palette.glassBorder,
                }}
              >
                <i className={`fa-solid ${mode.icon} text-xs`} style={{ color: mode.color }} />
                <span className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                  {mode.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speaker Recognition */}
      <div
        className="p-5 rounded-2xl border space-y-3"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Acoustic Voice Print Recognition
        </span>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
              Verify Primary Operator Voiceprint
            </div>
            <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
              Rejects wake-word activation from unrecognized speakers in shared rooms.
            </div>
          </div>
          <input
            type="checkbox"
            checked={identity.voiceRecognitionEnabled}
            onChange={(e) => updateIdentity('voiceRecognitionEnabled', e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-slate-400"
          />
        </div>
      </div>
    </div>
  );
};
