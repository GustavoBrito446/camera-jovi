import { PresetAdjustments } from '../types';

export function getCssFilterString(adjustments: PresetAdjustments): string {
  const { luz, cor, efeito, detalhe } = adjustments;

  // Exposure calculation: maps slider value (-100 to 100) to brightness multiplier
  const brightnessVal = 1 + luz.exposicao * 0.008 + luz.brancos * 0.003 + luz.sombras * 0.002;
  const contrastVal = 1 + luz.contraste * 0.009 + efeito.claridade * 0.004 - luz.realces * 0.002;
  const saturateVal = Math.max(0, 1 + cor.saturacao * 0.01 + cor.vibracao * 0.006);
  const hueVal = cor.matiz * 1.2;

  // Temperature simulation: positive warm tint (sepia), negative cool tint (hue rotate toward blue)
  let sepiaVal = 0;
  if (cor.temperatura > 0) {
    sepiaVal = Math.min(0.5, cor.temperatura * 0.006);
  }

  // Texture / Sharpness can be subtly simulated with contrast micro-boost
  const sharpnessBoost = detalhe.nitidez > 0 ? 1 + detalhe.nitidez * 0.002 : 1;

  return [
    `brightness(${Math.max(0.2, Math.min(2.5, brightnessVal)).toFixed(3)})`,
    `contrast(${Math.max(0.4, Math.min(2.5, contrastVal * sharpnessBoost)).toFixed(3)})`,
    `saturate(${Math.max(0, Math.min(3, saturateVal)).toFixed(3)})`,
    `hue-rotate(${hueVal.toFixed(1)}deg)`,
    sepiaVal > 0 ? `sepia(${sepiaVal.toFixed(2)})` : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function getVignetteStyle(vinheta: number): string {
  if (vinheta <= 0) return 'none';
  const intensity = Math.min(0.85, (vinheta / 100) * 0.9);
  const radius = Math.max(25, 75 - vinheta * 0.4);
  return `radial-gradient(circle at center, transparent ${radius}%, rgba(0, 0, 0, ${intensity}) 100%)`;
}

export function getGrainOpacity(granulacao: number): number {
  if (granulacao <= 0) return 0;
  return Math.min(0.45, (granulacao / 100) * 0.45);
}

export function formatParamValue(param: string, value: number): string {
  // Format matching the exact Brazilian Portuguese / camera app display in screenshots
  if (param === 'exposicao' || param === 'nitidez') {
    const formatted = (value / 100).toFixed(2).replace('.', ',');
    return value >= 0 ? `+${formatted}` : formatted;
  }
  if (param === 'desfoqueBordas' || param === 'desembacar') {
    // In screenshot, desembaçar shows "15", desfoque nas bordas shows "8" without explicit +
    if (value > 0 && param === 'desfoqueBordas') return `${value}`;
    if (value > 0 && param === 'desembacar') return `${value}`;
  }
  return value > 0 ? `+${value}` : `${value}`;
}
