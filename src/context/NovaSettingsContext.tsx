import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  SettingsSectionId,
  SettingsGroup,
  ProactivityLevel,
  MemoryCategoryItem,
  ToolCapability,
  AutomationRule,
  ConnectedIntegration,
} from '../types/settings';
import { useNova } from './NovaStateContext';

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'system',
    name: 'System & Core',
    sections: [
      { id: 'general', label: 'General', icon: 'fa-sliders', description: 'Startup, window behavior, localization and preferences' },
      { id: 'appearance', label: 'Appearance', icon: 'fa-palette', description: 'Liquid glass materials, themes and spatial environment' },
      { id: 'nova', label: 'NOVA Intelligence', icon: 'fa-brain', description: 'Wake word, proactivity, initiative and task persistence' },
      { id: 'identity', label: 'Identity & Presence', icon: 'fa-user-astronaut', description: 'User profile, speaker recognition and active presence' },
    ],
  },
  {
    id: 'voice-audio',
    name: 'Voice & Acoustics',
    sections: [
      { id: 'voice', label: 'Voice & Speech', icon: 'fa-microphone', description: 'Synthesized voice models, cadence, expressiveness and pitch' },
      { id: 'audio', label: 'Audio Hardware', icon: 'fa-volume-high', description: 'I/O routing, noise suppression, VAD and acoustic ducking' },
      { id: 'screen-vision', label: 'Screen & Vision', icon: 'fa-eye', description: 'Continuous window awareness, OCR and visual privacy zones' },
    ],
  },
  {
    id: 'intelligence-memory',
    name: 'Cognition & Knowledge',
    sections: [
      { id: 'intelligence', label: 'Model & Reasoning', icon: 'fa-microchip', description: 'Model routing, reasoning depth, verification and context' },
      { id: 'memory', label: 'Memory Vault', icon: 'fa-database', description: 'Long-term preferences, provenance, retention and export' },
      { id: 'personality', label: 'Personality Matrix', icon: 'fa-masks-theater', description: 'TARS-style behavioral sliders and custom instructions' },
      { id: 'research', label: 'Research Engine', icon: 'fa-compass', description: 'Deep web consensus, multi-source citations and parallel scan' },
      { id: 'files-knowledge', label: 'Files & Workspace', icon: 'fa-folder-tree', description: 'Indexed folders, document repositories and file watching' },
    ],
  },
  {
    id: 'governance',
    name: 'Control & Security',
    sections: [
      { id: 'permissions', label: 'Permissions & Security', icon: 'fa-shield-halved', description: 'Granular device gates, approval policies and emergency halt' },
      { id: 'system-control', label: 'System Control', icon: 'fa-laptop-code', description: 'Desktop actions, window control and terminal execution' },
      { id: 'automation', label: 'Automation & Routines', icon: 'fa-wand-magic-sparkles', description: 'Conditional workflows, triggers and scheduled routines' },
      { id: 'tools', label: 'Tools & Capabilities', icon: 'fa-toolbox', description: 'Sandboxed capability manager and worker pool allocations' },
    ],
  },
  {
    id: 'connectivity',
    name: 'Connectivity & Cloud',
    sections: [
      { id: 'integrations', label: 'Integrations', icon: 'fa-plug', description: 'Google Workspace, GitHub, Slack and external APIs' },
      { id: 'network', label: 'Network & Cloud', icon: 'fa-network-wired', description: 'Connection status, proxy setup and API telemetry' },
      { id: 'offline', label: 'Offline Mode', icon: 'fa-plane', description: 'Local model fallback, offline memory and air-gapped security' },
      { id: 'privacy', label: 'Privacy & Data', icon: 'fa-lock', description: 'Local vs cloud processing boundaries, zero-telemetry logs' },
    ],
  },
  {
    id: 'diagnostics-system',
    name: 'Engine & Diagnostics',
    sections: [
      { id: 'diagnostics', label: 'Diagnostics & Health', icon: 'fa-heart-pulse', description: 'Real-time kernel telemetry, health checks and error audit' },
      { id: 'performance', label: 'Performance & Presets', icon: 'fa-gauge-high', description: 'Glass quality modes, GPU hardware acceleration and VRAM limits' },
      { id: 'developer', label: 'Developer & IPC', icon: 'fa-terminal', description: 'Socket bus endpoints, event stream console and debug flags' },
      { id: 'accessibility', label: 'Accessibility', icon: 'fa-universal-access', description: 'Reduced motion, optical contrast and assistive tools' },
      { id: 'about', label: 'About NOVA', icon: 'fa-circle-info', description: 'Build info, engine architecture, changelog and licenses' },
    ],
  },
];

