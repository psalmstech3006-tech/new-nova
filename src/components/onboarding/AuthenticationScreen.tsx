import React, { useState } from 'react';
import { useNovaAuth, PRESET_ACCOUNTS } from '../../context/NovaAuthContext';
import { useNova } from '../../context/NovaStateContext';
import { Fingerprint, Mail, KeyRound, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthenticationScreen: React.FC = () => {
  const {
    signInWithProvider,
    signUpWithEmail,
    isAuthenticating,
    authError,
    setStep,
    goToPrevStep,
  } = useNovaAuth();
  const { theme } = useNova();

  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [authMethod, setAuthMethod] = useState<'passkey' | 'email'>('passkey');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [passkeyStatus, setPasskeyStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handlePasskeyAuth = async () => {
    setPasskeyStatus('scanning');
    try {
      await signInWithProvider('passkey');
      setPasskeyStatus('success');
    } catch {
      setPasskeyStatus('idle');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === 'sign-up') {
      await signUpWithEmail(fullName || email.split('@')[0], email, password);
    } else {
      await signInWithProvider('email', email, password);
    }
  };

  return (
    <div className="max-w-md mx-auto py-2">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevStep}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Back to Welcome
        </button>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div
          className="p-1 rounded-xl border flex items-center gap-1 text-xs"
          style={{
            backgroundColor: `${theme.palette.bgElevated}cc`,
            borderColor: theme.palette.glassBorder,
          }}
        >
          <button
            onClick={() => setMode('sign-in')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
              mode === 'sign-in' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('sign-up')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-medium ${
              mode === 'sign-up' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
          {mode === 'sign-in' ? 'Authenticate with NOVA' : 'Initialize Workspace Profile'}
        </h2>
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: theme.palette.textSecondary }}>
          {mode === 'sign-in'
            ? 'Sign in to access your local enclave, cryptographic vaults, and custom trajectories.'
            : 'Establish a new local profile and secure your cryptographic memory graph.'}
        </p>
      </div>

      {/* Primary Passkey / Biometrics Card */}
      <div
        className="p-5 rounded-2xl border backdrop-blur-xl mb-5 relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: `${theme.palette.accent}15`,
                borderColor: theme.palette.accentBorder,
              }}
            >
              <Fingerprint className="w-4 h-4" style={{ color: theme.palette.accent }} />
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                Passkey & Touch ID / Windows Hello
              </div>
              <div className="text-[10px]" style={{ color: theme.palette.textMuted }}>
                FIDO2 / Hardware Security Enclave
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            RECOMMENDED
          </span>
        </div>

        <button
          onClick={handlePasskeyAuth}
          disabled={isAuthenticating || passkeyStatus === 'scanning'}
          className="w-full h-11 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer group"
          style={{
            backgroundColor: passkeyStatus === 'scanning' ? `${theme.palette.accent}25` : theme.palette.bgElevated,
            borderColor: theme.palette.glassHighlight,
            color: theme.palette.textPrimary,
          }}
        >
          {passkeyStatus === 'scanning' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
              <span>Verifying Biometric Sensor...</span>
            </>
          ) : passkeyStatus === 'success' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Enclave Verified</span>
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 opacity-75 group-hover:opacity-100 transition-opacity" />
              <span>Continue with Passkey / Device Biometrics</span>
            </>
          )}
        </button>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
          Or continue with credentials
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-3">
        {mode === 'sign-up' && (
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Julian Thorne"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textPrimary,
              }}
              required={mode === 'sign-up'}
            />
          </div>
        )}

        <div>
          <label className="block text-[11px] font-medium text-slate-300 mb-1">
            Work or Personal Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="operator@omniel.internal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 pl-9 pr-3.5 rounded-xl border text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textPrimary,
              }}
              required
            />
            <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-slate-300">
              Password or Enclave Secret
            </label>
            {mode === 'sign-in' && (
              <button
                type="button"
                onClick={() => setEmail('j.thorne@omniel.internal')}
                className="text-[10px] text-slate-400 hover:text-sky-300 transition-colors"
              >
                Use Magic Link
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 pl-9 pr-3.5 rounded-xl border text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: theme.palette.bgElevated,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.textPrimary,
              }}
            />
            <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          </div>
        </div>

        {/* Remember device checkbox */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 text-[11px]">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="rounded accent-sky-500 w-3.5 h-3.5"
            />
            <span>Remember this desktop machine</span>
          </label>
        </div>

        {authError && (
          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isAuthenticating}
          className="w-full h-11 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all hover:opacity-95 shadow-md cursor-pointer mt-2"
          style={{
            backgroundColor: theme.palette.accent,
            color: theme.palette.bgBase,
          }}
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>{mode === 'sign-in' ? 'Sign In' : 'Create Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Enterprise & Developer Single Sign-On */}
      <div className="mt-6 pt-5 border-t border-white/5 space-y-2">
        <div className="text-[10px] font-mono text-center text-slate-500 uppercase tracking-wider mb-2">
          Enterprise & Developer SSO
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => signInWithProvider('google')}
            className="h-9 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
          >
            <i className="fa-brands fa-google text-xs text-red-400" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => signInWithProvider('github')}
            className="h-9 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
          >
            <i className="fa-brands fa-github text-xs" />
            <span>GitHub</span>
          </button>

          <button
            type="button"
            onClick={() => signInWithProvider('omni-sso')}
            className="h-9 px-2 rounded-lg border text-[11px] flex items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer"
            style={{
              backgroundColor: theme.palette.bgElevated,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textSecondary,
            }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OMNI SSO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
