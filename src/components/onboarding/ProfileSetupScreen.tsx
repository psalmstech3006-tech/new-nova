import React, { useState } from 'react';
import { useNovaAuth } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Code2, Microscope, Compass, PenTool, Sparkles, ArrowRight, User } from 'lucide-react';

interface DomainOption {
  id: string;
  category: 'engineering' | 'research' | 'strategy' | 'creative' | 'general';
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  sampleTask: string;
}

const DOMAIN_OPTIONS: DomainOption[] = [
  {
    id: 'engineering',
    category: 'engineering',
    title: 'Systems & Software Engineering',
    desc: 'Architecting distributed systems, compiler pipelines, refactoring, and sandbox debugging.',
    icon: Code2,
    sampleTask: 'Analyze memory leak in Rust IPC socket',
  },
  {
    id: 'research',
    category: 'research',
    title: 'Scientific Research & Synthesis',
    desc: 'ArXiv literature synthesis, empirical hypothesis testing, and dense cross-paper citation graphs.',
    icon: Microscope,
    sampleTask: 'Synthesize recent findings on state-space attention mechanisms',
  },
  {
    id: 'strategy',
    category: 'strategy',
    title: 'Executive Strategy & Operations',
    desc: 'High-level synthesis, cross-team decision memos, trajectory prioritization, and workflow cadence.',
    icon: Compass,
    sampleTask: 'Draft quarterly roadmap trade-off brief',
  },
  {
    id: 'creative',
    category: 'creative',
    title: 'Creative Writing & Product Design',
    desc: 'Editorial precision, UX taxonomy, narrative shaping, and spatial design critique.',
    icon: PenTool,
    sampleTask: 'Refine microcopy for ambient onboarding',
  },
];

export const ProfileSetupScreen: React.FC = () => {
  const { currentUser, updateProfile, goToNextStep, goToPrevStep } = useNovaAuth();
  const { theme } = useNova();

  const [displayName, setDisplayName] = useState(currentUser?.name || 'Julian Thorne');
  const [callingName, setCallingName] = useState(currentUser?.callingName || 'Julian');
  const [pronunciation, setPronunciation] = useState(currentUser?.pronunciation || '');
  const [selectedDomain, setSelectedDomain] = useState<string>(
    currentUser?.roleCategory || 'engineering'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = DOMAIN_OPTIONS.find((d) => d.id === selectedDomain);
    updateProfile({
      name: displayName,
      callingName: callingName || displayName.split(' ')[0],
      pronunciation,
      role: chosen?.title || 'Autonomous Systems User',
      roleCategory: (chosen?.category as any) || 'engineering',
    });
    goToNextStep();
  };

  return (
    <div className="max-w-2xl mx-auto py-1">
      {/* Step navigation & kicker */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevStep}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Auth
        </button>
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
          Step 1 of 3 · Identity & Domain
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Personalize your NOVA partnership
        </h2>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.palette.textSecondary }}>
          Teach NOVA how to address you naturally and align its latent cognitive reasoning with your core domain.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Calling Name & Display Name Section */}
        <div
          className="p-5 rounded-2xl border backdrop-blur-xl space-y-4"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
            <User className="w-4 h-4 text-sky-400" />
            <span>Identity & Acoustic Pronunciation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Julian Thorne"
                className="w-full h-10 px-3 rounded-xl border text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: theme.palette.bgElevated,
                  borderColor: theme.palette.glassBorder,
                  color: theme.palette.textPrimary,
                }}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                How should NOVA address you?
              </label>
              <input
                type="text"
                value={callingName}
                onChange={(e) => setCallingName(e.target.value)}
                placeholder="Julian or Dr. Thorne"
                className="w-full h-10 px-3 rounded-xl border text-xs focus:outline-none transition-colors"
                style={{
                  backgroundColor: theme.palette.bgElevated,
                  borderColor: theme.palette.glassBorder,
                  color: theme.palette.textPrimary,
                }}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Acoustic pronunciation guide (optional, for spoken responses)
            </label>
            <input
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder="e.g. 'Joo-lee-an' or 'El-eh-nah'"
              className="w-full h-9 px-3 rounded-xl border text-xs focus:outline-none transition-colors font-mono"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            />
          </div>
        </div>

        {/* Primary Domain Specialization */}
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: theme.palette.textPrimary }}>
            Select Primary Focus Domain
          </label>
          <p className="text-[11px] text-slate-400 mb-3">
            Pre-conditions NOVA's default synaptic priors and tools for your typical workload.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DOMAIN_OPTIONS.map((opt) => {
              const isSelected = selectedDomain === opt.id;
              const Icon = opt.icon;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedDomain(opt.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'shadow-lg border-sky-400/50 bg-sky-500/10'
                      : 'hover:border-white/20 bg-black/20'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.palette.accentBorder : theme.palette.glassBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center border"
                        style={{
                          backgroundColor: `${theme.palette.accent}15`,
                          borderColor: theme.palette.glassBorder,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: theme.palette.accent }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                        {opt.title}
                      </span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-sky-400 bg-sky-500' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed mb-2" style={{ color: theme.palette.textSecondary }}>
                    {opt.desc}
                  </p>

                  <div className="text-[10px] font-mono opacity-70 flex items-center gap-1.5" style={{ color: theme.palette.textMuted }}>
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>e.g. "{opt.sampleTask}"</span>
                  </div>
                </div>
              );
            })}
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
            <span>Continue to Interaction Persona</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