interface NovaSettingsContextType {
  activeSection: SettingsSectionId;
  setActiveSection: (section: SettingsSectionId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // General Settings
  general: {
    launchAtStartup: boolean;
    startMinimized: boolean;
    startInBackground: boolean;
    confirmBeforeQuit: boolean;
    defaultLandingView: string;
    language: string;
    dateFormat: string;
    timeFormat: string;
    timeZone: string;
    units: string;
  };
  updateGeneral: (key: string, value: unknown) => void;

  // Appearance & Glass
  appearance: {
    glassBlurPx: number;
    glassOpacityPct: number;
    specularIntensity: number;
    uiScale: string;
    cornerRadius: string;
    ambientMotion: boolean;
    particleDensity: number;
    qualityPreset: 'quality' | 'balanced' | 'performance';
  };
  updateAppearance: (key: string, value: unknown) => void;

  // NOVA Core Settings
  novaCore: {
    wakeWord: string;
    activationBehavior: 'wake-word' | 'push-to-talk' | 'both';
    responseStyle: 'concise' | 'balanced' | 'comprehensive';
    proactivityLevel: ProactivityLevel;
    confirmationBehavior: 'always' | 'sensitive-only' | 'autonomous';
    taskPersistence: boolean;
    contextAwareness: boolean;
    interruptionAllowed: boolean;
  };
  updateNovaCore: (key: string, value: unknown) => void;

  // Voice Settings
  voiceSettings: {
    selectedVoice: string;
    speed: number;
    pitch: number;
    volume: number;
    expressiveness: number;
    voiceMode: 'natural' | 'professional' | 'calm' | 'energetic' | 'concise';
    bargeIn: boolean;
    wakeWordSensitivity: number;
  };
  updateVoice: (key: string, value: unknown) => void;

  // Audio Settings
  audioSettings: {
    inputDevice: string;
    outputDevice: string;
    inputVolume: number;
    outputVolume: number;
    noiseSuppression: boolean;
    echoCancellation: boolean;
    audioDucking: boolean;
    notificationSounds: boolean;
  };
  updateAudio: (key: string, value: unknown) => void;

  // Intelligence & Models
  intelligence: {
    activeModel: string;
    fallbackModel: string;
    offlineModel: string;
    reasoningDepth: number; // 1-5
    answerConciseness: number; // 1-5
    uncertaintyHandling: 'clarify' | 'best-effort' | 'cautious';
    contextWindowTokens: number;
  };
  updateIntelligence: (key: string, value: unknown) => void;

  // Memory
  memorySettings: {
    memoryEnabled: boolean;
    askBeforeRemember: boolean;
    autoRemember: boolean;
    memoryExpirationDays: number;
    categories: MemoryCategoryItem[];
  };
  updateMemorySettings: (key: string, value: unknown) => void;
  toggleMemoryCategory: (id: string) => void;

  // Personality
  personality: {
    formality: number; // 0 (Formal) - 100 (Casual)
    conciseness: number; // 0 (Concise) - 100 (Detailed)
    playfulness: number; // 0 (Serious) - 100 (Playful)
    proactivity: number; // 0 (Passive) - 100 (Proactive)
    conversationality: number; // 0 (Direct) - 100 (Conversational)
    customInstructions: string;
  };
  updatePersonality: (key: string, value: unknown) => void;

  // Identity
  identity: {
    userName: string;
    preferredName: string;
    userRole: string;
    presenceStatus: 'active' | 'focus' | 'away' | 'dnd' | 'meeting';
    voiceRecognitionEnabled: boolean;
    deviceTrustLevel: 'high' | 'standard' | 'restricted';
  };
  updateIdentity: (key: string, value: unknown) => void;

  // Permissions & Security
  permissions: {
    readFiles: boolean;
    writeFiles: boolean;
    deleteFiles: boolean;
    executePrograms: boolean;
    controlApps: boolean;
    browserAccess: boolean;
    sendMessages: boolean;
    makePurchases: boolean;
    accessCamera: boolean;
    screenCapture: boolean;
    approvalPolicy: 'always-ask' | 'ask-sensitive' | 'trusted';
    emergencyHaltTriggered: boolean;
  };
  updatePermissions: (key: string, value: unknown) => void;
  triggerEmergencyHalt: () => void;
  resumeFromHalt: () => void;

  // Automation
  automations: AutomationRule[];
  addAutomation: (rule: Omit<AutomationRule, 'id'>) => void;
  toggleAutomation: (id: string) => void;
  deleteAutomation: (id: string) => void;
  pauseAllAutomations: boolean;
  setPauseAllAutomations: (pause: boolean) => void;

  // Tools & Capabilities
  capabilities: ToolCapability[];
  toggleCapability: (id: string) => void;
  setCapabilityPermission: (id: string, level: ToolCapability['permissionLevel']) => void;

  // Integrations
  integrations: ConnectedIntegration[];
  toggleIntegration: (id: string) => void;

  // Diagnostics
  isDiagnosing: boolean;
  diagnosticsResult: Record<string, string> | null;
  runDiagnostics: () => void;

  // Reset
  resetAllSettings: () => void;
}

const NovaSettingsContext = createContext<NovaSettingsContextType | null>(null);

export const NovaSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast, setThemeId, setGlassOpacity } = useNova();

  const [activeSection, setActiveSection] = useState<SettingsSectionId>('general');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. General
  const [general, setGeneral] = useState({
    launchAtStartup: true,
    startMinimized: false,
    startInBackground: true,
    confirmBeforeQuit: true,
    defaultLandingView: 'substrate',
    language: 'English (US)',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '12-hour (AM/PM)',
    timeZone: 'System (UTC-07:00 Pacific)',
    units: 'Metric / SI',
  });

  const updateGeneral = useCallback((key: string, value: unknown) => {
    setGeneral((prev) => ({ ...prev, [key]: value }));
    addToast('General Setting Updated', `${key} changed.`, 'info');
  }, [addToast]);

  // 2. Appearance
  const [appearance, setAppearance] = useState({
    glassBlurPx: 28,
    glassOpacityPct: 76,
    specularIntensity: 85,
    uiScale: '100%',
    cornerRadius: '24px',
    ambientMotion: true,
    particleDensity: 12000,
    qualityPreset: 'quality' as 'quality' | 'balanced' | 'performance',
  });

  const updateAppearance = useCallback((key: string, value: unknown) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    if (key === 'glassOpacityPct') {
      setGlassOpacity(Number(value));
    }
    addToast('Appearance Setting Updated', `${key} changed.`, 'info');
  }, [addToast, setGlassOpacity]);

  // 3. NOVA Core
  const [novaCore, setNovaCore] = useState({
    wakeWord: 'Hey Nova',
    activationBehavior: 'both' as 'wake-word' | 'push-to-talk' | 'both',
    responseStyle: 'balanced' as 'concise' | 'balanced' | 'comprehensive',
    proactivityLevel: 'proactive' as ProactivityLevel,
    confirmationBehavior: 'sensitive-only' as 'always' | 'sensitive-only' | 'autonomous',
    taskPersistence: true,
    contextAwareness: true,
    interruptionAllowed: true,
  });

  const updateNovaCore = useCallback((key: string, value: unknown) => {
    setNovaCore((prev) => ({ ...prev, [key]: value }));
    addToast('NOVA Intelligence Parameter Updated', `${key} adjusted.`, 'info');
  }, [addToast]);

  // 4. Voice
  const [voiceSettings, setVoiceSettings] = useState({
    selectedVoice: 'Nova Aurora (Calm / Warm)',
    speed: 1.05,
    pitch: 1.0,
    volume: 90,
    expressiveness: 80,
    voiceMode: 'calm' as 'natural' | 'professional' | 'calm' | 'energetic' | 'concise',
    bargeIn: true,
    wakeWordSensitivity: 84,
  });

  const updateVoice = useCallback((key: string, value: unknown) => {
    setVoiceSettings((prev) => ({ ...prev, [key]: value }));
    addToast('Voice Engine Parameter Updated', `${key} adjusted.`, 'info');
  }, [addToast]);

  // 5. Audio Hardware
  const [audioSettings, setAudioSettings] = useState({
    inputDevice: 'Default Studio Array (Built-in)',
    outputDevice: 'System Spatial Speakers',
    inputVolume: 85,
    outputVolume: 75,
    noiseSuppression: true,
    echoCancellation: true,
    audioDucking: true,
    notificationSounds: false,
  });

  const updateAudio = useCallback((key: string, value: unknown) => {
    setAudioSettings((prev) => ({ ...prev, [key]: value }));
    addToast('Acoustic Hardware Routing Updated', `${key} adjusted.`, 'info');
  }, [addToast]);

  // 6. Intelligence & Models
  const [intelligence, setIntelligence] = useState({
    activeModel: 'DeepSeek-R1 (Local Metal 32B)',
    fallbackModel: 'Gemini 2.5 Flash (Cloud Enclave)',
    offlineModel: 'NOVA-Edge-8B (Q4_K_M)',
    reasoningDepth: 4,
    answerConciseness: 3,
    uncertaintyHandling: 'clarify' as 'clarify' | 'best-effort' | 'cautious',
    contextWindowTokens: 65536,
  });

  const updateIntelligence = useCallback((key: string, value: unknown) => {
    setIntelligence((prev) => ({ ...prev, [key]: value }));
    addToast('Model & Reasoning Policy Updated', `${key} adjusted.`, 'info');
  }, [addToast]);

  // 7. Memory
  const [memorySettings, setMemorySettings] = useState({
    memoryEnabled: true,
    askBeforeRemember: false,
    autoRemember: true,
    memoryExpirationDays: 90,
    categories: [
      { id: 'personal', name: 'Personal Preferences', count: 48, description: 'Design constraints, communication rhythm, dark mode', enabled: true },
      { id: 'projects', name: 'Active Engineering Projects', count: 112, description: 'Codebases, repositories, compiler preferences, AST syntax', enabled: true },
      { id: 'people', name: 'Important Contacts & Collaborators', count: 18, description: 'Colleague roles, communication channels, time zones', enabled: true },
      { id: 'habits', name: 'Productivity & Sprint Habits', count: 32, description: 'Deep focus schedules, summary formats, notification rules', enabled: true },
      { id: 'devices', name: 'Hardware & Enclaves', count: 14, description: 'Local GPU parameters, UDS socket daemons, SSH keys', enabled: true },
    ],
  });

  const updateMemorySettings = useCallback((key: string, value: unknown) => {
    setMemorySettings((prev) => ({ ...prev, [key]: value }));
    addToast('Memory Vault Setting Updated', `${key} changed.`, 'info');
  }, [addToast]);

  const toggleMemoryCategory = useCallback((id: string) => {
    setMemorySettings((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
    }));
  }, []);

  // 8. Personality
  const [personality, setPersonality] = useState({
    formality: 35, // More casual/clean
    conciseness: 80, // Very concise
    playfulness: 25, // Calm/serious
    proactivity: 70, // Proactive
    conversationality: 30, // Direct
    customInstructions: 'Prioritize precision and immediate action over pleasantries. Format all responses with clean hierarchy and zero fluff.',
  });

  const updatePersonality = useCallback((key: string, value: unknown) => {
    setPersonality((prev) => ({ ...prev, [key]: value }));
    addToast('Personality Matrix Calibrated', 'Behavioral profile updated.', 'info');
  }, [addToast]);

  // 9. Identity & Presence
  const [identity, setIdentity] = useState({
    userName: 'Architect',
    preferredName: 'Commander',
    userRole: 'Lead Engineer',
    presenceStatus: 'active' as 'active' | 'focus' | 'away' | 'dnd' | 'meeting',
    voiceRecognitionEnabled: true,
    deviceTrustLevel: 'high' as 'high' | 'standard' | 'restricted',
  });

  const updateIdentity = useCallback((key: string, value: unknown) => {
    setIdentity((prev) => ({ ...prev, [key]: value }));
    addToast('Identity Profile Updated', `${key} adjusted.`, 'info');
  }, [addToast]);

  // 10. Permissions & Security
  const [permissions, setPermissions] = useState({
    readFiles: true,
    writeFiles: true,
    deleteFiles: false,
    executePrograms: true,
    controlApps: true,
    browserAccess: true,
    sendMessages: false,
    makePurchases: false,
    accessCamera: false,
    screenCapture: true,
    approvalPolicy: 'ask-sensitive' as 'always-ask' | 'ask-sensitive' | 'trusted',
    emergencyHaltTriggered: false,
  });

  const updatePermissions = useCallback((key: string, value: unknown) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
    addToast('Security Governance Updated', `${key} changed.`, 'warning');
  }, [addToast]);

  const triggerEmergencyHalt = useCallback(() => {
    setPermissions((prev) => ({ ...prev, emergencyHaltTriggered: true }));
    addToast('EMERGENCY HALT TRIGGERED', 'All active tasks, workers, and subprocesses terminated.', 'warning');
  }, [addToast]);

  const resumeFromHalt = useCallback(() => {
    setPermissions((prev) => ({ ...prev, emergencyHaltTriggered: false }));
    addToast('Security Lock Lifted', 'Operations resumed under strict policy constraints.', 'info');
  }, [addToast]);

  // 11. Automations
  const [automations, setAutomations] = useState<AutomationRule[]>([
    {
      id: 'auto-1',
      name: 'Nightly Vector Index Compression',
      trigger: 'Every day at 03:00 AM',
      action: 'Run HNSW cosine re-indexing and purge expired temporary memory',
      enabled: true,
      type: 'scheduled',
      lastRun: 'Today, 03:00 AM',
    },
    {
      id: 'auto-2',
      name: 'Focus Sprint Silence Gate',
      trigger: 'When calendar state enters "Focus" or "Deep Work"',
      action: 'Silence ambient notifications and suppress voice interruptions',
      enabled: true,
      type: 'conditional',
      lastRun: 'Yesterday, 2:15 PM',
    },
    {
      id: 'auto-3',
      name: 'Git Diff Pre-commit Verification',
      trigger: 'On staged changes detected in workspace repositories',
      action: 'Run Tree-sitter AST lint and check branch coverage',
      enabled: true,
      type: 'event',
      lastRun: '1 hour ago',
    },
  ]);

  const [pauseAllAutomations, setPauseAllAutomations] = useState(false);

  const addAutomation = useCallback((rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = { ...rule, id: `rule-${Date.now()}` };
    setAutomations((prev) => [...prev, newRule]);
    addToast('Automation Created', rule.name, 'success');
  }, [addToast]);

  const toggleAutomation = useCallback((id: string) => {
    setAutomations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  }, []);

  const deleteAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.filter((r) => r.id !== id));
    addToast('Automation Deleted', 'Rule removed from scheduler.', 'info');
  }, [addToast]);

  // 12. Tools & Capabilities
  const [capabilities, setCapabilities] = useState<ToolCapability[]>([
    { id: 'cap-browser', name: 'Browser Automation', category: 'Web', enabled: true, permissionLevel: 'ask-sensitive', status: 'active', lastUsed: '4 mins ago', description: 'Chromium workers with DOM extraction and form submission' },
    { id: 'cap-research', name: 'Web Deep Research', category: 'Knowledge', enabled: true, permissionLevel: 'trusted', status: 'active', lastUsed: 'Just now', description: 'Multi-query consensus synthesis across open academic journals and web' },
    { id: 'cap-terminal', name: 'Sandboxed Terminal Execution', category: 'System', enabled: true, permissionLevel: 'always-ask', status: 'standby', lastUsed: '28 mins ago', description: 'Subprocess runner locked within chroot / bubblewrap environment' },
    { id: 'cap-vision', name: 'Spatial Vision & OCR', category: 'Sensory', enabled: true, permissionLevel: 'trusted', status: 'active', lastUsed: '1 min ago', description: 'Continuous window frame OCR and layout analysis' },
    { id: 'cap-ast', name: 'Tree-Sitter Code Synthesis', category: 'Engineering', enabled: true, permissionLevel: 'trusted', status: 'active', lastUsed: '12 mins ago', description: 'Multi-lingual incremental parser and syntax tree transformer' },
    { id: 'cap-fs', name: 'Local File System Access', category: 'Files', enabled: true, permissionLevel: 'ask-sensitive', status: 'active', lastUsed: '45 mins ago', description: 'Atomic file reading, patching, and diff generation' },
    { id: 'cap-audio', name: 'Audio Resynthesis', category: 'Sensory', enabled: true, permissionLevel: 'trusted', status: 'active', lastUsed: 'Live', description: '96kHz FLAC resynthesis and multi-speaker beamforming' },
  ]);

  const toggleCapability = useCallback((id: string) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  }, []);

  const setCapabilityPermission = useCallback((id: string, level: ToolCapability['permissionLevel']) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, permissionLevel: level } : c))
    );
  }, []);

  // 13. Connected Integrations
  const [integrations, setIntegrations] = useState<ConnectedIntegration[]>([
    { id: 'int-google', name: 'Google Workspace', icon: 'fa-google', connected: true, permissionsCount: 3, authScope: 'Calendar, Drive (Read-only), Gmail (Drafts)', lastSynced: '5 mins ago' },
    { id: 'int-github', name: 'GitHub Enterprise', icon: 'fa-github', connected: true, permissionsCount: 4, authScope: 'Repo (Read/Write), Pull Requests, Actions', lastSynced: '12 mins ago' },
    { id: 'int-slack', name: 'Slack Team Communications', icon: 'fa-slack', connected: false, permissionsCount: 0, authScope: 'None', lastSynced: 'Never' },
    { id: 'int-postgres', name: 'PostgreSQL Vector Cluster', icon: 'fa-database', connected: true, permissionsCount: 2, authScope: 'Local pgvector embeddings pool', lastSynced: 'Live UDS' },
  ]);

  const toggleIntegration = useCallback((id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected, lastSynced: !item.connected ? 'Just now' : 'Disconnected' } : item
      )
    );
    addToast('Integration Toggled', 'Service connection state updated.', 'info');
  }, [addToast]);

  // 14. Diagnostics
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<Record<string, string> | null>(null);

  const runDiagnostics = useCallback(() => {
    setIsDiagnosing(true);
    addToast('Diagnostics Initiated', 'Running comprehensive system health suite...', 'info');
    setTimeout(() => {
      setIsDiagnosing(false);
      setDiagnosticsResult({
        agentSubstrate: 'Healthy (0.8ms IPC latency)',
        voiceSynthesizer: 'Healthy (96kHz FLAC pipeline synced)',
        acousticInput: 'Healthy (Zero-phase ANC active)',
        modelRouter: 'Healthy (Local vLLM backend nominal)',
        vectorStore: 'Healthy (18,490 vectors verified)',
        enclaveSeal: 'Verified (SHA-512 cryptographic ledger)',
        storageSubsystem: 'Healthy (0 unencrypted leaks)',
        memoryLeakCheck: 'Zero leaks detected over 96hr window',
      });
      addToast('Diagnostics Complete', 'All 8 health checks passed with nominal status.', 'success');
    }, 1600);
  }, [addToast]);

  // Reset all
  const resetAllSettings = useCallback(() => {
    const confirmed = window.confirm('Reset all NOVA configuration to factory defaults? Memory and vector vaults will be preserved.');
    if (confirmed) {
      setThemeId('warm-graphite');
      setGlassOpacity(76);
      addToast('Preferences Reset', 'All settings restored to factory defaults.', 'info');
    }
  }, [addToast, setThemeId, setGlassOpacity]);

  return (
    <NovaSettingsContext.Provider
      value={{
        activeSection,
        setActiveSection,
        searchQuery,
        setSearchQuery,
        general,
        updateGeneral,
        appearance,
        updateAppearance,
        novaCore,
        updateNovaCore,
        voiceSettings,
        updateVoice,
        audioSettings,
        updateAudio,
        intelligence,
        updateIntelligence,
        memorySettings,
        updateMemorySettings,
        toggleMemoryCategory,
        personality,
        updatePersonality,
        identity,
        updateIdentity,
        permissions,
        updatePermissions,
        triggerEmergencyHalt,
        resumeFromHalt,
        automations,
        addAutomation,
        toggleAutomation,
        deleteAutomation,
        pauseAllAutomations,
        setPauseAllAutomations,
        capabilities,
        toggleCapability,
        setCapabilityPermission,
        integrations,
        toggleIntegration,
        isDiagnosing,
        diagnosticsResult,
        runDiagnostics,
        resetAllSettings,
      }}
    >
      {children}
    </NovaSettingsContext.Provider>
  );
};

export const useNovaSettings = () => {
  const context = useContext(NovaSettingsContext);
  if (!context) {
    throw new Error('useNovaSettings must be used within a NovaSettingsProvider');
  }
  return context;
};
