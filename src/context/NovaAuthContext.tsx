import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, AppPermissions, OnboardingStep, AuthProvider } from '../types/auth';

export const PRESET_ACCOUNTS: UserProfile[] = [
  {
    id: 'user-julian',
    name: 'Julian Thorne',
    callingName: 'Julian',
    email: 'j.thorne@omniel.internal',
    role: 'Principal Systems Architect',
    roleCategory: 'engineering',
    pronunciation: 'Joo-lee-an',
    tone: 'concise',
    reasoningEffort: 'deep',
    avatarInitials: 'JT',
    avatarColor: '#38bdf8',
    lastLogin: 'Today, 2:14 PM',
    isRemembered: true,
  },
  {
    id: 'user-elena',
    name: 'Dr. Elena Rostova',
    callingName: 'Dr. Rostova',
    email: 'e.rostova@synapse.ai',
    role: 'Cognitive Science & AI Research',
    roleCategory: 'research',
    pronunciation: 'Eh-lay-na',
    tone: 'rigorous',
    reasoningEffort: 'deep',
    avatarInitials: 'ER',
    avatarColor: '#a78bfa',
    lastLogin: 'Yesterday, 6:40 PM',
    isRemembered: true,
  },
  {
    id: 'user-aria',
    name: 'Aria Chen',
    callingName: 'Aria',
    email: 'aria.chen@omniel.com',
    role: 'Executive Strategy & Product',
    roleCategory: 'strategy',
    pronunciation: 'Ah-ree-ah',
    tone: 'conversational',
    reasoningEffort: 'standard',
    avatarInitials: 'AC',
    avatarColor: '#f472b6',
    lastLogin: '3 days ago',
    isRemembered: false,
  },
];

const DEFAULT_PERMISSIONS: AppPermissions = {
  microphone: 'prompt',
  notifications: 'prompt',
  globalShortcut: '⌥ Space',
  vaultMode: 'local',
  telemetryConsent: false,
};

interface NovaAuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isSessionLocked: boolean;
  isOnboardingComplete: boolean;
  currentStep: OnboardingStep;
  permissions: AppPermissions;
  isAuthenticating: boolean;
  authError: string | null;
  
  // Navigation & Step Control
  setStep: (step: OnboardingStep) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  
  // Auth Actions
  signInWithProvider: (provider: AuthProvider, email?: string, password?: string) => Promise<boolean>;
  signUpWithEmail: (name: string, email: string, password?: string) => Promise<boolean>;
  unlockSession: (method?: 'biometric' | 'pin') => Promise<boolean>;
  lockSession: () => void;
  signOut: () => void;
  
  // Quick profile / Demo switchers
  selectPresetAccount: (account: UserProfile) => void;
  quickLaunchAsGuest: () => void;
  relaunchOnboarding: () => void;
  
  // Profile & Permissions mutations
  updateProfile: (data: Partial<UserProfile>) => void;
  updatePermissions: (data: Partial<AppPermissions>) => void;
  completeOnboarding: () => void;
  resetAllSession: () => void;
}

const NovaAuthContext = createContext<NovaAuthContextType | null>(null);

const STORAGE_KEY = 'nova_auth_session_v1';

