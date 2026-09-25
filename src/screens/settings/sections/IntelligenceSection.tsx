import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const IntelligenceSection: React.FC = () => {
  const { intelligence, updateIntelligence } = useNovaSettings();
  const { theme } = useNova();

  const modelsList = [
    { id: 'deepseek', name: 'DeepSeek-R1 (Local 32B)', type: 'Local GPU', latency: '12ms', context: '64k', status: 'Active' },
    { id: 'gemini', name: 'Gemini 2.5 Flash', type: 'Cloud Enclave', latency: '180ms', context: '1M', status: 'Fallback' },
    { id: 'nova-edge', name: 'NOVA-Edge-8B (Q4)', type: 'Offline Air-gapped', latency: '6ms', context: '32k', status: 'Standby' },
    { id: 'claude', name: 'Claude 3.7 Sonnet', type: 'Cloud Router', latency: '420ms', context: '200k', status: 'Optional' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Model Architecture &amp; Reasoning Parameters
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure inference model routing, reasoning depth, answer verification policies, and context window allocation.
        </p>
      </div>

      {/* Model Selection & Router */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Model Routing Hierarchy
        </span>

        <div className="space-y-2.5">
          {modelsList.map((m) => {
            const isActive = intelligence.activeModel.includes(m.name.split(' ')[0]);
            return (
              <div
                key={m.id}
                onClick={() => updateIntelligence('activeModel', m.name)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isActive ? 'ring-1 scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                style={{
                  backgroundColor: isActive ? theme.palette.glassSurface : 'transparent',
                  borderColor: isActive ? theme.palette.accent : theme.palette.glassBorder,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs"
                    style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.accent }}
                  >
                    <i className="fa-solid fa-microchip" />
                  </div>
                  <div>
                    <div className="text-xs font-medium font-sans" style={{ color: theme.palette.textPrimary }}>
                      {m.name}
                    </div>
                    <div className="text-[10px] font-mono opacity-50" style={{ color: theme.palette.textSecondary }}>
                      {m.type} · {m.latency} latency · {m.context} window
                    </div>
                  </div>
                </div>

                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: isActive ? theme.palette.accent : theme.palette.bgElevated,
                    color: isActive ? (theme.isDark ? '#000' : '#fff') : theme.palette.textSecondary,
                    borderColor: theme.palette.glassBorder,
                  }}
                >
                  {isActive ? 'Primary Active' : m.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reasoning Depth & Context */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Cognitive Depth &amp; Clarification Behavior
        </span>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Reasoning Depth
              </span>
              <span className="font-mono text-xs font-semibold" style={{ color: theme.palette.accent }}>
                Tier {intelligence.reasoningDepth} / 5
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={intelligence.reasoningDepth}
              onChange={(e) => updateIntelligence('reasoningDepth', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
            <div className="flex justify-between text-[9px] font-mono opacity-50 mt-1" style={{ color: theme.palette.textMuted }}>
              <span>1 (Instant Reflex)</span>
              <span>3 (Standard Analysis)</span>
              <span>5 (Deep Mathematical Proof)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
                Uncertainty Handling Policy
              </label>
              <select
                value={intelligence.uncertaintyHandling}
                onChange={(e) => updateIntelligence('uncertaintyHandling', e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
              >
                <option value="clarify">Ask for Clarification (Recommended)</option>
                <option value="best-effort">Best-Effort Assumption with Stated Caveat</option>
                <option value="cautious">Strict Refusal without Explicit Evidence</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
                Allocated Context Window
              </label>
              <select
                value={intelligence.contextWindowTokens}
                onChange={(e) => updateIntelligence('contextWindowTokens', Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
                style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
              >
                <option value={32768}>32k Tokens (Fastest inference)</option>
                <option value={65536}>64k Tokens (Balanced engineering)</option>
                <option value={131072}>128k Tokens (Deep repo diffing)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
