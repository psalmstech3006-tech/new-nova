import React, { useState } from 'react';
import { useNovaSettings } from '../../../context/NovaSettingsContext';
import { useNova } from '../../../context/NovaStateContext';

export const VoiceAudioSection: React.FC = () => {
  const { voiceSettings, updateVoice, audioSettings, updateAudio } = useNovaSettings();
  const { theme, isListening, audioLevel, addToast } = useNova();
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const handleTestVoice = () => {
    setIsPlayingTest(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance('NOVA voice synthesis online. All acoustic filters nominal.');
      utterance.rate = voiceSettings.speed;
      utterance.pitch = voiceSettings.pitch;
      utterance.onend = () => setIsPlayingTest(false);
      utterance.onerror = () => setIsPlayingTest(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingTest(false), 1200);
    }
    addToast('Voice Preview', `Synthesizing sample with ${voiceSettings.selectedVoice}.`, 'info');
  };

  const voices = [
    { id: 'aurora', name: 'Nova Aurora', style: 'Calm & Warm (Default)', desc: 'Human-like cadence with natural breath pauses.' },
    { id: 'orion', name: 'Nova Orion', style: 'Deep & Authoritative', desc: 'Resonant, measured cadence for engineering analysis.' },
    { id: 'astra', name: 'Nova Astra', style: 'Crisp & Professional', desc: 'Fast, clinical enunciation for rapid briefings.' },
    { id: 'zephyr', name: 'Nova Zephyr', style: 'Quiet & Contemplative', desc: 'Gentle, low-dynamics voice ideal for night focus.' },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <h2 className="text-base font-medium tracking-tight" style={{ color: theme.palette.textPrimary }}>
          Voice Synthesis &amp; Acoustic Hardware
        </h2>
        <p className="text-xs leading-relaxed mt-0.5" style={{ color: theme.palette.textSecondary }}>
          Configure neural speech synthesis, hardware I/O device routing, noise cancellation, and microphone activity thresholds.
        </p>
      </div>

      {/* Voice Selection & Preview */}
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
            Neural Voice Models
          </span>
          <button
            onClick={handleTestVoice}
            className="px-3 py-1 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: theme.palette.glassSurface,
              borderColor: theme.palette.glassBorder,
              color: theme.palette.textPrimary,
            }}
          >
            <i className={`fa-solid ${isPlayingTest ? 'fa-waveform animate-pulse text-amber-500' : 'fa-play text-[10px]'}`} />
            <span>{isPlayingTest ? 'Playing...' : 'Test Voice'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {voices.map((v) => {
            const isSelected = voiceSettings.selectedVoice.includes(v.name);
            return (
              <div
                key={v.id}
                onClick={() => updateVoice('selectedVoice', `${v.name} (${v.style})`)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'ring-1 scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                style={{
                  backgroundColor: isSelected ? theme.palette.glassSurface : 'transparent',
                  borderColor: isSelected ? theme.palette.accent : theme.palette.glassBorder,
                  boxShadow: isSelected ? `0 8px 20px -5px ${theme.palette.glow}` : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: theme.palette.textPrimary }}>
                      {v.name}
                    </span>
                    <span className="text-[9px] font-mono opacity-60" style={{ color: theme.palette.accent }}>
                      {v.style}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-60" style={{ color: theme.palette.textSecondary }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Speed, Pitch, Volume sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: theme.palette.textSecondary }}>
              <span>Speaking Speed</span>
              <span className="font-mono text-xs font-medium" style={{ color: theme.palette.accent }}>
                {voiceSettings.speed}x
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={voiceSettings.speed}
              onChange={(e) => updateVoice('speed', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: theme.palette.textSecondary }}>
              <span>Vocal Pitch</span>
              <span className="font-mono text-xs font-medium" style={{ color: theme.palette.accent }}>
                {voiceSettings.pitch}x
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={voiceSettings.pitch}
              onChange={(e) => updateVoice('pitch', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: theme.palette.textSecondary }}>
              <span>Output Volume</span>
              <span className="font-mono text-xs font-medium" style={{ color: theme.palette.accent }}>
                {voiceSettings.volume}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={voiceSettings.volume}
              onChange={(e) => updateVoice('volume', Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Hardware I/O Routing & Live Acoustic Meters */}
      <div
        className="p-5 rounded-2xl border space-y-4"
        style={{
          backgroundColor: theme.palette.bgElevated,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 10px 25px -5px ${theme.palette.ambientShadow}, inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        <span className="text-[11px] font-mono uppercase tracking-wider block opacity-70" style={{ color: theme.palette.accent }}>
          Acoustic Hardware &amp; VAD Calibration
        </span>

        {/* Live Audio Activity Meter */}
        <div
          className="p-3.5 rounded-xl border flex items-center justify-between"
          style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${isListening ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500 opacity-40'}`}
            />
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                {isListening ? 'Microphone Active · Listening' : 'Microphone Inactive · Push SPACE to Speak'}
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Live Input Meter: {Math.round(audioLevel * 100)}% signal
              </div>
            </div>
          </div>
          {/* Signal bar */}
          <div className="w-32 h-2 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${Math.min(100, Math.max(4, audioLevel * 100))}%`,
                backgroundColor: isListening ? '#10b981' : theme.palette.accent,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Input Device (Microphone)
            </label>
            <select
              value={audioSettings.inputDevice}
              onChange={(e) => updateAudio('inputDevice', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="Default Studio Array (Built-in)">Default Studio Array (Built-in)</option>
              <option value="External USB Condenser">External USB Condenser (96kHz)</option>
              <option value="Bluetooth Headset Mic">Bluetooth Spatial Mic</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: theme.palette.textPrimary }}>
              Output Device (Speakers)
            </label>
            <select
              value={audioSettings.outputDevice}
              onChange={(e) => updateAudio('outputDevice', e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border bg-transparent outline-none font-sans"
              style={{ borderColor: theme.palette.glassBorder, color: theme.palette.textPrimary }}
            >
              <option value="System Spatial Speakers">System Spatial Speakers</option>
              <option value="External Studio Monitors">External Studio Monitors</option>
              <option value="Headphones (DAC)">High-Res USB DAC</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Neural Noise Suppression
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Real-time isolation of voice acoustics from mechanical keyboards and fan noise.
              </div>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.noiseSuppression}
              onChange={(e) => updateAudio('noiseSuppression', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium" style={{ color: theme.palette.textPrimary }}>
                Acoustic Media Ducking
              </div>
              <div className="text-[11px] opacity-60" style={{ color: theme.palette.textSecondary }}>
                Temporarily lower system background music while NOVA is speaking.
              </div>
            </div>
            <input
              type="checkbox"
              checked={audioSettings.audioDucking}
              onChange={(e) => updateAudio('audioDucking', e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-slate-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
