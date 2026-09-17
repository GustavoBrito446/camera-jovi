import React, { useRef, useEffect, useState } from 'react';
import { Preset, AspectRatioType } from '../types';
import { getCssFilterString, getVignetteStyle, getGrainOpacity } from '../utils/filterEngine';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';

interface CameraViewfinderProps {
  activePreset: Preset | null;
  activeRatio: AspectRatioType;
  showGrid: boolean;
  sampleSceneImage: string;
  isTakingPhoto: boolean;
  isWebcamActive: boolean;
  onWebcamReady?: (video: HTMLVideoElement) => void;
  onClearPreset?: () => void;
  onOpenPresets?: () => void;
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  activePreset,
  activeRatio,
  showGrid,
  sampleSceneImage,
  isTakingPhoto,
  isWebcamActive,
  onClearPreset,
  onOpenPresets,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamError, setStreamError] = useState<boolean>(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isWebcamActive && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
          setStreamError(false);
        })
        .catch(() => {
          setStreamError(true);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isWebcamActive]);

  const cssFilter = activePreset ? getCssFilterString(activePreset.adjustments) : 'none';
  const vignette = activePreset
    ? getVignetteStyle(activePreset.adjustments.efeito.vinheta + activePreset.adjustments.otica.vinheta)
    : 'none';
  const grainOpacity = activePreset ? getGrainOpacity(activePreset.adjustments.efeito.granulacao) : 0;

  // Aspect ratio container styles
  let ratioClass = 'aspect-[4/3]';
  if (activeRatio === '1:1') ratioClass = 'aspect-square';
  if (activeRatio === '16:9') ratioClass = 'aspect-[9/16]';

  return (
    <div
      id="camera-viewfinder-container"
      className="relative w-full flex-1 flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Frame wrapper constrained by aspect ratio */}
      <div
        id="camera-frame-wrapper"
        className={`relative w-full max-w-lg ${ratioClass} max-h-[72vh] overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300 shadow-2xl bg-neutral-950 flex items-center justify-center`}
      >
        {/* Live video feed if webcam enabled & working */}
        {isWebcamActive && !streamError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ filter: cssFilter }}
          />
        ) : (
          /* Realistic high quality simulated camera scene (Beach stairs matching Tela inicial.png) */
          <img
            id="camera-scene-feed"
            src={sampleSceneImage}
            alt="Camera Preview"
            className="w-full h-full object-cover pointer-events-none"
            style={{ filter: cssFilter }}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Real-time Vignette effect */}
        {vignette !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity"
            style={{ background: vignette }}
          />
        )}

        {/* Real-time Film Grain effect */}
        {grainOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay bg-repeat"
            style={{
              opacity: grainOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Rule of Thirds 3x3 Camera Grid Lines (thin subtle white lines as in screenshot) */}
        {showGrid && (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10">
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-r border-b border-white/25" />
            <div className="border-b border-white/25" />
            <div className="border-r border-white/25" />
            <div className="border-r border-white/25" />
            <div />
          </div>
        )}

        {/* Active Preset Overlay Pill at top of viewfinder */}
        {activePreset && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/65 backdrop-blur-md border border-[#ca8a04]/60 text-white px-3 py-1.5 rounded-full shadow-lg animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-[#ca8a04] animate-pulse" />
            <span className="text-xs font-semibold text-[#facc15]">{activePreset.name}</span>
            <button
              type="button"
              onClick={onOpenPresets}
              className="text-[10px] text-white/80 hover:text-white underline ml-1"
            >
              Trocar
            </button>
            {onClearPreset && (
              <button
                type="button"
                onClick={onClearPreset}
                className="w-4 h-4 ml-1 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-[10px]"
                title="Desativar preset"
              >
                ×
              </button>
            )}
          </div>
        )}

        {/* Shutter flash animation layer */}
        {isTakingPhoto && (
          <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-300" />
        )}
      </div>
    </div>
  );
};
