import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const PersonalitySection: React.FC = () => {
  const { personality, updatePersonality } = useNovaSettings();
  const { theme, addToast } = useNova();

  const applyPreset = (name: string, p: Partial<typeof personality>) => {
    Object.entries(p).forEach(([k, v]) => updatePersonality(k, v));
    addToast('Personality Preset Applied', `Loaded "${name}" configuration.`, 'success');
  };

  const sliders = [
    { key: 'formality', left: 'Formal / Academic', right: 'Casual / Friendly', value: personality.formality },
    { key: 'conciseness', left: 'Concise / Bulleted', right: 'Comprehensive / Detailed', value: personality.conciseness },
    { key: 'playfulness', left: 'Serious / Analytical', right: 'Playful / Witty', value: personality.playfulness },
    { key: 'proactivity', left: 'Passive / On-Demand', right: 'Proactive / Anticipatory', value: personality.proactivity },
    { key: 'conversationality', left: 'Direct / Code-First', right: 'Conversational / Explanatory', value: personality.conversationality },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Personality Matrix &amp; Communication Dynamics
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Tune NOVA&apos;s tone of voice, conciseness, humor parameters, and specify custom communication directives.
        </p>
      </div>

      {/* Quick Presets */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between"
        style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
      >
        <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
          Personality Presets
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => applyPreset('TARS Minimalist', { formality: 20, conciseness: 90, playfulness: 30, proactivity: 75, conversationality: 20 })}
            className="px-2.5 py-1 rounded-xl border text-[11px] font-mono hover:opacity-100 transition-opacity cursor-pointer"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            TARS Minimalist
          </button>
          <button
            onClick={() => applyPreset('JARVIS Executive', { formality: 60, conciseness: 60, playfulness: 20, proactivity: 80, conversationality: 50 })}
            className="px-2.5 py-1 rounded-xl border text-[11px] font-mono hover:opacity-100 transition-opacity cursor-pointer"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            JARVIS Executive
          </button>
          <button
            onClick={() => applyPreset('Deep Focus Sprint', { formality: 10, conciseness: 100, playfulness: 0, proactivity: 40, conversationality: 10 })}
            className="px-2.5 py-1 rounded-xl border text-[11px] font-mono hover:opacity-100 transition-opacity cursor-pointer"
            style={{ backgroundColor: theme.palette.bgElevated, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            Deep Focus
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div
        className="p-5 rounded-2xl border space-y-5"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Interaction Spectrum Sliders
        </span>

        <div className="space-y-4">
          {sliders.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between text-xs font-sans mb-1.5" style={{ color: theme.palette.textSecondary }}>
                <span>{s.left}</span>
                <span className="font-mono text-xs font-medium" style={{ color: theme.palette.accent }}>
                  {s.value}%
                </span>
                <span>{s.right}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={s.value}
                onChange={(e) => updatePersonality(s.key, Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Personality Directive */}
      <div
        className="p-5 rounded-2xl border space-y-3"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Custom Instructions &amp; Stylistic Rules
        </span>
        <textarea
          rows={3}
          value={personality.customInstructions}
          onChange={(e) => updatePersonality('customInstructions', e.target.value)}
          placeholder="e.g. Always format code using Rust idioms. Avoid greeting phrases. Summarize diffs before presenting..."
          className="w-full text-xs p-3 rounded-xl border bg-transparent outline-none font-sans leading-relaxed"
          style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
        />
        <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textMuted }}>
          These directives are injected at the start of every cognitive prompt window.
        </div>
      </div>
    </div>
  );
};
