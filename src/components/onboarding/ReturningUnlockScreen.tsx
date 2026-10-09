import React, { useState } from 'react';
import { useNovaAuth, PRESET_ACCOUNTS } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Fingerprint, Lock, Unlock, LogOut, RotateCcw, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export const ReturningUnlockScreen: React.FC = () => {
  const {
    currentUser,
    unlockSession,
    signOut,
    relaunchOnboarding,
    selectPresetAccount,
    isAuthenticating,
  } = useNovaAuth();
  const { theme } = useNova();

  const [pin, setPin] = useState('');
  const [restoreWorkspace, setRestoreWorkspace] = useState(true);
  const [unlockStatus, setUnlockStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const profile = currentUser || PRESET_ACCOUNTS[0];

  const handleBiometricUnlock = async () => {
    setUnlockStatus('scanning');
    try {
      await unlockSession('biometric');
      setUnlockStatus('success');
    } catch {
      setUnlockStatus('idle');
    }
  };

  const handlePinUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockStatus('scanning');
    await unlockSession('pin');
    setUnlockStatus('success');
  };

  return (
    <div className="max-w-md mx-auto py-4 text-center">
      {/* User Avatar with subtle ambient pulse */}
      <div className="relative inline-block mb-4">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-semibold border shadow-xl relative"
          style={{
            backgroundColor: `${theme.palette.bgElevated}`,
            borderColor: theme.palette.glassHighlight,
            color: profile.avatarColor,
            boxShadow: `0 15px 35px -5px ${theme.palette.ambientShadow}`,
          }}
        >
          {profile.avatarInitials}

          {/* Secure padlock indicator */}
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border flex items-center justify-center text-slate-400"
            style={{ borderColor: theme.palette.glassBorder }}
          >
            <Lock className="w-3 h-3" />
          </div>
        </div>

        {/* Halo glow */}
        <div
          className="absolute -inset-2 rounded-2xl blur-xl opacity-20 pointer-events-none"
          style={{ backgroundColor: profile.avatarColor }}
        />
      </div>

      {/* User Greeting */}
      <div className="space-y-1 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Welcome back, {profile.name}
        </h2>
        <div className="text-xs flex items-center justify-center gap-2" style={{ color: theme.palette.textMuted }}>
          <span>{profile.role}</span>
          <span>·</span>
          <span className="font-mono text-[11px]">{profile.email}</span>
        </div>
      </div>

      {/* Quick Biometric Unlock Card */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl mb-5 text-left relative overflow-hidden"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
        }}
      >
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-medium" style={{ color: theme.palette.textSecondary }}>
            Fast Desktop Unlock
          </span>
          <span className="text-[10px] font-mono text-emerald-400">TOUCH ID / PASSKEY</span>
        </div>

        <button
          onClick={handleBiometricUnlock}
          disabled={isAuthenticating || unlockStatus === 'scanning'}
          className="w-full h-11 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer group"
          style={{
            backgroundColor: unlockStatus === 'scanning' ? `${theme.palette.accent}20` : theme.palette.bgElevated,
            borderColor: theme.palette.glassHighlight,
            color: theme.palette.textPrimary,
          }}
        >
          {unlockStatus === 'scanning' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Matching biometric token...</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Unlock with Touch ID / Windows Hello</span>
            </>
          )}
        </button>
      </div>

      {/* PIN / Password Form */}
      <form onSubmit={handlePinUnlock} className="space-y-3 mb-5">
        <div className="flex gap-2">
          <input
            type="password"
            placeholder="Or enter enclave PIN / secret"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="flex-1 h-10 px-3.5 rounded-xl border text-xs focus:outline-none transition-colors"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          />
          <button
            type="submit"
            disabled={isAuthenticating}
            className="h-10 px-4 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition-all hover:bg-white/10 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          >
            <span>Unlock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <label className="flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={restoreWorkspace}
            onChange={(e) => setRestoreWorkspace(e.target.checked)}
            className="rounded accent-sky-500 w-3.5 h-3.5"
          />
          <span className="text-[11px]">Restore active trajectories and synaptic graph tabs</span>
        </label>
      </form>

      {/* Footer Actions: Switch User & Relaunch Onboarding */}
      <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs gap-2">
        <button
          onClick={relaunchOnboarding}
          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Relaunch Setup Wizard</span>
        </button>

        <button
          onClick={signOut}
          className="text-[11px] text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Switch Account / Sign Out</span>
        </button>
      </div>

      {/* Switch profile fast row */}
      <div className="mt-4 pt-3 flex items-center justify-center gap-2 text-[10px] text-slate-500">
        <span>Switch to:</span>
        {PRESET_ACCOUNTS.filter((p) => p.id !== profile.id).map((acc) => (
          <button
            key={acc.id}
            onClick={() => selectPresetAccount(acc)}
            className="underline hover:text-slate-300 cursor-pointer"
          >
            {acc.callingName}
          </button>
        ))}
      </div>
    </div>
  );
};
