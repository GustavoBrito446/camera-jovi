import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Sun,
  Palette,
  Focus,
  Triangle,
  CircleDot,
  Info,
  RotateCcw,
  History,
  Copy,
  ChevronDown,
  X,
} from 'lucide-react';
import { PresetAdjustments, AdjustmentTab } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { formatParamValue } from '../utils/filterEngine';
import { TOOLTIPS_INFO } from '../data/presetsData';

interface PresetAdjustScreenProps {
  title?: string;
  imageSrc: string;
  adjustments: PresetAdjustments;
  onChangeAdjustments: (adjustments: PresetAdjustments) => void;
  onBack: () => void;
  onConfirm: () => void;
  onReset: () => void;
}

const TABS: { key: AdjustmentTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'luz', label: 'Luz', icon: Sun },
  { key: 'cor', label: 'Cor', icon: Palette },
  { key: 'efeito', label: 'Efeito', icon: Focus },
  { key: 'detalhe', label: 'Detalhe', icon: Triangle },
  { key: 'otica', label: 'Ótica', icon: CircleDot },
];

const COLOR_MIX_PALETTE = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#2563eb', // Blue
  '#a855f7', // Purple
  '#ec4899', // Magenta
];

export const PresetAdjustScreen: React.FC<PresetAdjustScreenProps> = ({
  title = 'NOVO PRESET',
  imageSrc,
  adjustments,
  onChangeAdjustments,
  onBack,
  onConfirm,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<AdjustmentTab>('luz');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showColorMix, setShowColorMix] = useState<boolean>(true);
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  // Helper to update deeply nested adjustment property
  const updateAdjustment = (category: keyof PresetAdjustments, param: string, value: any) => {
    onChangeAdjustments({
      ...adjustments,
      [category]: {
        ...adjustments[category],
        [param]: value,
      },
    });
  };

  const handleCopyAdjustments = () => {
    navigator.clipboard?.writeText(JSON.stringify(adjustments, null, 2));
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  return (
    <div
      id="preset-adjust-screen"
      className="w-full h-full min-h-screen bg-black text-white flex flex-col select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="w-full flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <button
          id="btn-back-adjust"
          type="button"
          onClick={onBack}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Voltar"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold tracking-wider uppercase text-white">{title}</h1>

        <button
          id="btn-confirm-adjust"
          type="button"
          onClick={onConfirm}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Avançar / Salvar"
        >
          <Check className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto px-4 pt-3 pb-8 flex-1 flex flex-col">
        {/* Split Comparison Before/After View */}
        <div className="mb-4 shrink-0">
          <BeforeAfterSlider imageSrc={imageSrc} adjustments={adjustments} heightClass="h-72" />
        </div>

        {/* 5 Adjustment Tabs matching screenshots */}
        <div
          id="adjustment-tabs-row"
          className="grid grid-cols-5 gap-2 mb-6 shrink-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setActiveTooltip(null);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#222222] text-[#e5a93b] shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-[#e5a93b]' : 'text-neutral-300'}`} />
                <span className={`text-[11px] font-medium ${isActive ? 'text-[#e5a93b]' : 'text-neutral-300'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tooltip explanation popup card (matching descriçao.png) */}
        {activeTooltip && (
          <div
            id="tooltip-explanation-card"
            className="w-full bg-[#333333] border border-white/10 rounded-xl p-4 mb-4 relative animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <button
              type="button"
              onClick={() => setActiveTooltip(null)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-semibold text-sm capitalize text-white">{activeTooltip}</span>
              <Info className="w-4 h-4 text-[#e5a93b]" />
            </div>
            <p className="text-xs text-neutral-200 leading-relaxed">
              {TOOLTIPS_INFO[activeTooltip] || 'Ajuste fino de parâmetros visuais da fotografia.'}
            </p>
          </div>
        )}

        {/* Dynamic Tab Sliders */}
        <div className="flex-1 space-y-4 px-1 pb-6">
          {/* TAB: LUZ */}
          {activeTab === 'luz' && (
            <>
              {renderSliderRow(
                'Exposição',
                'exposicao',
                adjustments.luz.exposicao,
                -100,
                100,
                (val) => updateAdjustment('luz', 'exposicao', val),
                () => setActiveTooltip(activeTooltip === 'exposicao' ? null : 'exposicao')
              )}
              {renderSliderRow(
                'Contraste',
                'contraste',
                adjustments.luz.contraste,
                -100,
                100,
                (val) => updateAdjustment('luz', 'contraste', val),
                () => setActiveTooltip(activeTooltip === 'contraste' ? null : 'contraste')
              )}
              {renderSliderRow(
                'Realces',
                'realces',
                adjustments.luz.realces,
                -100,
                100,
                (val) => updateAdjustment('luz', 'realces', val),
                () => setActiveTooltip(activeTooltip === 'realces' ? null : 'realces')
              )}
              {renderSliderRow(
                'Sombras',
                'sombras',
                adjustments.luz.sombras,
                -100,
                100,
                (val) => updateAdjustment('luz', 'sombras', val),
                () => setActiveTooltip(activeTooltip === 'sombras' ? null : 'sombras')
              )}
              {renderSliderRow(
                'Brancos',
                'brancos',
                adjustments.luz.brancos,
                -100,
                100,
                (val) => updateAdjustment('luz', 'brancos', val),
                () => setActiveTooltip(activeTooltip === 'brancos' ? null : 'brancos')
              )}
              {renderSliderRow(
                'Pretos',
                'pretos',
                adjustments.luz.pretos,
                -100,
                100,
                (val) => updateAdjustment('luz', 'pretos', val),
                () => setActiveTooltip(activeTooltip === 'pretos' ? null : 'pretos')
              )}
            </>
          )}

          {/* TAB: COR */}
          {activeTab === 'cor' && (
            <>
              {renderSliderRow(
                'Temperatura',
                'temperatura',
                adjustments.cor.temperatura,
                -100,
                100,
                (val) => updateAdjustment('cor', 'temperatura', val),
                () => setActiveTooltip(activeTooltip === 'temperatura' ? null : 'temperatura')
              )}
              {renderSliderRow(
                'Saturação',
                'saturacao',
                adjustments.cor.saturacao,
                -100,
                100,
                (val) => updateAdjustment('cor', 'saturacao', val),
                () => setActiveTooltip(activeTooltip === 'saturacao' ? null : 'saturacao')
              )}
              {renderSliderRow(
                'Matiz',
                'matiz',
                adjustments.cor.matiz,
                -100,
                100,
                (val) => updateAdjustment('cor', 'matiz', val),
                () => setActiveTooltip(activeTooltip === 'matiz' ? null : 'matiz')
              )}
              {renderSliderRow(
                'Vibração',
                'vibracao',
                adjustments.cor.vibracao,
                -100,
                100,
                (val) => updateAdjustment('cor', 'vibracao', val),
                () => setActiveTooltip(activeTooltip === 'vibracao' ? null : 'vibracao')
              )}

              {/* Mistura de Cores Dropdown Section (matching config criar novo preset-1.png) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowColorMix(!showColorMix)}
                  className="flex items-center justify-between w-full text-xs font-medium text-neutral-300 py-2 hover:text-white"
                >
                  <span>Mistura de cores</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showColorMix ? 'rotate-180' : ''}`}
                  />
                </button>

                {showColorMix && (
                  <div className="flex items-center justify-between pt-2 px-1">
                    {COLOR_MIX_PALETTE.map((hex) => {
                      const isSelected = adjustments.cor.corAtiva === hex;
                      return (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => updateAdjustment('cor', 'corAtiva', hex)}
                          className={`w-6 h-6 rounded-full transition-transform active:scale-90 ${
                            isSelected ? 'ring-2 ring-white scale-110' : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: hex }}
                          title={`Cor ${hex}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB: EFEITO */}
          {activeTab === 'efeito' && (
            <>
              {renderSliderRow(
                'Textura',
                'textura',
                adjustments.efeito.textura,
                -100,
                100,
                (val) => updateAdjustment('efeito', 'textura', val),
                () => setActiveTooltip(activeTooltip === 'textura' ? null : 'textura')
              )}
              {renderSliderRow(
                'Desenbaçar',
                'desembacar',
                adjustments.efeito.desembacar,
                0,
                100,
                (val) => updateAdjustment('efeito', 'desembacar', val),
                () => setActiveTooltip(activeTooltip === 'desembacar' ? null : 'desembacar')
              )}
              {renderSliderRow(
                'Claridade',
                'claridade',
                adjustments.efeito.claridade,
                -100,
                100,
                (val) => updateAdjustment('efeito', 'claridade', val),
                () => setActiveTooltip(activeTooltip === 'claridade' ? null : 'claridade')
              )}
              {renderSliderRow(
                'Vinheta',
                'vinheta',
                adjustments.efeito.vinheta,
                0,
                100,
                (val) => updateAdjustment('efeito', 'vinheta', val),
                () => setActiveTooltip(activeTooltip === 'vinheta' ? null : 'vinheta')
              )}
              {renderSliderRow(
                'Granulação',
                'granulacao',
                adjustments.efeito.granulacao,
                0,
                100,
                (val) => updateAdjustment('efeito', 'granulacao', val),
                () => setActiveTooltip(activeTooltip === 'granulacao' ? null : 'granulacao')
              )}
            </>
          )}

          {/* TAB: DETALHE */}
          {activeTab === 'detalhe' && (
            <>
              {renderSliderRow(
                'Nitidez',
                'nitidez',
                adjustments.detalhe.nitidez,
                0,
                100,
                (val) => updateAdjustment('detalhe', 'nitidez', val),
                () => setActiveTooltip(activeTooltip === 'nitidez' ? null : 'nitidez')
              )}
              {renderSliderRow(
                'Raio',
                'raio',
                adjustments.detalhe.raio,
                0,
                100,
                (val) => updateAdjustment('detalhe', 'raio', val),
                () => setActiveTooltip(activeTooltip === 'raio' ? null : 'raio')
              )}
              {renderSliderRow(
                'Detalhe',
                'detalhe',
                adjustments.detalhe.detalhe,
                -100,
                100,
                (val) => updateAdjustment('detalhe', 'detalhe', val),
                () => setActiveTooltip(activeTooltip === 'detalhe' ? null : 'detalhe')
              )}
              {renderSliderRow(
                'Mascara',
                'mascara',
                adjustments.detalhe.mascara,
                0,
                100,
                (val) => updateAdjustment('detalhe', 'mascara', val),
                () => setActiveTooltip(activeTooltip === 'mascara' ? null : 'mascara')
              )}
              {renderSliderRow(
                'Redução de ruido',
                'reducaoRuido',
                adjustments.detalhe.reducaoRuido,
                0,
                100,
                (val) => updateAdjustment('detalhe', 'reducaoRuido', val),
                () => setActiveTooltip(activeTooltip === 'reducaoRuido' ? null : 'reducaoRuido')
              )}
            </>
          )}

          {/* TAB: ÓTICA */}
          {activeTab === 'otica' && (
            <>
              <div className="text-xs font-semibold text-neutral-300 pt-1 pb-1">Correções de lente</div>

              {/* Toggles (matching config criar novo preset-3.png) */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-neutral-200">Remover aberração cromatica</span>
                <button
                  type="button"
                  onClick={() =>
                    updateAdjustment('otica', 'removerAberracao', !adjustments.otica.removerAberracao)
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    adjustments.otica.removerAberracao ? 'bg-[#ca8a04]' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      adjustments.otica.removerAberracao ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-xs text-neutral-200">Ativar correção de perfil</span>
                <button
                  type="button"
                  onClick={() =>
                    updateAdjustment('otica', 'correcaoPerfil', !adjustments.otica.correcaoPerfil)
                  }
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    adjustments.otica.correcaoPerfil ? 'bg-[#ca8a04]' : 'bg-neutral-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      adjustments.otica.correcaoPerfil ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="text-xs font-semibold text-neutral-300 pt-3 pb-1">Distorção</div>
              {renderSliderRow(
                'Remover distorção',
                'distorcao',
                adjustments.otica.distorcao,
                -100,
                100,
                (val) => updateAdjustment('otica', 'distorcao', val),
                () => setActiveTooltip(activeTooltip === 'distorcao' ? null : 'distorcao')
              )}

              {renderSliderRow(
                'Vinheta',
                'vinheta',
                adjustments.otica.vinheta,
                0,
                100,
                (val) => updateAdjustment('otica', 'vinheta', val),
                () => setActiveTooltip(activeTooltip === 'vinheta' ? null : 'vinheta')
              )}

              {renderSliderRow(
                'Desfoque nas bordas',
                'desfoqueBordas',
                adjustments.otica.desfoqueBordas,
                0,
                50,
                (val) => updateAdjustment('otica', 'desfoqueBordas', val),
                () => setActiveTooltip(activeTooltip === 'desfoqueBordas' ? null : 'desfoqueBordas')
              )}
            </>
          )}
        </div>

        {/* Bottom Actions Row: Redefinir, Histórico, Copiar Ajustes */}
        <div
          id="adjust-bottom-actions"
          className="w-full flex items-center justify-between pt-4 border-t border-white/10 shrink-0 text-neutral-300 text-xs"
        >
          <button
            type="button"
            onClick={onReset}
            className="flex flex-col items-center gap-1 hover:text-white active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Redefinir</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex flex-col items-center gap-1 hover:text-white active:scale-95 transition-transform"
          >
            <History className="w-5 h-5" />
            <span>Historico</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAdjustments}
            className="flex flex-col items-center gap-1 hover:text-white active:scale-95 transition-transform relative"
          >
            <Copy className="w-5 h-5" />
            <span>Copiar ajustes</span>
            {copyToast && (
              <span className="absolute -top-7 whitespace-nowrap bg-[#ca8a04] text-black font-semibold text-[10px] px-2 py-0.5 rounded shadow">
                Copiado!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl w-full max-w-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#ca8a04]" /> Histórico de Ajustes
              </h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="p-2 bg-neutral-900 rounded-lg flex items-center justify-between border-l-2 border-[#ca8a04]">
                <span>Ajuste Atual</span>
                <span className="text-[10px] text-neutral-500">Agora</span>
              </div>
              <div className="p-2 bg-neutral-900/60 rounded-lg flex items-center justify-between text-neutral-400">
                <span>Contraste & Realces</span>
                <span className="text-[10px] text-neutral-500">1 min atrás</span>
              </div>
              <div className="p-2 bg-neutral-900/40 rounded-lg flex items-center justify-between text-neutral-500">
                <span>Preset Base carregado</span>
                <span className="text-[10px] text-neutral-600">Início</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper renderer for each adjustment slider row matching screenshots
function renderSliderRow(
  label: string,
  paramKey: string,
  value: number,
  min: number,
  max: number,
  onChange: (val: number) => void,
  onInfoClick?: () => void
) {
  const displayVal = formatParamValue(paramKey, value);

  return (
    <div key={paramKey} className="w-full space-y-1">
      {/* Label and formatted value header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-neutral-200">{label}</span>
          {onInfoClick && (
            <button
              type="button"
              onClick={onInfoClick}
              className="text-neutral-400 hover:text-[#e5a93b] p-0.5 rounded transition-colors"
              title={`Ajuda sobre ${label}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <span className="text-neutral-300 font-mono text-xs">{displayVal}</span>
      </div>

      {/* Camera Slider Input */}
      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="camera-slider w-full"
        />
        {/* Subtle center zero tick for bidirectional sliders */}
        {min < 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/40 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
