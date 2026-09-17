import React from 'react';
import { RotateCcw } from 'lucide-react';
import { AspectRatioType, CameraModeType } from '../types';

interface CameraBottomBarProps {
  activeRatio: AspectRatioType;
  onChangeRatio: (ratio: AspectRatioType) => void;
  activeMode: CameraModeType;
  onChangeMode: (mode: CameraModeType) => void;
  onShutter: () => void;
  onSwitchCamera: () => void;
  onOpenGallery: () => void;
  lastPhotoThumb?: string;
  isTakingPhoto?: boolean;
}

const MODES: CameraModeType[] = ['Noturno', 'Retrato', 'Foto', 'Vídeo', 'Ultra HD'];

export const CameraBottomBar: React.FC<CameraBottomBarProps> = ({
  activeRatio,
  onChangeRatio,
  activeMode,
  onChangeMode,
  onShutter,
  onSwitchCamera,
  onOpenGallery,
  lastPhotoThumb,
  isTakingPhoto = false,
}) => {
  return (
    <div id="camera-bottom-bar" className="w-full flex flex-col items-center pt-2 pb-6 z-30 select-none">
      {/* Aspect Ratio Selector Pill */}
      <div
        id="aspect-ratio-selector"
        className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-4"
      >
        {(['1:1', '4:3', '16:9'] as AspectRatioType[]).map((ratio) => (
          <button
            key={ratio}
            type="button"
            onClick={() => onChangeRatio(ratio)}
            className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
              activeRatio === ratio
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>

      {/* Camera Modes Carousel */}
      <div
        id="camera-modes-carousel"
        className="w-full flex items-center justify-center gap-6 overflow-x-auto no-scrollbar py-2 px-4 mb-5"
      >
        {MODES.map((mode) => {
          const isActive = activeMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onChangeMode(mode)}
              className={`text-sm tracking-wide whitespace-nowrap transition-all ${
                isActive
                  ? 'font-bold text-white scale-105 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                  : 'font-medium text-neutral-400 hover:text-neutral-300'
              }`}
            >
              {mode}
            </button>
          );
        })}
      </div>

      {/* Main Action Row: Gallery Thumbnail, Shutter Button, Switch Camera */}
      <div id="camera-action-row" className="w-full flex items-center justify-around px-8 max-w-sm">
        {/* Left: Gallery Thumbnail */}
        <button
          id="btn-gallery-thumb"
          type="button"
          onClick={onOpenGallery}
          className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shadow-md bg-neutral-900 active:scale-95 transition-transform"
          title="Galeria de Fotos"
        >
          {lastPhotoThumb ? (
            <img
              src={lastPhotoThumb}
              alt="Última foto"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
              IMG
            </div>
          )}
        </button>

        {/* Center: Shutter Button (Double Ring) */}
        <button
          id="btn-shutter"
          type="button"
          onClick={onShutter}
          disabled={isTakingPhoto}
          className="relative w-18 h-18 rounded-full border-[3.5px] border-white flex items-center justify-center active:scale-95 transition-transform group shadow-lg"
          title="Capturar Foto"
        >
          <div
            className={`w-14 h-14 rounded-full bg-white transition-transform ${
              isTakingPhoto ? 'scale-75 bg-amber-400' : 'group-hover:scale-95'
            }`}
          />
        </button>

        {/* Right: Camera Flip / Switch Button */}
        <button
          id="btn-switch-camera"
          type="button"
          onClick={onSwitchCamera}
          className="w-12 h-12 rounded-full bg-neutral-900/80 border border-white/15 flex items-center justify-center text-white/90 hover:text-white active:scale-95 transition-transform shadow-md"
          title="Alternar Câmera / Cenário"
        >
          <RotateCcw className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </div>
  );
};
