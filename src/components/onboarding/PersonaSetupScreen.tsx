import React, { useState } from 'react';
import { useNovaAuth } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Zap, MessageSquare, Scale, Brain, ArrowRight, Check } from 'lucide-react';

interface ToneOption {
  id: 'concise' | 'conversational' | 'rigorous';
  title: string;
  subtitle: string;
  desc: string;
  samplePrompt: string;
  sampleResponse: string;
}

const TONE_OPTIONS: ToneOption[] = [
  {
    id: 'concise',
    title: 'Concise & Direct',
    subtitle: 'Zero fluff, fast execution',
    desc: 'Dense signal-to-noise ratio. Delivers commands, code diffs, and conclusions with minimal conversational framing.',
    samplePrompt: 'Can we optimize the IPC event loop latency?',
    sampleResponse: 'Switch from JSON serialization to FlatBuffers on Unix domain socket `/tmp/nova.sock`. Decreases serialization overhead by 73% (0.8ms -> 0.2ms). Patch staged.',
  },
  {
    id: 'conversational',
    title: 'Conversational & Adaptive',
    subtitle: 'Thought partner & dialogue',
    desc: 'Engaging, thoughtful collaborator. Explains intuitive tradeoffs, clarifies ambiguities, and iterates collaboratively.',
    samplePrompt: 'Can we optimize the IPC event loop latency?',
    sampleResponse: "Looking at your current telemetry, the main bottleneck is JSON marshalling across `/tmp/nova.sock`. If you'd like, we could switch to zero-copy FlatBuffers or Cap'n Proto. Would you prefer zero-copy or maintaining readable JSON in dev?",
  },
  {
    id: 'rigorous',
    title: 'Rigorous & Thorough',
    subtitle: 'Academic peer-review & edge cases',
    desc: 'Exhaustive verification. Analyzes boundary cases, invariant conditions, memory safety, and cites underlying principles.',
    samplePrompt: 'Can we optimize the IPC event loop latency?',
    sampleResponse: 'Benchmark analysis shows 0.82ms p99 IPC latency with 4.1% ring-buffer contention. Recommended remediation: (1) Replace JSON with FlatBuffers, (2) Pin IPC polling thread to Core 2, (3) Allocate 64KB shared memory ring. Verifying invariant thread safety before execution.',
  },
];

export const PersonaSetupScreen: React.FC = () => {
  const { currentUser, updateProfile, goToNextStep, goToPrevStep } = useNovaAuth();
  const { theme } = useNova();

  const [tone, setTone] = useState<'concise' | 'conversational' | 'rigorous'>(
    currentUser?.tone || 'concise'
  );
  const [reasoningEffort, setReasoningEffort] = useState<'standard' | 'deep'>(
    currentUser?.reasoningEffort || 'deep'
  );

  const activeToneConfig = TONE_OPTIONS.find((t) => t.id === tone) || TONE_OPTIONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      tone,
      reasoningEffort,
    });
    goToNextStep();
  };

  return (
    <div className="max-w-2xl mx-auto py-1">
      {/* Header & step back */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevStep}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Identity
        </button>
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          Step 2 of 3 · Communication Persona
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Calibrate NOVA's interaction cadence
        </h2>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.palette.textSecondary }}>
          Choose how NOVA structures answers, reasons through uncertainty, and interacts during autonomous trajectories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tone Options */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
            Interaction & Communication Style
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TONE_OPTIONS.map((opt) => {
              const isSelected = tone === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setTone(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'shadow-lg border-sky-400/50 bg-sky-500/10'
                      : 'hover:border-white/20 bg-black/20'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.palette.accentBorder : theme.palette.glassBorder,
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                        {opt.title}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <div className="text-[10px] font-mono text-sky-400/80 mb-2">
                      {opt.subtitle}
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: theme.palette.textSecondary }}>
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Interactive Simulation Preview */}
        <div
          className="p-4 rounded-2xl border backdrop-blur-md space-y-2.5"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Live Preview · How NOVA responds to {currentUser?.callingName || 'you'}
            </span>
            <span className="text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              {activeToneConfig.title}
            </span>
          </div>

          <div
            className="p-3 rounded-xl border text-xs space-y-1.5 font-mono"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
            }}
          >
            <div className="text-slate-400 text-[11px]">
              &gt; {activeToneConfig.samplePrompt}
            </div>
            <div className="text-white text-[11px] leading-relaxed pt-1 border-t border-white/5 font-sans">
              <span className="text-sky-400 font-semibold font-mono text-[10px] mr-1.5">NOVA:</span>
              {activeToneConfig.sampleResponse}
            </div>
          </div>
        </div>

        {/* Reasoning Effort Selector */}
        <div
          className="p-4 rounded-2xl border backdrop-blur-md space-y-3"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                  Latent Reasoning & Trajectory Depth
                </div>
                <div className="text-[10px]" style={{ color: theme.palette.textMuted }}>
                  How much internal deliberation NOVA performs prior to execution.
                </div>
              </div>
            </div>

            <div
              className="p-1 rounded-xl border flex items-center gap-1 text-xs"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
              }}
            >
              <button
                type="button"
                onClick={() => setReasoningEffort('standard')}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                  reasoningEffort === 'standard' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setReasoningEffort('deep')}
                className={`px-3 py-1 rounded-lg text-xs transition-all cursor-pointer font-medium ${
                  reasoningEffort === 'deep' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deep Deliberation
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="h-11 px-6 rounded-xl font-medium text-xs flex items-center gap-2 transition-all hover:opacity-95 shadow-md cursor-pointer"
            style={{
              backgroundColor: theme.palette.accent,
              color: theme.palette.bgBase,
            }}
          >
            <span>Continue to System Permissions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
