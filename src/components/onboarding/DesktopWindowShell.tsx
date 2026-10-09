import React from 'react';
import { useNovaAuth } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { OnboardingStep } from '../../types/auth';

interface DesktopWindowShellProps {
  children: React.ReactNode;
  title?: string;
  stepNumber?: number;
  totalSteps?: number;
}

export const DesktopWindowShell: React.FC<DesktopWindowShellProps> = ({
  children,
  title = 'NOVA Desktop — Secure Enclave',
  stepNumber,
  totalSteps = 5,
}) => {
  const { currentStep, setStep, quickLaunchAsGuest, resetAllSession, currentUser } = useNovaAuth();
  const { theme } = useNova();

  const stepLabels: { step: OnboardingStep; label: string }[] = [
    { step: 'welcome', label: 'Welcome' },
    { step: 'auth', label: 'Auth' },
    { step: 'profile', label: 'Identity' },
    { step: 'persona', label: 'Persona' },
    { step: 'permissions', label: 'System' },
    { step: 'calibrating', label: 'Launch' },
    { step: 'returning-unlock', label: 'Lockscreen' },
  ];

  return (
    <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-6 md:py-10 flex flex-col items-center">
      {/* Outer Window Container with Apple/Windows Desktop styling */}
      <div
        className="w-full rounded-2xl md:rounded-3xl border shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col transition-all duration-500 relative"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 35px 80px -15px rgba(0,0,0,0.7), 0 0 1px 1px ${theme.palette.glassHighlight}, inset 0 1px 1px 0 ${theme.palette.specularRim}`,
        }}
      >
        {/* Native-style Window Title Bar */}
        <div
          className="h-11 px-5 flex items-center justify-between border-b select-none transition-colors duration-300"
          style={{
            borderColor: theme.palette.glassBorder,
            backgroundColor: `${theme.palette.bgElevated}99`,
          }}
        >
          {/* Left: Window Traffic Lights */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => resetAllSession()}
              className="w-3 h-3 rounded-full bg-[#ff5f56]/80 hover:bg-[#ff5f56] border border-[#e0443e]/40 transition-colors"
              title="Reset Setup"
            />
            <button
              onClick={() => quickLaunchAsGuest()}
              className="w-3 h-3 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] border border-[#dea123]/40 transition-colors"
              title="Launch Guest Session"
            />
            <button
              onClick={() => setStep('welcome')}
              className="w-3 h-3 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] border border-[#1aab29]/40 transition-colors"
              title="Return to Welcome"
            />
            <span className="text-[11px] font-mono text-slate-500/80 ml-2 hidden sm:inline">
              OMNIEL / NOVA v4.2
            </span>
          </div>

          {/* Center: Window Title & Step Indicator */}
          <div className="flex items-center space-x-2 text-xs font-medium">
            <span className="tracking-wide" style={{ color: theme.palette.textSecondary }}>
              {title}
            </span>
            {stepNumber && (
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${theme.palette.accent}14`,
                  borderColor: theme.palette.accentBorder,
                  color: theme.palette.accent,
                }}
              >
                {stepNumber} / {totalSteps}
              </span>
            )}
          </div>

          {/* Right: Enclave Status Indicator */}
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <div className="flex items-center space-x-1.5" style={{ color: theme.palette.textMuted }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">ENCLAVE SECURE</span>
            </div>
            {currentUser && (
              <span
                className="hidden md:inline px-2 py-0.5 rounded text-[10px] border"
                style={{
                  borderColor: theme.palette.glassBorder,
                  backgroundColor: theme.palette.bgElevated,
                  color: theme.palette.textSecondary,
                }}
              >
                {currentUser.name}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 flex-1 relative overflow-y-auto max-h-[calc(85vh-90px)] custom-scrollbar">
          {children}
        </div>

        {/* Quick Step Navigation & Evaluator Switcher Bar */}
        <div
          className="px-5 py-2.5 border-t flex flex-wrap items-center justify-between text-[11px] gap-2 select-none"
          style={{
            borderColor: theme.palette.glassBorder,
            backgroundColor: `${theme.palette.bgBase}88`,
          }}
        >
          <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
            <span className="text-[10px] font-mono mr-1.5 text-slate-500">STAGE:</span>
            {stepLabels.map((s) => {
              const isActive = currentStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setStep(s.step)}
                  className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'border shadow-sm'
                      : 'opacity-50 hover:opacity-100 hover:bg-white/5'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${theme.palette.accent}20` : 'transparent',
                    borderColor: isActive ? theme.palette.accentBorder : 'transparent',
                    color: isActive ? theme.palette.accent : theme.palette.textSecondary,
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-500">
            <button
              onClick={() => quickLaunchAsGuest()}
              className="hover:text-slate-300 transition-colors underline cursor-pointer"
            >
              Skip to Workspace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
