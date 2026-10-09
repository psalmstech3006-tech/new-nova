import React, { useEffect } from 'react';
import { NovaAuthProvider, useNovaAuth } from './context/NovaAuthContext';
import { NovaStateProvider, useNova } from './context/NovaStateContext';
import { NovaSettingsProvider } from './context/NovaSettingsContext';
import { TopHud } from './components/TopHud';
import { NavRail } from './components/NavRail';
import { VoicePill } from './components/VoicePill';
import { CommandPalette } from './components/CommandPalette';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { NotificationToasts } from './components/NotificationToasts';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { PresenceScreen } from './screens/PresenceScreen';
import { SettingsScreen } from './screens/settings/SettingsScreen';
import { SynapticMapScreen } from './screens/SynapticMapScreen';

function AppContent() {
  const {
    currentScreen,
    setCurrentScreen,
    theme,
    monospaceKern,
    startListening,
    stopListening,
    setCommandPaletteOpen,
  } = useNova();

  const {
    isOnboardingComplete,
    isAuthenticated,
    isSessionLocked,
  } = useNovaAuth();

  const showOnboarding = !isOnboardingComplete || !isAuthenticated || isSessionLocked;

  // Global Keyboard navigation & push-to-talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (e.key === '1') {
        setCurrentScreen('substrate');
      } else if (e.key === '2') {
        setCurrentScreen('synaptic');
      } else if (e.key === '3' || ((e.metaKey || e.ctrlKey) && e.key === ',')) {
        e.preventDefault();
        setCurrentScreen('runtime');
      } else if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.code === 'Space') {
        e.preventDefault();
        stopListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setCurrentScreen, startListening, stopListening, setCommandPaletteOpen]);

  return (
    <div
      className="h-screen max-h-screen w-screen overflow-hidden select-none flex flex-col justify-between relative transition-colors duration-500 font-sans"
      style={{
        backgroundColor: theme.palette.bgBase,
        color: theme.palette.textPrimary,
        letterSpacing: monospaceKern === '0.95x' ? '-0.02em' : monospaceKern === '1.50x' ? '0.04em' : 'normal',
      }}
    >
      {/* ================= SPATIAL ATMOSPHERIC BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft center ambient bloom */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[640px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 opacity-60"
          style={{ backgroundColor: `${theme.palette.accent}0d` }}
        />
        {/* Subtle grid pattern on synaptic view */}
        {currentScreen === 'synaptic' && !showOnboarding && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500"
            style={{
              backgroundImage: `radial-gradient(${theme.palette.canvasGridColor} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }}
          />
        )}
      </div>

      {showOnboarding ? (
        /* ================= ONBOARDING / AUTHENTICATION DESKTOP STAGE ================= */
        <div className="flex-1 w-full h-full min-h-0 overflow-y-auto flex items-center justify-center relative z-10 custom-scrollbar animate-fade-in">
          <OnboardingFlow />
        </div>
      ) : (
        /* ================= MAIN APPLICATION WORKSPACE ================= */
        <>
          {/* Top Minimal Desktop HUD */}
          <TopHud />

          {/* Main Interaction Stage */}
          <main className="flex-1 relative w-full h-full min-h-0 overflow-hidden flex items-center justify-center z-10 animate-fade-in">
            {/* Left Navigation Rail */}
            <div className="absolute left-6 top-6 bottom-8 pointer-events-auto z-20 flex">
              <NavRail />
            </div>

            {/* Dynamic Screen Routing */}
            {currentScreen === 'substrate' && <PresenceScreen />}
            {currentScreen === 'runtime' && <SettingsScreen />}
            {currentScreen === 'synaptic' && <SynapticMapScreen />}

            {/* Center Floating Liquid Voice Pill */}
            {currentScreen !== 'synaptic' && currentScreen !== 'runtime' && <VoicePill />}
          </main>
        </>
      )}

      {/* ================= BOTTOM FOOTER ================= */}
      <footer
        className="h-6 px-6 flex items-center justify-between text-[10px] font-mono opacity-50 z-20 pointer-events-none border-t transition-colors duration-300"
        style={{
          borderColor: theme.palette.glassBorder,
          color: theme.palette.textMuted,
          backgroundColor: theme.palette.glassSurface,
        }}
      >
        <span>
          {showOnboarding
            ? 'NOVA ONBOARDING & SECURE ENCLAVE · OMNIEL OS 4.2'
            : currentScreen === 'runtime'
            ? 'NOVA SETTINGS & CONTROL CENTER · SECURE ENCLAVE'
            : currentScreen === 'synaptic'
            ? 'SYNAPTIC VAULT ENCLAVE · SHA-256 VERIFIED'
            : 'OMNIEL OS 4.2 · AUTONOMOUS WORKSPACE'}
        </span>
        <span>NOVA DESKTOP ENVIRONMENT · ALL RIGHTS RESERVED</span>
      </footer>

      {/* Modals & Overlays */}
      <CommandPalette />
      <ThemeSelectorModal />
      <NotificationToasts />
    </div>
  );
}

export default function App() {
  return (
    <NovaAuthProvider>
      <NovaStateProvider>
        <NovaSettingsProvider>
          <AppContent />
        </NovaSettingsProvider>
      </NovaStateProvider>
    </NovaAuthProvider>
  );
}
