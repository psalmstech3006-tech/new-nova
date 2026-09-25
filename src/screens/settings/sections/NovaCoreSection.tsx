import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';
import { ProactivityLevel } from '../../../types/settings';

export const NovaCoreSection: React.FC = () => {
  const { novaCore, updateNovaCore } = useNovaSettings();
  const { theme } = useNova();

  const proactivityLevels: { level: ProactivityLevel; title: string; desc: string }[] = [
    {
      level: 'passive',
      title: 'Passive',
      desc: 'NOVA only acts when explicitly summoned. Zero unprompted suggestions or reminders.',
    },
    {
      level: 'balanced',
      title: 'Balanced',
      desc: 'Notices pending deadlines and surfaces relevant context only when active workspace changes.',
    },
    {
      level: 'proactive',
      title: 'Proactive',
      desc: 'Anticipates workflow needs, highlights uncommitted code diffs, and suggests research avenues.',
    },
    {
      level: 'highly-proactive',
      title: 'Highly Proactive',
      desc: 'Continuously monitors approved conditions, schedules maintenance, and prepares workspace drafts.',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          NOVA Intelligence &amp; Autonomous Core
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure wake words, initiative behavior, proactivity threshold, and task execution persistence.
        </p>
      </div>

      {/* Activation & Wake Word */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Acoustic Wake Word &amp; Activation
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Primary Wake Word
            </label>
            <input
              type="text"
              value={novaCore.wakeWord}
              onChange={(e) => updateNovaCore('wakeWord', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            />
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Activation Trigger
            </label>
            <select
              value={novaCore.activationBehavior}
              onChange={(e) => updateNovaCore('activationBehavior', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="both">Wake Word &amp; Hold Spacebar</option>
              <option value="push-to-talk">Push-to-Talk (Spacebar Only)</option>
              <option value="wake-word">Wake Word Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Proactivity Spectrum */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider opacity-70" style={{ color: theme.palette.accent }}>
            Proactivity &amp; Initiative Spectrum
          </span>
          <span className="text-xs font-mono capitalize" style={{ color: theme.palette.accent }}>
            {novaCore.proactivityLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {proactivityLevels.map((p) => {
            const isSelected = novaCore.proactivityLevel === p.level;
            return (
              <div
                key={p.level}
                onClick={() => updateNovaCore('proactivityLevel', p.level)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'ring-1 scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.palette.glassSurface : 'transparent',
                  borderColor: isSelected ? theme.palette.accent : theme.palette.glassBorder,
                  boxShadow: isSelected ? `0 8px 20px -5px ${theme.palette.glow}` : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                      {p.title}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isSelected ? theme.palette.accent : 'transparent' }}
                    />
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-60" style={{ color: theme.palette.textSecondary }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="p-3 rounded-xl border text-[11px] leading-relaxed opacity-75 font-sans"
          style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
        >
          <i className="fa-solid fa-shield-halved mr-1.5 opacity-60" style={{ color: theme.palette.accent }} />
          Even at higher proactivity tiers, NOVA will never perform sensitive actions (writing to remote repos, sending emails, or purchases) without explicit user authorization.
        </div>
      </div>

      {/* Response Characteristics */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Interaction Cadence &amp; Persistence
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Response Formulation Style
            </label>
            <select
              value={novaCore.responseStyle}
              onChange={(e) => updateNovaCore('responseStyle', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="concise">Concise (Immediate answers, zero fluff)</option>
              <option value="balanced">Balanced (Clear answers with key rationale)</option>
              <option value="comprehensive">Comprehensive (In-depth analysis)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Approval Policy for Autonomous Actions
            </label>
            <select
              value={novaCore.confirmationBehavior}
              onChange={(e) => updateNovaCore('confirmationBehavior', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="always">Always Ask Before Execution</option>
              <option value="sensitive-only">Confirm Only for Sensitive Operations</option>
              <option value="autonomous">Autonomous within Sandbox Policy</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Task Persistence Across Sessions
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Maintain long-running background research threads even if window is closed.
              </div>
            </div>
            <input
              type="checkbox"
              checked={novaCore.taskPersistence}
              onChange={(e) => updateNovaCore('taskPersistence', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Voice Interruption (Barge-in)
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Instantly pause speech playback when your voice is detected speaking over NOVA.
              </div>
            </div>
            <input
              type="checkbox"
              checked={novaCore.interruptionAllowed}
              onChange={(e) => updateNovaCore('interruptionAllowed', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
