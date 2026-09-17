import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bookmark,
  Plus,
  Image as ImageIcon,
  Heart,
  Camera,
  Flame,
  X,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { CommunityPreset } from '../types';
import { COMMUNITY_PRESETS } from '../data/presetsData';

interface CommunityScreenProps {
  onBackToCamera: () => void;
  onApplyPresetToCamera: (preset: CommunityPreset) => void;
  onSavePresetToLibrary: (preset: CommunityPreset) => void;
  onCreatePreset: () => void;
}

const CATEGORIES = ['Em Alta', 'Carro', 'Paisagem', 'Noturno', 'Urbano'];

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  onBackToCamera,
  onApplyPresetToCamera,
  onSavePresetToLibrary,
  onCreatePreset,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Em Alta');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<CommunityPreset | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter presets based on category and search
  const filteredPresets = COMMUNITY_PRESETS.filter((item) => {
    const matchesCategory =
      activeCategory === 'Em Alta'
        ? true
        : item.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorHandle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="community-screen"
      className="w-full h-full min-h-screen bg-black text-white flex flex-col select-none relative"
    >
      {/* Top Bar matching Group 3.png */}
      <div className="w-full flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
        <button
          id="btn-community-menu"
          type="button"
          onClick={() => setShowMenuDrawer(true)}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <h1 className="text-xl font-bold tracking-wide text-white">Comunidade</h1>

        <button
          id="btn-community-search"
          type="button"
          onClick={() => setShowSearchInput(!showSearchInput)}
          className="p-1.5 text-white/90 hover:text-white active:scale-95 transition-transform"
          title="Buscar Presets"
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Optional Search bar */}
      {showSearchInput && (
        <div className="px-5 py-2 animate-in fade-in">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por criador ou estilo..."
            className="w-full bg-[#1e1e24] text-xs px-3.5 py-2.5 rounded-xl border border-white/10 outline-none text-white placeholder-neutral-500"
          />
        </div>
      )}

      {/* Category Pills matching Group 3.png */}
      <div
        id="community-category-tabs"
        className="w-full flex items-center gap-6 px-6 py-2.5 overflow-x-auto no-scrollbar shrink-0 border-b border-white/5"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`text-xs whitespace-nowrap pb-1 transition-all relative ${
                isActive
                  ? 'text-[#ca8a04] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#ca8a04]'
                  : 'text-neutral-400 font-medium hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 2-Column Preset Feed Grid matching Group 3.png */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-24">
        <div className="grid grid-cols-2 gap-3.5 max-w-lg mx-auto">
          {filteredPresets.map((preset) => {
            const isBookmarked = savedIds.has(preset.id);
            return (
              <div
                key={preset.id}
                id={`community-card-${preset.id}`}
                onClick={() => setSelectedPreset(preset)}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer group shadow-md"
              >
                {/* Cover Image */}
                <img
                  src={preset.coverImage}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Trending Badge "Em Alta 🔥" matching screenshot */}
                {preset.isTrending && (
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                    <span className="text-[10px] font-medium text-white">Em Alta</span>
                    <Flame className="w-3 h-3 text-red-500 fill-red-500" />
                  </div>
                )}

                {/* Bottom Card Overlay with author, preset name, likes, bookmark */}
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-2.5 px-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img
                      src={preset.authorAvatar}
                      alt={preset.authorHandle}
                      className="w-4 h-4 rounded-full object-cover border border-white/30"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] text-white/90 font-medium truncate">
                      @{preset.authorHandle}
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs font-bold text-white tracking-wide truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-normal">
                        {preset.likes}
                      </div>
                    </div>

                    {/* Bookmark Icon */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(preset.id, e)}
                      className="p-1 text-white/80 hover:text-[#ca8a04] active:scale-90 transition-transform"
                      title="Salvar preset"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${isBookmarked ? 'fill-[#ca8a04] text-[#ca8a04]' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating "+ Criar preset" Button on Bottom Right matching Group 3.png */}
      <div className="absolute bottom-20 right-4 z-30 flex flex-col items-center gap-1">
        <button
          id="btn-community-create-preset"
          type="button"
          onClick={onCreatePreset}
          className="w-12 h-12 rounded-full bg-[#27272a] hover:bg-[#323238] border border-white/15 shadow-xl flex items-center justify-center text-white active:scale-95 transition-transform"
          title="Criar novo preset"
        >
          <Plus className="w-6 h-6" />
        </button>
        <span className="text-[10px] text-neutral-300 font-medium tracking-tight">
          Criar preset
        </span>
      </div>

      {/* Bottom Navigation Bar matching Group 3.png */}
      <div
        id="community-bottom-nav"
        className="w-full h-16 bg-black border-t border-white/10 flex items-center justify-around px-8 fixed bottom-0 left-0 right-0 z-20 max-w-lg mx-auto"
      >
        {/* Gallery / Feed Icon */}
        <button
          type="button"
          className="p-2 text-white/90 hover:text-white"
          title="Galeria da Comunidade"
        >
          <ImageIcon className="w-6 h-6" />
        </button>

        {/* Favorites Heart Icon */}
        <button
          type="button"
          className="p-2 text-white/90 hover:text-white"
          title="Favoritos"
        >
          <Heart className="w-6 h-6" />
        </button>

        {/* Camera Shutter Icon (takes user straight back to live camera!) */}
        <button
          id="btn-nav-camera"
          type="button"
          onClick={onBackToCamera}
          className="p-2 text-white hover:scale-110 active:scale-95 transition-transform"
          title="Abrir Câmera"
        >
          <Camera className="w-7 h-7" />
        </button>
      </div>

      {/* Preset Detail Bottom Sheet / Modal */}
      {selectedPreset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#18181b] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedPreset.authorAvatar}
                  alt={selectedPreset.authorHandle}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedPreset.name}
                  </h3>
                  <span className="text-xs text-neutral-400">@{selectedPreset.authorHandle}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreset(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-48 rounded-2xl overflow-hidden bg-neutral-900">
              <img
                src={selectedPreset.coverImage}
                alt={selectedPreset.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span>{selectedPreset.likes}</span>
              <span className="text-[#ca8a04] font-medium">Categoria: {selectedPreset.category}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onSavePresetToLibrary(selectedPreset);
                  setSelectedPreset(null);
                }}
                className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white border border-white/10 active:scale-95 transition-all"
              >
                Salvar Preset
              </button>
              <button
                type="button"
                onClick={() => {
                  onApplyPresetToCamera(selectedPreset);
                  setSelectedPreset(null);
                }}
                className="py-3 px-4 rounded-xl bg-[#ca8a04] hover:bg-amber-600 text-xs font-bold text-black active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Usar na Câmera</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Drawer */}
      {showMenuDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start">
          <div className="w-64 bg-[#141416] border-r border-white/10 h-full p-5 space-y-6 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Menu</h2>
              <button
                type="button"
                onClick={() => setShowMenuDrawer(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <button
                type="button"
                onClick={() => {
                  setShowMenuDrawer(false);
                  onBackToCamera();
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
              >
                <Camera className="w-4 h-4 text-[#ca8a04]" />
                <span>Câmera</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenuDrawer(false);
                  onCreatePreset();
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[#ca8a04]" />
                <span>Criar Novo Preset</span>
              </button>
              <div className="border-t border-white/5 pt-3">
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">
                  Desafio FIAP & Smartphone
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Sistema pioneiro de presets fotográficos integrados à câmera com ecossistema social compartilhável.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
