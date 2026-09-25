import React, { useState } from 'react';
import { useNova } from '../context/NovaStateContext';

export const VoicePill: React.FC = () => {
  const { currentScreen, isListening, toggleListening, theme, setCommandPaletteOpen, dispatchTask } = useNova();
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      dispatchTask(inputValue.trim());
      setInputValue('');
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none">
      <div
        className="flex items-center space-x-3 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-3xl transition-all duration-300"
        style={{
          backgroundColor: theme.palette.glassSurface,
          borderColor: theme.palette.glassBorder,
          boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 ${theme.palette.glassHighlight}`,
        }}
      >
        {/* Acoustic Listener Button */}
        <button
          onClick={toggleListening}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 border ${
            isListening ? 'scale-105 shadow-md' : 'hover:scale-105'
          }`}
          style={{
            backgroundColor: isListening ? '#f59e0b' : theme.palette.accent,
            color: isListening ? '#ffffff' : theme.isDark ? '#090a0d' : '#ffffff',
            borderColor: theme.palette.glassBorder,
          }}
          title={isListening ? 'Stop Listening (Space to release)' : 'Activate Acoustic Listener (Hold Space)'}
        >
          <i className={`fa-solid ${isListening ? 'fa-waveform' : 'fa-microphone'} text-xs`} />
        </button>

        {/* Input prompt / interactive text */}
        <div className="flex items-center space-x-2 text-xs font-sans pr-3 border-r min-w-[240px]" style={{ borderColor: theme.palette.glassBorder }}>
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => !inputValue && setIsEditing(false)}
              autoFocus
              placeholder="Type command or prompt..."
              className="bg-transparent outline-none w-full text-xs font-sans placeholder:opacity-40"
              style={{ color: theme.palette.textPrimary }}
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="cursor-text transition-colors flex items-center gap-2 w-full truncate opacity-70 hover:opacity-100"
              style={{ color: theme.palette.textPrimary }}
            >
              {isListening ? (
                <span className="font-medium flex items-center gap-1.5 text-amber-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Listening... Say &quot;Hey Nova&quot; or speak prompt
                </span>
              ) : currentScreen === 'runtime' ? (
                <span>System architecture nominal. Ready for commands...</span>
              ) : (
                <span>Invoke capability or ask Nova...</span>
              )}
            </div>
          )}
        </div>

        {/* Quick Hotkey Indicator & Command Trigger */}
        <div className="flex items-center space-x-2 text-[10px] font-sans opacity-50" style={{ color: theme.palette.textSecondary }}>
          <span className="flex items-center gap-1">
            <kbd
              className="px-1.5 py-0.5 rounded text-[9px] border font-mono"
              style={{ backgroundColor: theme.palette.glassSurface, borderColor: theme.palette.glassBorder }}
            >
              ⌘K
            </kbd>
          </span>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:opacity-100 cursor-pointer"
            title="Command Registry"
          >
            <i className="fa-solid fa-plus text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
