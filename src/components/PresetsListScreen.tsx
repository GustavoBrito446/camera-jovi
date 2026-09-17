import React from 'react';
import { ArrowLeft, CheckCircle2, Pencil, Plus } from 'lucide-react';
import { Preset } from '../types';

interface PresetsListScreenProps {
  presets: Preset[];
  activePresetId: string | null;
  onSelectPreset: (preset: Preset) => void;
  onEditPreset: (preset: Preset) => void;
  onAddNewPreset: () => void;
  onBack: () => void;
}

export const PresetsListScreen: React.FC<PresetsListScreenProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onEditPreset,
  onAddNewPreset,
  onBack,
}) => {
  return (
    <div
      id="presets-list-screen"
      className="w-full h-full min-h-screen bg-black text-white flex flex-col px-4 sm:px-6 pt-4 pb-10 select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="relative flex items-center justify-center py-4 mb-2">
        <button
          id="btn-back-presets"
          type="button"
          onClick={onBack}
          className="absolute left-0 p-2 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-wider uppercase text-white">PRESETS</h1>
      </div>

      {/* Subtitle */}
      <p className="text-neutral-400 text-xs text-center max-w-xs mx-auto mb-6 leading-relaxed">
        Use presets inteligentes para alcançar a foto perfeita em poucos toques
      </p>

      {/* Presets List */}
      <div className="w-full max-w-md mx-auto space-y-3.5 pb-6">
        {presets.map((preset) => {
          const isSelected = activePresetId === preset.id;
          return (
            <div
              key={preset.id}
              id={`preset-card-${preset.id}`}
              onClick={() => onSelectPreset(preset)}
              className={`relative flex items-center gap-3.5 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#18181b] border-2 border-[#ca8a04] shadow-[0_0_15px_rgba(202,138,4,0.18)]'
                  : 'bg-[#18181b] border border-white/5 hover:border-white/15'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 sm:w-24 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-900">
                <img
                  src={preset.coverImage || preset.sampleImage}
                  alt={preset.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-base font-bold text-white tracking-wide truncate">
                  {preset.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-snug line-clamp-2">
                  {preset.description || 'Configurações visuais personalizadas para sua câmera.'}
                </p>
              </div>

              {/* Selected Icons (Checkmark & Pencil Edit button as shown in screenshot) */}
              {isSelected ? (
                <div className="flex flex-col items-center justify-between gap-3 shrink-0 pr-1">
                  {/* Gold Checkmark */}
                  <CheckCircle2 className="w-6 h-6 text-[#ca8a04]" />

                  {/* Gold Edit Pencil with Sparkle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPreset(preset);
                    }}
                    className="p-1 text-[#ca8a04] hover:text-amber-300 active:scale-90 transition-transform"
                    title="Editar Preset"
                  >
                    <Pencil className="w-5 h-5 fill-[#ca8a04]/20" />
                  </button>
                </div>
              ) : (
                /* Non-selected pencil for quick edit */
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPreset(preset);
                  }}
                  className="p-2 text-neutral-500 hover:text-neutral-300 opacity-0 group-hover:opacity-100 sm:opacity-40 transition-opacity"
                  title="Editar Preset"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* "+ Adicionar novo" Card Button (matching screenshot) */}
        <button
          id="btn-add-new-preset-card"
          type="button"
          onClick={onAddNewPreset}
          className="w-full h-24 rounded-2xl bg-[#18181b] border border-white/10 hover:border-[#ca8a04]/60 hover:bg-[#1f1f23] flex flex-col items-center justify-center gap-1 text-white active:scale-[0.99] transition-all group"
        >
          <Plus className="w-7 h-7 text-[#ca8a04] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium tracking-wide text-white/90">Adicionar novo</span>
        </button>
      </div>
    </div>
  );
};
