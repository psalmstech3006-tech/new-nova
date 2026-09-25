export type SettingsSectionId =
  | 'general'
  | 'appearance'
  | 'nova'
  | 'voice'
  | 'audio'
  | 'intelligence'
  | 'memory'
  | 'personality'
  | 'identity'
  | 'permissions'
  | 'system-control'
  | 'automation'
  | 'tools'
  | 'screen-vision'
  | 'research'
  | 'files-knowledge'
  | 'notifications'
  | 'privacy'
  | 'network'
  | 'offline'
  | 'models'
  | 'integrations'
  | 'developer'
  | 'diagnostics'
  | 'performance'
  | 'accessibility'
  | 'about';

export interface SettingsGroup {
  id: string;
  name: string;
  sections: {
    id: SettingsSectionId;
    label: string;
    icon: string;
    description: string;
    badge?: string;
  }[];
}

export type ProactivityLevel = 'passive' | 'balanced' | 'proactive' | 'highly-proactive';

export interface MemoryCategoryItem {
  id: string;
  name: string;
  count: number;
  description: string;
  enabled: boolean;
}

export interface ToolCapability {
  id: string;
  name: string;
  category: string;
  enabled: boolean;
  permissionLevel: 'always-ask' | 'ask-sensitive' | 'trusted';
  status: 'active' | 'standby' | 'restricted';
  lastUsed: string;
  description: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  type: 'scheduled' | 'event' | 'conditional';
  lastRun?: string;
}

export interface ConnectedIntegration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  permissionsCount: number;
  authScope: string;
  lastSynced: string;
}
