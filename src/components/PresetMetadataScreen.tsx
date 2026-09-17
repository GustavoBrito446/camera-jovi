import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Columns2,
  Car,
  User,
  Building2,
  Moon,
  Clapperboard,
  Mountain,
  Plus,
  Globe,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { Preset, PresetCategory, PresetAdjustments } from '../types';
import { getCssFilterString, getVignetteStyle, getGrainOpacity } from '../utils/filterEngine';
import { SAMPLE_IMAGES } from '../data/presetsData';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface PresetMetadataScreenProps {
  title?: string;
  imageSrc: string;
  adjustments: PresetAdjustments;
  initialPreset?: Partial<Preset>;
  onBack: () => void;
  onSave: (presetData: {
    name: string;
    description: string;
    category: PresetCategory;
    coverImage: string;
    visibility: 'Publico' | 'Privado';
  }) => void;
}

const CATEGORIES: { name: PresetCategory; icon: React.FC<{ className?: string }> }[] = [
  { name: 'Carro', icon: Car },
  { name: 'Retrato', icon: User },
  { name: 'Urbano', icon: Building2 },
  { name: 'Noturno', icon: Moon },
  { name: 'Filme', icon: Clapperboard },
  { name: 'Paisagem', icon: Mountain },
];

export const PresetMetadataScreen: React.FC<PresetMetadataScreenProps> = ({
  title = 'NOVO PRESET',
  imageSrc,
  adjustments,
  initialPreset,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState<string>(initialPreset?.name || '');
  const [description, setDescription] = useState<string>(initialPreset?.description || '');
  const [category, setCategory] = useState<PresetCategory>(initialPreset?.category || 'Carro');
  const [coverImage, setCoverImage] = useState<string>(
    initialPreset?.coverImage || imageSrc || SAMPLE_IMAGES.porscheRain
  );
  const [visibility, setVisibility] = useState<'Publico' | 'Privado'>('Publico');
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showCoverPicker, setShowCoverPicker] = useState<boolean>(false);

  const cssFilter = getCssFilterString(adjustments);
  const vignette = getVignetteStyle(adjustments.efeito.vinheta + adjustments.otica.vinheta);
  const grainOpacity = getGrainOpacity(adjustments.efeito.granulacao);

  const handleFinish = () => {
    onSave({
      name: name.trim() || (category === 'Carro' ? 'car and rain' : `Preset ${category}`),
      description: description.trim(),
      category,
      coverImage,
      visibility,
    });
  };

  return (
    <div
      id="preset-metadata-screen"
      className="w-full h-full min-h-screen bg-black text-white flex flex-col select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <button
          id="btn-back-meta"
          type="button"
          onClick={onBack}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold tracking-wider uppercase text-white">{title}</h1>

        <button
          id="btn-save-preset"
          type="button"
          onClick={handleFinish}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Salvar Preset"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto px-5 pt-3 pb-10 space-y-5">
        {/* Top Preview Card with "Comparar" Pill button */}
        <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
          <img
            src={coverImage}
            alt="Preset Preview"
            className="w-full h-full object-cover"
            style={{ filter: cssFilter }}
            referrerPolicy="no-referrer"
          />

          {vignette !== 'none' && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: vignette }} />
          )}

          {grainOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-repeat"
              style={{
                opacity: grainOpacity,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          )}

          {/* "Comparar" Button Pill (as shown in tela add preset.png) */}
          <button
            id="btn-compare-preview"
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Comparar</span>
          </button>
        </div>

        {/* Nome do Preset Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-200">Nome do preset</label>
          <input
            id="input-preset-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex:: car and rain"
            className="w-full bg-[#222222] border border-white/5 focus:border-[#ca8a04] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>

        {/* Categoria Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-200">Categoria</label>
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#242424] text-white border border-[#ca8a04] shadow-sm'
                      : 'bg-[#18181b] text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-[#e5a93b]' : 'text-neutral-400'}`} />
                  <span className="text-[11px] font-medium">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Descrição (opcional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-200">Descrição (opcional)</label>
          <input
            id="input-preset-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Fale sobre clima, iluminação, condiçoes para usar o preset"
            className="w-full bg-[#222222] border border-white/5 focus:border-[#ca8a04] rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>

        {/* Imagem de Capa (matching tela add preset.png) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-200">Imagem de capa</label>
          <div className="flex items-center gap-3">
            {/* Current Cover */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-[#ca8a04] bg-neutral-900 shrink-0">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Plus Card to pick photo */}
            <button
              id="btn-pick-cover"
              type="button"
              onClick={() => setShowCoverPicker(true)}
              className="w-20 h-20 rounded-2xl bg-[#222222] border border-white/10 hover:border-[#ca8a04]/60 flex items-center justify-center text-white active:scale-95 transition-all"
              title="Trocar imagem de capa"
            >
              <Plus className="w-6 h-6 text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Visibilidade Dropdown (matching tela add preset.png) */}
        <div className="space-y-1.5 relative">
          <label className="text-xs font-semibold text-neutral-200">Visibilidade</label>
          <button
            type="button"
            onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
            className="w-full bg-[#222222] border border-white/5 hover:border-white/15 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-white"
          >
            <div className="flex items-center gap-2">
              {visibility === 'Publico' ? (
                <Globe className="w-4 h-4 text-neutral-300" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-300" />
              )}
              <span>{visibility}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform ${
                showVisibilityDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showVisibilityDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#262626] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setVisibility('Publico');
                  setShowVisibilityDropdown(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2 text-xs text-left hover:bg-neutral-800 text-white"
              >
                <Globe className="w-4 h-4 text-neutral-300" />
                <div>
                  <div className="font-semibold">Público</div>
                  <div className="text-[10px] text-neutral-400">
                    Disponível para a comunidade descobrir e usar
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibility('Privado');
                  setShowVisibilityDropdown(false);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-2 text-xs text-left hover:bg-neutral-800 text-white border-t border-white/5"
              >
                <Lock className="w-4 h-4 text-neutral-300" />
                <div>
                  <div className="font-semibold">Privado</div>
                  <div className="text-[10px] text-neutral-400">
                    Visível apenas na sua biblioteca pessoal
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4">
          <div className="flex items-center justify-between py-2 mb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Comparativo Antes / Depois
            </h3>
            <button
              type="button"
              onClick={() => setShowCompareModal(false)}
              className="text-white bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-xs"
            >
              Fechar
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <BeforeAfterSlider imageSrc={coverImage} adjustments={adjustments} heightClass="h-96" />
          </div>
        </div>
      )}

      {/* Cover Image Picker Modal */}
      {showCoverPicker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl w-full max-w-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Escolher Imagem de Amostra</h3>
              <button
                type="button"
                onClick={() => setShowCoverPicker(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Fechar
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SAMPLE_IMAGES).slice(0, 9).map(([key, url]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCoverImage(url);
                    setShowCoverPicker(false);
                  }}
                  className="w-full aspect-square rounded-xl overflow-hidden hover:ring-2 hover:ring-[#ca8a04] transition-all bg-neutral-900"
                >
                  <img src={url} alt={key} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
