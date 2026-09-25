import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const GeneralSection: React.FC = () => {
  const { general, updateGeneral, resetAllSettings } = useNovaSettings();
  const { theme } = useNova();

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          General Preferences
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure application launch behavior, window management, and localization settings.
        </p>
      </div>

      {/* Startup & Launch Behavior */}
      <div
        className="p-5 rounded-2xl border space-y-4 transition-all duration-300"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Launch &amp; Background Behavior
        </span>

        <div className="space-y-3.5 divide-y" style={{ borderColor: theme.palette.glassBorder }}>
          <div className="flex items-center justify-between pt-1">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Launch NOVA at System Startup
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Initialize the background intelligence substrate when your computer boots.
              </div>
            </div>
            <input
              type="checkbox"
              checked={general.launchAtStartup}
              onChange={(e) => updateGeneral('launchAtStartup', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Start Minimized to System Tray
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Keep NOVA accessible in the background without opening the main window.
              </div>
            </div>
            <input
              type="checkbox"
              checked={general.startMinimized}
              onChange={(e) => updateGeneral('startMinimized', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Confirm Before Quitting
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Prompt confirmation if active agent tasks or sandboxes are running.
              </div>
            </div>
            <input
              type="checkbox"
              checked={general.confirmBeforeQuit}
              onChange={(e) => updateGeneral('confirmBeforeQuit', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Localization & Formats */}
      <div
        className="p-5 rounded-2xl border space-y-4 transition-all duration-300"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Localization &amp; Environment
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Interface Language
            </label>
            <select
              value={general.language}
              onChange={(e) => updateGeneral('language', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="English (US)">English (US)</option>
              <option value="English (UK)">English (UK)</option>
              <option value="German (DE)">German (DE)</option>
              <option value="Japanese (JA)">Japanese (JA)</option>
              <option value="French (FR)">French (FR)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Default Landing View
            </label>
            <select
              value={general.defaultLandingView}
              onChange={(e) => updateGeneral('defaultLandingView', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="substrate">Skill Substrate &amp; Presence Arena</option>
              <option value="synaptic">Synaptic Mind Map &amp; Memory Vault</option>
              <option value="runtime">System Architecture &amp; Settings</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Time Format
            </label>
            <select
              value={general.timeFormat}
              onChange={(e) => updateGeneral('timeFormat', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="12-hour (AM/PM)">12-hour (AM/PM)</option>
              <option value="24-hour (Military)">24-hour (00:00 - 23:59)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Units of Measurement
            </label>
            <select
              value={general.units}
              onChange={(e) => updateGeneral('units', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="Metric / SI">Metric / SI (°C, km, kg)</option>
              <option value="Imperial">Imperial (°F, miles, lbs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Preferences */}
      <div
        className="p-4 rounded-2xl border flex items-center justify-between"
        style={{ borderColor: theme.palette.glassBorder, backgroundColor: theme.palette.glassSurface }}
      >
        <div>
          <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
            Reset Application Preferences
          </div>
          <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
            Restore system defaults without touching memory vaults or indexed files.
          </div>
        </div>
        <button
          onClick={resetAllSettings}
          className="px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all hover:opacity-100 cursor-pointer"
          style={{
            borderColor: theme.palette.glassBorder,
            backgroundColor: theme.palette.bgElevated,
            color: theme.palette.textSecondary,
          }}
        >
          Reset Preferences
        </button>
      </div>
    </div>
  );
};
