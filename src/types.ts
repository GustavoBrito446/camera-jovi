export type AppScreen =
  | 'camera'
  | 'presets-list'
  | 'preset-adjust'
  | 'preset-metadata'
  | 'community'
  | 'gallery';

export type AdjustmentTab = 'luz' | 'cor' | 'efeito' | 'detalhe' | 'otica';

export type PresetCategory = 'Carro' | 'Retrato' | 'Urbano' | 'Noturno' | 'Filme' | 'Paisagem';

export interface LuzAdjustments {
  exposicao: number; // e.g. +0.35 (-100 to +100 or mapped)
  contraste: number; // e.g. +20
  realces: number; // e.g. -30
  sombras: number; // e.g. +20
  brancos: number; // e.g. +10
  pretos: number; // e.g. -15
}

export interface CorAdjustments {
  temperatura: number; // e.g. -5
  saturacao: number; // e.g. +20
  matiz: number; // e.g. +18
  vibracao: number; // e.g. -8
  corAtiva: string; // hex of selected color in mistura de cores
}

export interface EfeitoAdjustments {
  textura: number; // e.g. -10
  desembacar: number; // e.g. 15
  claridade: number; // e.g. -8
  vinheta: number; // e.g. +12
  granulacao: number; // e.g. +20
}

export interface DetalheAdjustments {
  nitidez: number; // e.g. +0.35
  raio: number; // e.g. +20
  detalhe: number; // e.g. -30
  mascara: number; // e.g. +20
  reducaoRuido: number; // e.g. +10
}

export interface OticaAdjustments {
  removerAberracao: boolean;
  correcaoPerfil: boolean;
  distorcao: number; // e.g. +18
  vinheta: number; // e.g. +20
  desfoqueBordas: number; // e.g. 8
}

export interface PresetAdjustments {
  luz: LuzAdjustments;
  cor: CorAdjustments;
  efeito: EfeitoAdjustments;
  detalhe: DetalheAdjustments;
  otica: OticaAdjustments;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  category: PresetCategory;
  coverImage: string;
  sampleImage: string;
  visibility: 'Publico' | 'Privado';
  adjustments: PresetAdjustments;
  author?: {
    name: string;
    handle: string;
    avatar?: string;
  };
  isCustom?: boolean;
  likes?: number;
  saves?: number;
}

export interface CommunityPreset {
  id: string;
  name: string;
  authorHandle: string;
  authorAvatar: string;
  coverImage: string;
  category: string;
  likes: string;
  isTrending?: boolean;
  saved?: boolean;
  adjustments: PresetAdjustments;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  presetName: string;
  ratio: string;
  mode: string;
}

export type AspectRatioType = '1:1' | '4:3' | '16:9';

export type CameraModeType = 'Noturno' | 'Retrato' | 'Foto' | 'Vídeo' | 'Ultra HD';
