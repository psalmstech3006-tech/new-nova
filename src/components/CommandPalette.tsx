import React, { useState, useEffect } from 'react';
import { useNova } from '../context/NovaStateContext';
import { NOVA_THEMES } from '../theme/themes';
import { ThemeId } from '../types/nova';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentScreen,
    setPresenceType,
    dispatchTask,
    setThemeId,
    theme,
  } = useNova();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const commands = [
    {
      id: 'nav-substrate',
      category: 'Workspace',
      title: 'Open Skill Substrate & Presence Arena',
      icon: 'fa-shapes',
      action: () => {
        setCurrentScreen('substrate');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-runtime',
      category: 'Workspace',
      title: 'Open System Architecture & Telemetry Settings',
      icon: 'fa-layer-group',
      action: () => {
        setCurrentScreen('runtime');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'nav-synaptic',
      category: 'Workspace',
      title: 'Open Synaptic Mind Map & Memory Vault',
      icon: 'fa-diagram-project',
      action: () => {
        setCurrentScreen('synaptic');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'presence-orb',
      category: '3D Manifestation',
      title: 'Manifestation: Volumetric Particulate Core',
      icon: 'fa-atom',
      action: () => {
        setPresenceType('orb');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'presence-humanoid',
      category: '3D Manifestation',
      title: 'Manifestation: Synthetic Topographic Humanoid',
      icon: 'fa-user-astronaut',
      action: () => {
        setPresenceType('humanoid');
        setCommandPaletteOpen(false);
      },
    },
    ...Object.values(NOVA_THEMES).map((t) => ({
      id: `theme-${t.id}`,
      category: 'Themes',
      title: `Switch Theme: ${t.name} (${t.tagline})`,
      icon: 'fa-palette',
      action: () => {
        setThemeId(t.id as ThemeId);
        setCommandPaletteOpen(false);
      },
    })),
    {
      id: 'task-research',
      category: 'Actions',
      title: 'Dispatch: Web Deep Research • arXiv scan',
      icon: 'fa-compass',
      action: () => {
        dispatchTask('Execute Web Deep Research • arXiv scan');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'task-ast',
      category: 'Actions',
      title: 'Dispatch: Tree-sitter parse: Rust AST reconcile',
      icon: 'fa-code',
      action: () => {
        dispatchTask('Tree-sitter parse: Rust AST reconcile');
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div
        className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col font-sans transition-all duration-300"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b gap-3" style={{ borderColor: theme.palette.glassBorder }}>
          <i className="fa-solid fa-magnifying-glass text-xs opacity-50" style={{ color: theme.palette.accent }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Type a command, capability or switch theme..."
            className="bg-transparent outline-none w-full text-xs font-sans placeholder:opacity-40"
            style={{ color: theme.palette.textPrimary }}
          />
          <kbd
            className="px-1.5 py-0.5 rounded text-[10px] border font-mono opacity-50"
            style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder, color: theme.palette.textSecondary }}
          >
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs opacity-40 font-sans" style={{ color: theme.palette.textSecondary }}>
              No matching capabilities or system actions found
            </div>
          ) : (
            filtered.map((cmd) => (
              <div
                key={cmd.id}
                onClick={cmd.action}
                className="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all group"
                style={{ color: theme.palette.textSecondary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = theme.palette.glassSurface;
                  (e.currentTarget as HTMLElement).style.color = theme.palette.textPrimary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = theme.palette.textSecondary;
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg border flex items-center justify-center text-xs opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
                  >
                    <i className={`fa-solid ${cmd.icon} text-[10px]`} />
                  </div>
                  <span className="text-xs font-medium">{cmd.title}</span>
                </div>
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-40">
                  {cmd.category}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2.5 border-t flex items-center justify-between text-[10px] font-mono opacity-40"
          style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}
        >
          <span>NOVA COMMAND ARCHITECTURE</span>
          <span>Press [1] [2] [3] for quick navigation</span>
        </div>
      </div>
    </div>
  );
};
