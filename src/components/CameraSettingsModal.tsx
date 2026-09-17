import React from 'react';
import { X, Camera, Grid, Image, Smartphone, Monitor, Info } from 'lucide-react';
import { SAMPLE_IMAGES } from '../data/presetsData';

interface CameraSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  isWebcamActive: boolean;
  onToggleWebcam: () => void;
  currentSceneKey: string;
  onSelectScene: (key: string, url: string) => void;
  isMobileFramed: boolean;
  onToggleMobileFrame: () => void;
}

const SCENES: { key: string; label: string; url: string }[] = [
  { key: 'beach', label: 'Praia / Escadaria (Tela Inicial)', url: SAMPLE_IMAGES.beachStairs },
  { key: 'porsche', label: 'Porsche na Chuva (Novo Preset)', url: SAMPLE_IMAGES.porscheRain },
  { key: 'marbles', label: 'Bolas de Gude (Detalhe)', url: SAMPLE_IMAGES.marbles },
  { key: 'portrait', label: 'Retrato Ruiva', url: SAMPLE_IMAGES.portraitRedhead },
  { key: 'urban', label: 'Urbano Noturno', url: SAMPLE_IMAGES.urbanNight },
];

export const CameraSettingsModal: React.FC<CameraSettingsModalProps> = ({
  isOpen,
  onClose,
  showGrid,
  onToggleGrid,
  isWebcamActive,
  onToggleWebcam,
  currentSceneKey,
  onSelectScene,
  isMobileFramed,
  onToggleMobileFrame,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white select-none">
      <div className="bg-[#18181b] border border-white/10 rounded-3xl w-full max-w-sm p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#ca8a04]" /> Configurações da Câmera
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Source Switch */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">Fonte da Imagem</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                if (isWebcamActive) onToggleWebcam();
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                !isWebcamActive
                  ? 'bg-[#242424] border-[#ca8a04] text-[#e5a93b]'
                  : 'bg-neutral-900 border-white/5 text-neutral-400'
              }`}
            >
              <Image className="w-3.5 h-3.5" /> Cenários HD
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isWebcamActive) onToggleWebcam();
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                isWebcamActive
                  ? 'bg-[#242424] border-[#ca8a04] text-[#e5a93b]'
                  : 'bg-neutral-900 border-white/5 text-neutral-400'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Câmera Real
            </button>
          </div>
        </div>

        {/* Scene Selection */}
        {!isWebcamActive && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">Cenário Fotográfico</label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {SCENES.map((scene) => (
                <button
                  key={scene.key}
                  type="button"
                  onClick={() => onSelectScene(scene.key, scene.url)}
                  className={`w-full py-2 px-3 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                    currentSceneKey === scene.key
                      ? 'bg-[#242424] border-[#ca8a04] text-white'
                      : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>{scene.label}</span>
                  {currentSceneKey === scene.key && (
                    <span className="w-2 h-2 rounded-full bg-[#ca8a04]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View Options */}
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-neutral-300 flex items-center gap-2">
              <Grid className="w-4 h-4 text-neutral-400" /> Grade 3x3 da Câmera
            </span>
            <button
              type="button"
              onClick={onToggleGrid}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                showGrid ? 'bg-[#ca8a04]' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  showGrid ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-neutral-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-neutral-400" /> Moldura Mobile First
            </span>
            <button
              type="button"
              onClick={onToggleMobileFrame}
              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                isMobileFramed ? 'bg-[#ca8a04]' : 'bg-neutral-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                  isMobileFramed ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Challenge Footer */}
        <div className="bg-neutral-950/70 rounded-xl p-2.5 border border-white/5 text-[10px] text-neutral-400 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[#ca8a04] shrink-0 mt-0.5" />
          <p leading-relaxed>
            Inovação para câmera de smartphones desenvolvida para o Desafio FIAP: Presets fotográficos integrados na captura e compartilháveis.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-[#ca8a04] hover:bg-amber-600 text-black font-bold rounded-xl text-xs transition-colors"
        >
          Concluído
        </button>
      </div>
    </div>
  );
};
