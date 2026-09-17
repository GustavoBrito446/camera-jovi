import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PresetAdjustments } from '../types';
import { getCssFilterString, getVignetteStyle, getGrainOpacity } from '../utils/filterEngine';

interface BeforeAfterSliderProps {
  imageSrc: string;
  adjustments: PresetAdjustments;
  className?: string;
  heightClass?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  imageSrc,
  adjustments,
  className = '',
  heightClass = 'h-72 sm:h-80',
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  }, [handleMove]);

  const stopDragging = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    const onTouchEnd = () => stopDragging();
    const onMouseUp = () => stopDragging();

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleTouchMove, handleMouseMove, stopDragging]);

  const cssFilter = getCssFilterString(adjustments);
  const vignette = getVignetteStyle(adjustments.efeito.vinheta + adjustments.otica.vinheta);
  const grainOpacity = getGrainOpacity(adjustments.efeito.granulacao);

  return (
    <div
      id="before-after-container"
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-neutral-900 select-none shadow-md ${heightClass} ${className}`}
      onMouseDown={(e) => {
        isDraggingRef.current = true;
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        isDraggingRef.current = true;
        if (e.touches.length > 0) handleMove(e.touches[0].clientX);
      }}
    >
      {/* "Antes" Pill Top-Left */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <span className="bg-black/55 text-white/90 backdrop-blur-md text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
          Antes
        </span>
      </div>

      {/* "Depois" Pill Top-Right */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <span className="bg-black/55 text-white/90 backdrop-blur-md text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
          Depois
        </span>
      </div>

      {/* Full "Depois" (Filtered) Image at base */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={imageSrc}
          alt="Depois"
          className="w-full h-full object-cover"
          style={{ filter: cssFilter }}
          referrerPolicy="no-referrer"
        />

        {/* Vignette Overlay */}
        {vignette !== 'none' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: vignette }}
          />
        )}

        {/* Grain/Noise Overlay */}
        {grainOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-repeat"
            style={{
              opacity: grainOpacity,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>

      {/* Clipped "Antes" (Original Unfiltered) Image overlay */}
      <div
        className="absolute inset-y-0 left-0 overflow-hidden z-10"
        style={{ width: `${sliderPos}%` }}
      >
        <div
          className="relative h-full"
          style={{
            width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
          }}
        >
          <img
            src={imageSrc}
            alt="Antes"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Divider Line */}
      <div
        className="absolute inset-y-0 z-20 pointer-events-none flex items-center justify-center"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* White vertical bar */}
        <div className="w-[1.5px] h-full bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.6)]" />

        {/* Circular Split-Handle with ◐ icon matching screenshot */}
        <div
          id="split-handle"
          className="absolute w-7 h-7 rounded-full bg-white text-black shadow-lg flex items-center justify-center cursor-ew-resize pointer-events-auto active:scale-110 transition-transform"
        >
          <svg className="w-5 h-5 text-neutral-900" viewBox="0 0 24 24" fill="currentColor">
            {/* Half filled circle (Left transparent/outline, Right solid) */}
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8v16z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
