import React, { useState, useEffect } from 'react';
import { useNovaAuth } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Sparkles, CheckCircle2, ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react';

interface CalibrationStep {
  id: string;
  label: string;
  sub: string;
  durationMs: number;
}

const STEPS: CalibrationStep[] = [
  {
    id: 'voice',
    label: 'Acoustic Substrate Frequency Alignment',
    sub: 'Tuning 3D volumetric particle harmonics and microphone noise floor...',
    durationMs: 700,
  },
  {
    id: 'persona',
    label: 'Persona & Latent Prior Synthesis',
    sub: 'Compiling prompt tokens, tone constraints, and role instructions...',
    durationMs: 800,
  },
  {
    id: 'vault',
    label: 'Cryptographic Synaptic Enclave',
    sub: 'Allocating AES-256 vector partition and initializing local memory nodes...',
    durationMs: 650,
  },
  {
    id: 'sandbox',
    label: 'Strict L3 Execution Sandbox',
    sub: 'Verifying process isolation and kernel IPC socket pipes...',
    durationMs: 600,
  },
];

export const CalibrationTransitionScreen: React.FC = () => {
  const { currentUser, completeOnboarding } = useNovaAuth();
  const { theme, addToast } = useNova();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    let currentIdx = 0;
    const runNext = () => {
      if (currentIdx < STEPS.length) {
        const step = STEPS[currentIdx];
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step.id]);
          currentIdx++;
          setActiveStepIndex(currentIdx);
          runNext();
        }, step.durationMs);
      } else {
        setIsReady(true);
      }
    };
    runNext();
  }, []);

  const handleEnterWorkspace = () => {
    completeOnboarding();
    const name = currentUser?.callingName || currentUser?.name || 'Operator';
    addToast(
      `Welcome to NOVA, ${name}`,
      `Substrate initialized with ${currentUser?.tone || 'concise'} communication cadence.`,
      'success'
    );
  };

  const progressPercent = Math.min(100, Math.round((completedSteps.length / STEPS.length) * 100));

  return (
    <div className="max-w-xl mx-auto py-4 text-center">
      {/* Visual glowing particle orb badge */}
      <div className="relative inline-block mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-2xl relative"
          style={{
            backgroundColor: `${theme.palette.bgElevated}ee`,
            borderColor: theme.palette.glassHighlight,
            boxShadow: `0 15px 35px -5px ${theme.palette.ambientShadow}`,
          }}
        >
          {isReady ? (
            <ShieldCheck className="w-8 h-8 text-emerald-400 animate-bounce" />
          ) : (
            <Sparkles className="w-7 h-7 text-sky-400 animate-pulse" />
          )}
        </div>

        {/* Ambient aura */}
        <div
          className="absolute -inset-3 rounded-full blur-xl opacity-30 pointer-events-none"
          style={{ backgroundColor: isReady ? '#10b981' : theme.palette.accent }}
        />
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
          {isReady ? 'Substrate Calibration Complete' : 'Synthesizing Workspace Enclave'}
        </h2>
        <p className="text-xs max-w-md mx-auto" style={{ color: theme.palette.textSecondary }}>
          {isReady
            ? `NOVA is fully initialized for ${currentUser?.name || 'you'}. Ready to launch into the autonomous workspace.`
            : `Harmonizing acoustic neural weights and domain configurations for ${currentUser?.callingName || 'you'}...`}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="flex justify-between text-[11px] font-mono mb-1.5" style={{ color: theme.palette.textMuted }}>
          <span>CALIBRATION PROGRESS</span>
          <span className="text-white font-medium">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist of steps */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl mb-6 text-left space-y-3"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
        }}
      >
        {STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isCurrent = activeStepIndex === idx && !isDone;

          return (
            <div key={step.id} className="flex items-start gap-3 text-xs">
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-600">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div
                  className={`font-medium ${
                    isDone ? 'text-white' : isCurrent ? 'text-sky-300' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{step.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enter NOVA Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleEnterWorkspace}
          className="h-12 px-8 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-xl cursor-pointer group"
          style={{
            backgroundColor: isReady ? '#10b981' : theme.palette.accent,
            color: isReady ? '#ffffff' : theme.palette.bgBase,
          }}
        >
          <Zap className="w-4 h-4" />
          <span>Launch NOVA Workspace</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
