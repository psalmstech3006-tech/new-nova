import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const PermissionsSection: React.FC = () => {
  const { permissions, updatePermissions, triggerEmergencyHalt, resumeFromHalt } = useNovaSettings();
  const { theme } = useNova();

  const permissionItems = [
    { key: 'readFiles', label: 'Read Workspace Files', desc: 'Allows inspection of project directories and codebase files.', icon: 'fa-book-open' },
    { key: 'writeFiles', label: 'Modify & Write Files', desc: 'Permits applying code diffs and saving generated documents.', icon: 'fa-pen-to-square' },
    { key: 'deleteFiles', label: 'Delete Files', desc: 'Permanent destruction of files on disc (Dangerous).', icon: 'fa-trash-can' },
    { key: 'executePrograms', label: 'Execute Terminal Subprocesses', desc: 'Runs CLI commands inside sandboxed bubblewrap container.', icon: 'fa-terminal' },
    { key: 'controlApps', label: 'Control Desktop Applications', desc: 'Moves windows, simulates key presses and mouse clicks.', icon: 'fa-desktop' },
    { key: 'browserAccess', label: 'Web Browser Automation', desc: 'Spawns headless Chromium workers to crawl and fetch data.', icon: 'fa-globe' },
    { key: 'screenCapture', label: 'Continuous Screen Vision', desc: 'Captures visual frame buffers for OCR and layout spatial understanding.', icon: 'fa-eye' },
    { key: 'accessCamera', label: 'Webcam Optical Stream', desc: 'Streams webcam frames for physical gesture tracking.', icon: 'fa-camera' },
    { key: 'sendMessages', label: 'Dispatch Emails & Messages', desc: 'Sends external emails and chat messages on your behalf.', icon: 'fa-paper-plane' },
    { key: 'makePurchases', label: 'Financial Authorizations', desc: 'Autonomous credit card or payment transactions (Strictly Locked).', icon: 'fa-credit-card' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Permissions, Security &amp; Emergency Governance
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Enforce hardware access boundaries, autonomous approval levels, and instant operational kill switches.
        </p>
      </div>

      {/* Emergency Halt Banner */}
      <div
        className="p-5 rounded-2xl border flex items-center justify-between transition-all"
        style={{
          backgroundColor: permissions.emergencyHaltTriggered ? 'rgba(239, 68, 68, 0.15)' : theme.palette.bgElevated,
          borderColor: permissions.emergencyHaltTriggered ? '#ef4444' : theme.palette.glassBorder,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm"
            style={{
              backgroundColor: permissions.emergencyHaltTriggered ? '#ef4444' : theme.palette.glassSurface,
              color: permissions.emergencyHaltTriggered ? '#fff' : '#ef4444',
              borderColor: permissions.emergencyHaltTriggered ? '#ef4444' : theme.palette.glassBorder,
            }}
          >
            <i className="fa-solid fa-octagon-exclamation" />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: permissions.emergencyHaltTriggered ? '#ef4444' : theme.palette.textPrimary }}>
              {permissions.emergencyHaltTriggered ? 'EMERGENCY HALT ACTIVE' : 'Emergency Operational Halt'}
            </div>
            <div className="text-[11px] opacity-70" style={{ color: theme.palette.textSecondary }}>
              {permissions.emergencyHaltTriggered
                ? 'All subprocesses killed. Vector writes and IPC streams suspended.'
                : 'Instantly aborts all running agent workers, browser sessions, and bash subprocesses.'}
            </div>
          </div>
        </div>

        {permissions.emergencyHaltTriggered ? (
          <button
            onClick={resumeFromHalt}
            className="px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500"
          >
            Resume Operations
          </button>
        ) : (
          <button
            onClick={triggerEmergencyHalt}
            className="px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer bg-red-600/90 text-white hover:bg-red-600 active:scale-95 shadow-md"
          >
            EMERGENCY HALT
          </button>
        )}
      </div>

      {/* Approval Policy */}
      <div
        className="p-5 rounded-2xl border space-y-3"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Action Authorization Policy
        </span>

        <select
          value={permissions.approvalPolicy}
          onChange={(e) => updatePermissions('approvalPolicy', e.target.value)}
          className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
          style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
        >
          <option value="always-ask">Strict Mode: Always ask before any system action</option>
          <option value="ask-sensitive">Balanced Mode: Ask only for sensitive operations (files, network, bash)</option>
          <option value="trusted">Autonomous Mode: Execute within pre-approved workspace boundaries</option>
        </select>
      </div>

      {/* Granular Permission Toggles */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Granular Hardware &amp; System Capabilities
        </span>

        <div className="space-y-3 divide-y" style={{ borderColor: theme.palette.glassBorder }}>
          {permissionItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between pt-3">
              <div className="flex items-start gap-2.5">
                <i className={`fa-solid ${item.icon} text-xs mt-1 opacity-60`} style={{ color: theme.palette.accent }} />
                <div>
                  <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                    {item.label}
                  </div>
                  <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                    {item.desc}
                  </div>
                </div>
              </div>

              <input
                type="checkbox"
                checked={permissions[item.key as keyof typeof permissions] as boolean}
                onChange={(e) => updatePermissions(item.key, e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-slate-400 shrink-0 ml-3"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
