import React from 'react';
import { useNovaAuth } from '../../context/NovaAuthContext';
import { DesktopWindowShell } from './DesktopWindowShell';
import { WelcomeScreen } from './WelcomeScreen';
import { AuthenticationScreen } from './AuthenticationScreen';
import { ReturningUnlockScreen } from './ReturningUnlockScreen';
import { ProfileSetupScreen } from './ProfileSetupScreen';
import { PersonaSetupScreen } from './PersonaSetupScreen';
import { PermissionsScreen } from './PermissionsScreen';
import { CalibrationTransitionScreen } from './CalibrationTransitionScreen';

export const OnboardingFlow: React.FC = () => {
  const { currentStep } = useNovaAuth();

  switch (currentStep) {
    case 'welcome':
      return (
        <DesktopWindowShell title="NOVA Desktop — First Launch" stepNumber={1} totalSteps={5}>
          <WelcomeScreen />
        </DesktopWindowShell>
      );

    case 'auth':
      return (
        <DesktopWindowShell title="NOVA Desktop — Authentication" stepNumber={2} totalSteps={5}>
          <AuthenticationScreen />
        </DesktopWindowShell>
      );

    case 'returning-unlock':
      return (
        <DesktopWindowShell title="NOVA Desktop — Session Locked" stepNumber={1} totalSteps={1}>
          <ReturningUnlockScreen />
        </DesktopWindowShell>
      );

    case 'profile':
      return (
        <DesktopWindowShell title="NOVA Desktop — User Identity" stepNumber={3} totalSteps={5}>
          <ProfileSetupScreen />
        </DesktopWindowShell>
      );

    case 'persona':
      return (
        <DesktopWindowShell title="NOVA Desktop — Communication Persona" stepNumber={4} totalSteps={5}>
          <PersonaSetupScreen />
        </DesktopWindowShell>
      );

    case 'permissions':
      return (
        <DesktopWindowShell title="NOVA Desktop — System Permissions" stepNumber={5} totalSteps={5}>
          <PermissionsScreen />
        </DesktopWindowShell>
      );

    case 'calibrating':
      return (
        <DesktopWindowShell title="NOVA Desktop — Calibrating Substrate" stepNumber={5} totalSteps={5}>
          <CalibrationTransitionScreen />
        </DesktopWindowShell>
      );

    default:
      return null;
  }
};
