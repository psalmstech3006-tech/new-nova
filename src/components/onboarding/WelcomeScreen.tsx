import React from 'react';
import { useNovaAuth, PRESET_ACCOUNTS } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Sparkles, Shield, Cpu, Mic, ArrowRight, UserCheck, Terminal } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { setStep, selectPresetAccount, quickLaunchAsGuest } = useNovaAuth();
  const { theme } = useNova();

  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-2">
      {/* Brand Holographic Nucleus */}
      <div className="relative mb-6 group cursor-pointer" onClick={() => setStep('auth')}>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center border shadow-2xl relative transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundColor: `${theme.palette.bgElevated}cc`,
            borderColor: theme.palette.glassHighlight,
            boxShadow: `0 15px 35px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.specularRim}`,
          }}
        >
          {/* Animated subtle particle rings */}
          <div
            className="absolute inset-0 rounded-2xl border opacity-40 animate-pulse pointer-events-none"
            style={{ borderColor: theme.palette.accent }}
          />
          <div
            className="w-8 h-8 rounded-full blur-[1px] flex items-center justify-center"
            style={{ backgroundColor: `${theme.palette.accent}20` }}
          >
            <Sparkles className="w-6 h-6 transition-all" style={{ color: theme.palette.accent }} />
          </div>
        </div>

        {/* Ambient glow behind logo */}
        <div
          className="absolute -inset-4 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ backgroundColor: theme.palette.accent }}
        />
      </div>

      {/* Hero Typography */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono"
          style={{
            backgroundColor: `${theme.palette.bgElevated}aa`,
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textSecondary,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>OMNIEL COMPUTATIONAL SUBSTRATE · v4.2</span>
        </div>

        <h1
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
          style={{ color: theme.palette.textPrimary }}
        >
          Intelligence, native to your desktop.
        </h1>

        <p
          className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
          style={{ color: theme.palette.textSecondary }}
        >
          NOVA is a quiet, autonomous AI assistant that thinks, listens, and executes complex trajectories alongside you—anchored in local privacy.
        </p>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8 text-left">
        <div
          className="p-4 rounded-2xl border backdrop-blur-md transition-all hover:translate-y-[-2px]"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <Shield className="w-4 h-4 mb-2.5 opacity-80" style={{ color: theme.palette.accent }} />
          <h3 className="text-xs font-semibold mb-1" style={{ color: theme.palette.textPrimary }}>
            Zero-Knowledge Enclave
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: theme.palette.textMuted }}>
            All synaptic memory vectors and code telemetry remain quarantined on your physical machine.
          </p>
        </div>

        <div
          className="p-4 rounded-2xl border backdrop-blur-md transition-all hover:translate-y-[-2px]"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <Mic className="w-4 h-4 mb-2.5 opacity-80" style={{ color: theme.palette.accent }} />
          <h3 className="text-xs font-semibold mb-1" style={{ color: theme.palette.textPrimary }}>
            Acoustic Particle Presence
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: theme.palette.textMuted }}>
            Real-time low-latency voice with continuous frequency sensing and 3D volumetric feedback.
          </p>
        </div>

        <div
          className="p-4 rounded-2xl border backdrop-blur-md transition-all hover:translate-y-[-2px]"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <Cpu className="w-4 h-4 mb-2.5 opacity-80" style={{ color: theme.palette.accent }} />
          <h3 className="text-xs font-semibold mb-1" style={{ color: theme.palette.textPrimary }}>
            Autonomous Trajectories
          </h3>
          <p className="text-[11px] leading-relaxed" style={{ color: theme.palette.textMuted }}>
            Deep research, multi-file code synthesis, and OS orchestration with deterministic checkpoints.
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-6">
        <button
          onClick={() => setStep('auth')}
          className="w-full sm:w-auto flex-1 h-11 px-6 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-lg cursor-pointer group"
          style={{
            backgroundColor: theme.palette.accent,
            color: theme.palette.bgBase,
          }}
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={() => setStep('auth')}
          className="w-full sm:w-auto flex-1 h-11 px-5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all hover:bg-white/5 cursor-pointer"
          style={{
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textPrimary,
            backgroundColor: theme.palette.glassSurface,
          }}
        >
          <UserCheck className="w-4 h-4 opacity-70" />
          <span>I have an account</span>
        </button>
      </div>

      {/* Guest Mode & Fast Preset Account Selector for Evaluators */}
      <div className="w-full pt-4 border-t border-white/5 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-xs" style={{ color: theme.palette.textMuted }}>
          <Terminal className="w-3.5 h-3.5" />
          <span>Or test with an existing profile:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESET_ACCOUNTS.map((account) => (
            <button
              key={account.id}
              onClick={() => selectPresetAccount(account)}
              className="px-3 py-1.5 rounded-lg border text-xs flex items-center gap-2 transition-all hover:border-white/30 cursor-pointer"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textSecondary,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: account.avatarColor }}
              />
              <span className="font-medium text-white">{account.name}</span>
              <span className="text-[10px] opacity-60">({account.callingName})</span>
            </button>
          ))}

          <button
            onClick={() => quickLaunchAsGuest()}
            className="px-3 py-1.5 rounded-lg border text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            style={{
              backgroundColor: 'transparent',
              borderColor: theme.palette.glassBorder,
            }}
          >
            Offline Guest →
          </button>
        </div>
      </div>
    </div>
  );
};
