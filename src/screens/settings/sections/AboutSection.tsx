import React, { useState } from 'react';
import { useNova } from '../../../context/NovaStateContext';

export const AboutSection: React.FC = () => {
  const { theme, addToast } = useNova();
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      addToast('NOVA Up to Date', 'NOVA Desktop Environment v4.2.8 is the latest stable build.', 'success');
    }, 1400);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          About NOVA
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Engine architecture, build metadata, licensing details, and version ledger.
        </p>
      </div>

      {/* Brand & Version Card */}
      <div
        className="p-6 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl border flex items-center justify-center font-bold tracking-wider text-sm shadow-md"
              style={{
                backgroundColor: theme.palette.glassSurface,
                borderColor: theme.palette.glassBorder,
                color: theme.palette.accent,
              }}
            >
              NOVA
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight" style={{ color: theme.palette.textPrimary }}>
                NOVA Desktop Operating Environment
              </div>
              <div className="text-xs font-mono opacity-60" style={{ color: theme.palette.textSecondary }}>
                Version 4.2.8 · Build 0x889F-METAL
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckUpdate}
            disabled={isCheckingUpdate}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          >
            <i className={`fa-solid ${isCheckingUpdate ? 'fa-arrows-rotate animate-spin' : 'fa-rotate'} text-[10px]`} />
            <span>{isCheckingUpdate ? 'Checking...' : 'Check for Updates'}</span>
          </button>
        </div>

        {/* Identity Manifesto */}
        <blockquote
          className="p-3.5 rounded-xl border text-xs leading-relaxed italic opacity-85 font-sans"
          style={{
            backgroundColor: theme.palette.glassSurface,
            borderColor: theme.palette.glassBorder,
            color: theme.palette.textSecondary,
          }}
        >
          “An intelligent system designed to perceive, remember, reason, and act with permission—combining Apple-grade material restraint with spatial depth.”
        </blockquote>

        {/* Build Specifications Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-[11px]">
          <div className="p-2.5 rounded-lg border" style={{ borderColor: theme.palette.glassBorder, backgroundColor: theme.palette.glassSurface }}>
            <div className="text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>AGENT RUNTIME</div>
            <div className="font-semibold mt-0.5" style={{ color: theme.palette.textPrimary }}>Omniel v2.4.2</div>
          </div>
          <div className="p-2.5 rounded-lg border" style={{ borderColor: theme.palette.glassBorder, backgroundColor: theme.palette.glassSurface }}>
            <div className="text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>SPATIAL RENDERER</div>
            <div className="font-semibold mt-0.5" style={{ color: theme.palette.textPrimary }}>Three.js WebGL v3</div>
          </div>
          <div className="p-2.5 rounded-lg border" style={{ borderColor: theme.palette.glassBorder, backgroundColor: theme.palette.glassSurface }}>
            <div className="text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>ACOUSTIC BUFFER</div>
            <div className="font-semibold mt-0.5" style={{ color: theme.palette.textPrimary }}>96kHz FLAC</div>
          </div>
          <div className="p-2.5 rounded-lg border" style={{ borderColor: theme.palette.glassBorder, backgroundColor: theme.palette.glassSurface }}>
            <div className="text-[9px] opacity-50" style={{ color: theme.palette.textMuted }}>ENCLAVE SECURITY</div>
            <div className="font-semibold mt-0.5 text-emerald-500">Tier-0 Hardened</div>
          </div>
        </div>

        <div className="pt-2 border-t flex items-center justify-between text-[11px] opacity-50 font-sans" style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textMuted }}>
          <span>© 2026 Omniel Systems Inc. All rights reserved.</span>
          <span>Open Source Licenses · Apache 2.0</span>
        </div>
      </div>
    </div>
  );
};