export const NovaAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state: Start at welcome for first-time launch demonstration
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.currentUser || null;
      }
    } catch {
      // fallback
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isAuthenticated ?? false;
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);

  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isOnboardingComplete ?? false;
      }
    } catch {
      // fallback
    }
    return false;
  });

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [permissions, setPermissions] = useState<AppPermissions>(DEFAULT_PERMISSIONS);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentUser,
          isAuthenticated,
          isOnboardingComplete,
        })
      );
    } catch {
      // ignore
    }
  }, [currentUser, isAuthenticated, isOnboardingComplete]);

  // Set step directly
  const setStep = useCallback((step: OnboardingStep) => {
    setAuthError(null);
    setCurrentStep(step);
  }, []);

  // Natural flow steps
  const goToNextStep = useCallback(() => {
    setAuthError(null);
    setCurrentStep((prev) => {
      switch (prev) {
        case 'welcome':
          return 'auth';
        case 'auth':
          return 'profile';
        case 'returning-unlock':
          return 'completed';
        case 'profile':
          return 'persona';
        case 'persona':
          return 'permissions';
        case 'permissions':
          return 'calibrating';
        case 'calibrating':
          return 'completed';
        default:
          return 'completed';
      }
    });
  }, []);

  const goToPrevStep = useCallback(() => {
    setAuthError(null);
    setCurrentStep((prev) => {
      switch (prev) {
        case 'auth':
          return 'welcome';
        case 'profile':
          return 'auth';
        case 'persona':
          return 'profile';
        case 'permissions':
          return 'persona';
        case 'calibrating':
          return 'permissions';
        case 'returning-unlock':
          return 'welcome';
        default:
          return 'welcome';
      }
    });
  }, []);

  // Sign In with Provider
  const signInWithProvider = useCallback(
    async (provider: AuthProvider, email?: string): Promise<boolean> => {
      setIsAuthenticating(true);
      setAuthError(null);

      // Simulate realistic desktop auth delay
      await new Promise((res) => setTimeout(res, 850));

      setIsAuthenticating(false);

      // Pick matching account or create synthetic profile
      let profile: UserProfile;
      if (email && email.toLowerCase().includes('elena')) {
        profile = PRESET_ACCOUNTS[1];
      } else if (email && email.toLowerCase().includes('aria')) {
        profile = PRESET_ACCOUNTS[2];
      } else if (provider === 'passkey') {
        profile = PRESET_ACCOUNTS[0]; // Julian default
      } else {
        profile = {
          id: `user-${Date.now()}`,
          name: email ? email.split('@')[0] : 'Workspace User',
          callingName: email ? email.split('@')[0] : 'User',
          email: email || 'user@omniel.internal',
          role: 'Systems Engineer',
          roleCategory: 'engineering',
          tone: 'concise',
          reasoningEffort: 'deep',
          avatarInitials: email ? email.slice(0, 2).toUpperCase() : 'NO',
          avatarColor: '#38bdf8',
          lastLogin: 'Just now',
          isRemembered: true,
        };
      }

      setCurrentUser(profile);
      setIsAuthenticated(true);
      setIsSessionLocked(false);

      // If returning user who completed onboarding before, go to returning-unlock or completed
      if (profile.isRemembered && isOnboardingComplete) {
        setCurrentStep('completed');
      } else {
        setCurrentStep('profile');
      }
      return true;
    },
    [isOnboardingComplete]
  );

  // Sign Up with Email
  const signUpWithEmail = useCallback(
    async (name: string, email: string): Promise<boolean> => {
      setIsAuthenticating(true);
      setAuthError(null);

      await new Promise((res) => setTimeout(res, 900));

      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim() || 'New User',
        callingName: name.trim().split(' ')[0] || 'User',
        email: email.trim(),
        role: 'Autonomous Systems User',
        roleCategory: 'engineering',
        tone: 'concise',
        reasoningEffort: 'deep',
        avatarInitials: (name.trim().slice(0, 2) || 'NO').toUpperCase(),
        avatarColor: '#38bdf8',
        lastLogin: 'Just now',
        isRemembered: true,
      };

      setIsAuthenticating(false);
      setCurrentUser(newProfile);
      setIsAuthenticated(true);
      setIsSessionLocked(false);
      setCurrentStep('profile');
      return true;
    },
    []
  );

  // Unlock existing locked session
  const unlockSession = useCallback(async (): Promise<boolean> => {
    setIsAuthenticating(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsAuthenticating(false);
    setIsSessionLocked(false);
    setIsAuthenticated(true);
    setIsOnboardingComplete(true);
    setCurrentStep('completed');
    return true;
  }, []);

  // Lock session (returning-user simulation)
  const lockSession = useCallback(() => {
    setIsSessionLocked(true);
    setCurrentStep('returning-unlock');
  }, []);

  // Sign out
  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setIsSessionLocked(false);
    setIsOnboardingComplete(false);
    setCurrentUser(null);
    setCurrentStep('welcome');
  }, []);

  // Select Preset Account for fast evaluation
  const selectPresetAccount = useCallback((account: UserProfile) => {
    setCurrentUser(account);
    setIsAuthenticated(true);
    setIsSessionLocked(false);
    setCurrentStep('returning-unlock');
  }, []);

  // Quick launch as Guest
  const quickLaunchAsGuest = useCallback(() => {
    const guestProfile: UserProfile = {
      id: 'user-guest',
      name: 'Guest Operator',
      callingName: 'Guest',
      email: 'local@sandbox.omniel',
      role: 'Local Sandbox Enclave',
      roleCategory: 'general',
      tone: 'concise',
      reasoningEffort: 'standard',
      avatarInitials: 'GO',
      avatarColor: '#94a3b8',
      lastLogin: 'Live Session',
      isRemembered: false,
    };
    setCurrentUser(guestProfile);
    setIsAuthenticated(true);
    setIsSessionLocked(false);
    setIsOnboardingComplete(true);
    setCurrentStep('completed');
  }, []);

  // Relaunch Onboarding from main workspace
  const relaunchOnboarding = useCallback(() => {
    setIsOnboardingComplete(false);
    setCurrentStep('welcome');
  }, []);

  // Update profile
  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  // Update permissions
  const updatePermissions = useCallback((data: Partial<AppPermissions>) => {
    setPermissions((prev) => ({ ...prev, ...data }));
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    setIsOnboardingComplete(true);
    setIsSessionLocked(false);
    setCurrentStep('completed');
  }, []);

  // Reset entire session
  const resetAllSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsSessionLocked(false);
    setIsOnboardingComplete(false);
    setCurrentStep('welcome');
    setPermissions(DEFAULT_PERMISSIONS);
  }, []);

  return (
    <NovaAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isSessionLocked,
        isOnboardingComplete,
        currentStep,
        permissions,
        isAuthenticating,
        authError,
        setStep,
        goToNextStep,
        goToPrevStep,
        signInWithProvider,
        signUpWithEmail,
        unlockSession,
        lockSession,
        signOut,
        selectPresetAccount,
        quickLaunchAsGuest,
        relaunchOnboarding,
        updateProfile,
        updatePermissions,
        completeOnboarding,
        resetAllSession,
      }}
    >
      {children}
    </NovaAuthContext.Provider>
  );
};

export const useNovaAuth = () => {
  const context = useContext(NovaAuthContext);
  if (!context) {
    throw new Error('useNovaAuth must be used within a NovaAuthProvider');
  }
  return context;
};
