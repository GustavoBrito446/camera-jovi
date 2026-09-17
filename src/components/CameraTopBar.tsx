import React from 'react';
import { Zap, Sparkles, Timer, SlidersHorizontal, Users, Settings } from 'lucide-react';

interface CameraTopBarProps {
  flashMode: 'off' | 'on' | 'auto';
  onToggleFlash: () => void;
  timerMode: number;
  onToggleTimer: () => void;
  onOpenPresets: () => void;
  onOpenCommunity: () => void;
  onOpenSettings: () => void;
  hasActivePreset?: boolean;
}

export const CameraTopBar: React.FC<CameraTopBarProps> = ({
  flashMode,
  onToggleFlash,
  timerMode,
  onToggleTimer,
  onOpenPresets,
  onOpenCommunity,
  onOpenSettings,
  hasActivePreset = false,
}) => {
  return (
    <div
      id="camera-top-bar"
      className="w-full flex items-center justify-between px-6 pt-4 pb-3 z-30 select-none"
    >
      {/* Flash */}
      <button
        id="btn-flash"
        type="button"
        onClick={onToggleFlash}
        className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all"
        title="Flash"
      >
        <Zap
          className={`w-5 h-5 ${flashMode === 'on' ? 'fill-yellow-400 text-yellow-400' : flashMode === 'auto' ? 'text-amber-300' : 'text-white/90'}`}
        />
        {flashMode === 'auto' && (
          <span className="text-[9px] font-bold absolute text-amber-300 translate-y-3">A</span>
        )}
      </button>

      {/* Sparkles / Effects */}
      <button
        id="btn-sparkles"
        type="button"
        className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all"
        title="Filtros Criativos"
      >
        <Sparkles className="w-5 h-5 text-white/90" />
      </button>

      {/* Timer */}
      <button
        id="btn-timer"
        type="button"
        onClick={onToggleTimer}
        className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all relative"
        title="Temporizador"
      >
        <Timer className={`w-5 h-5 ${timerMode > 0 ? 'text-amber-400' : 'text-white/90'}`} />
        {timerMode > 0 && (
          <span className="text-[9px] font-bold absolute text-amber-400 -bottom-1">
            {timerMode}s
          </span>
        )}
      </button>

      {/* Presets Button with Gold label - Core Innovation Feature! */}
      <button
        id="btn-presets"
        type="button"
        onClick={onOpenPresets}
        className="flex flex-col items-center justify-center -mt-0.5 px-2 py-1 rounded-xl active:scale-95 transition-all group"
        title="Presets Inteligentes"
      >
        <SlidersHorizontal
          className={`w-5 h-5 ${hasActivePreset ? 'text-[#e5a93b]' : 'text-[#e5a93b]'}`}
        />
        <span className="text-[10px] font-medium tracking-wide text-[#e5a93b] mt-0.5">
          Presets
        </span>
      </button>

      {/* Community / People Icon */}
      <button
        id="btn-community"
        type="button"
        onClick={onOpenCommunity}
        className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all"
        title="Comunidade de Presets"
      >
        <Users className="w-5 h-5 text-white/90" />
      </button>

      {/* Settings */}
      <button
        id="btn-settings"
        type="button"
        onClick={onOpenSettings}
        className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-all"
        title="Configurações da Câmera"
      >
        <Settings className="w-5 h-5 text-white/90" />
      </button>
    </div>
  );
};
