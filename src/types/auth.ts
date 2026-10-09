export type AuthMode = 'sign-in' | 'sign-up';

export type AuthProvider = 'passkey' | 'email' | 'magic-link' | 'google' | 'github' | 'omni-sso';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  roleCategory: 'engineering' | 'research' | 'strategy' | 'creative' | 'general';
  callingName: string;
  pronunciation?: string;
  tone: 'concise' | 'conversational' | 'rigorous';
  reasoningEffort: 'standard' | 'deep';
  avatarInitials: string;
  avatarColor: string;
  lastLogin: string;
  isRemembered: boolean;
}

export interface AppPermissions {
  microphone: 'prompt' | 'granted' | 'denied';
  notifications: 'prompt' | 'granted' | 'denied';
  globalShortcut: string;
  vaultMode: 'local' | 'cloud-e2ee';
  telemetryConsent: boolean;
}

export type OnboardingStep =
  | 'welcome'
  | 'auth'
  | 'returning-unlock'
  | 'profile'
  | 'persona'
  | 'permissions'
  | 'calibrating'
  | 'completed';
