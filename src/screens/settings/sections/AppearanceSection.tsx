import React from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';
import { NOVA_THEMES } from '../../../theme/themes';
import { ThemeId } from '../../../types/nova';

export const AppearanceSection: React.FC = () => {
  const { appearance, updateAppearance } = useNovaSettings();
  const { theme, themeId, setThemeId, glassOpacity, setGlassOpacity, addToast } = useNova();

  const themeList = Object.values(NOVA_THEMES);

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Appearance &amp; Liquid Glass Architecture
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Control physical optical materials, environmental themes, and Apple-grade liquid glass refraction.
        </p>
      </div>

      {/* 1. Theme Selection with Visual Previews */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider opacity-70" style={{ color: theme.palette.accent }}>
            Product Identity Themes
          </span>
          <span className="text-xs font-mono font-medium" style={{ color: theme.palette.accent }}>
            Active: {theme.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {themeList.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setThemeId(t.id as ThemeId);
                  addToast('Theme Activated', `Applied ${t.name} environment.`, 'info');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                  isSelected ? 'ring-2 scale-[1.02]' : 'hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: t.palette.bgElevated,
                  borderColor: isSelected ? t.palette.accent : t.palette.glassBorder,
                  boxShadow: isSelected
                    ? `0 10px 25px -5px ${t.palette.glow}, inset 0 1px 1px 0 ${t.palette.glassHighlight}`
                    : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium font-sans" style={{ color: t.palette.textPrimary }}>
                      {t.name}
                    </span>
                    <span
                      className="text-[8px] font-mono px-1.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: t.palette.glassSurface,
                        borderColor: t.palette.glassBorder,
                        color: t.palette.textSecondary,
                      }}
                    >
                      {t.isDark ? 'Dark' : 'Pearl'}
                    </span>
                  </div>
                  <p className="text-[10px] leading-tight mb-3 opacity-60" style={{ color: t.palette.textSecondary }}>
                    {t.tagline}
                  </p>
                </div>

                {/* Swatches */}
                <div className="flex items-center gap-1.5 pt-2 border-t" style={{ borderColor: t.palette.glassBorder }}>
                  <span className="w-3.5 h-3.5 rounded-md border" style={{ backgroundColor: t.palette.bgBase, borderColor: t.palette.glassBorder }} />
                  <span className="w-3.5 h-3.5 rounded-md border" style={{ backgroundColor: t.palette.glassSurface, borderColor: t.palette.glassBorder }} />
                  <span className="w-3.5 h-3.5 rounded-md border" style={{ backgroundColor: t.palette.accent, borderColor: t.palette.glassBorder }} />
                  <span className="w-3.5 h-3.5 rounded-md border" style={{ backgroundColor: t.palette.orbParticlePrimary, borderColor: t.palette.glassBorder }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Liquid Glass Material & Optics */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Liquid Glass Material Calibration
        </span>

        {/* Live demonstration card */}
        <div
          className="p-4 rounded-2xl border mb-4 backdrop-blur-2xl transition-all flex items-center justify-between"
          style={{
            backgroundColor: `rgba(${theme.isDark ? '20, 24, 32' : '255, 255, 255'}, ${glassOpacity / 100})`,
            borderColor: theme.palette.glassBorder,
            boxShadow: `0 15px 35px -10px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
          }}
        >
          <div>
            <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
              Optical Transmission Sample
            </div>
            <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
              Background content diffuses smoothly through physical acrylic layers.
            </div>
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: theme.palette.accent }}>
            {glassOpacity}% Density
          </span>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Acrylic Material Opacity
              </span>
              <span className="font-mono text-xs" style={{ color: theme.palette.accent }}>
                {glassOpacity}%
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={glassOpacity}
              onChange={(e) => {
                setGlassOpacity(Number(e.target.value));
                updateAppearance('glassOpacityPct', Number(e.target.value));
              }}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
            <div className="flex justify-between text-[9px] font-mono opacity-50 mt-1" style={{ color: theme.palette.textMuted }}>
              <span>30% Ethereal (Liquid)</span>
              <span>Subsurface Optical Transmission</span>
              <span>95% Dense Matte</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Backdrop Optical Blur
              </span>
              <span className="font-mono text-xs" style={{ color: theme.palette.accent }}>
                {appearance.glassBlurPx}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="40"
              value={appearance.glassBlurPx}
              onChange={(e) => updateAppearance('glassBlurPx', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium" style={{ color: theme.palette.textPrimary }}>
                Specular Rim Highlight Intensity
              </span>
              <span className="font-mono text-xs" style={{ color: theme.palette.accent }}>
                {appearance.specularIntensity}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={appearance.specularIntensity}
              onChange={(e) => updateAppearance('specularIntensity', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Ambient Environment & Motion */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Interface Density &amp; Motion
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Interface Scale &amp; Density
            </label>
            <select
              value={appearance.uiScale}
              onChange={(e) => updateAppearance('uiScale', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="90%">Compact (90%)</option>
              <option value="100%">Standard Desktop (100%)</option>
              <option value="110%">Large (110%)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Continuous Corner Radius
            </label>
            <select
              value={appearance.cornerRadius}
              onChange={(e) => updateAppearance('cornerRadius', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="18px">Crisp (18px)</option>
              <option value="24px">Standard Apple (24px)</option>
              <option value="30px">Smooth Spatial (30px)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
              Ambient Substrate Motion
            </div>
            <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
              Permit gentle fluid breathing in background particulate and ambient lighting.
            </div>
          </div>
          <input
            type="checkbox"
            checked={appearance.ambientMotion}
            onChange={(e) => updateAppearance('ambientMotion', e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer accent-slate-400"
          />
        </div>
      </div>
    </div>
  );
};
