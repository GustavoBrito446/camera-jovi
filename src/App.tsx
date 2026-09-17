/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  AppScreen,
  Preset,
  PresetAdjustments,
  CommunityPreset,
  AspectRatioType,
  CameraModeType,
  CapturedPhoto,
} from './types';
import {
  INITIAL_PRESETS,
  SAMPLE_IMAGES,
  PORSCHE_RAIN_ADJUSTMENTS,
  DEFAULT_ADJUSTMENTS,
} from './data/presetsData';
import { CameraTopBar } from './components/CameraTopBar';
import { CameraViewfinder } from './components/CameraViewfinder';
import { CameraBottomBar } from './components/CameraBottomBar';
import { PresetsListScreen } from './components/PresetsListScreen';
import { PresetAdjustScreen } from './components/PresetAdjustScreen';
import { PresetMetadataScreen } from './components/PresetMetadataScreen';
import { CommunityScreen } from './components/CommunityScreen';
import { GalleryModal } from './components/GalleryModal';
import { CameraSettingsModal } from './components/CameraSettingsModal';
import { getCssFilterString } from './utils/filterEngine';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('camera');

  // Presets Library State (Starts with Detalhe selected matching screenshot!)
  const [presets, setPresets] = useState<Preset[]>(INITIAL_PRESETS);
  const [activePresetId, setActivePresetId] = useState<string | null>('detalhe');

  // Currently editing preset state
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);
  const [workingAdjustments, setWorkingAdjustments] = useState<PresetAdjustments>(
    PORSCHE_RAIN_ADJUSTMENTS
  );
  const [workingImageSrc, setWorkingImageSrc] = useState<string>(SAMPLE_IMAGES.porscheRain);

  // Camera Settings State
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [timerMode, setTimerMode] = useState<number>(0);
  const [activeRatio, setActiveRatio] = useState<AspectRatioType>('4:3');
  const [activeMode, setActiveMode] = useState<CameraModeType>('Foto');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [currentSceneKey, setCurrentSceneKey] = useState<string>('beach');
  const [currentSceneUrl, setCurrentSceneUrl] = useState<string>(SAMPLE_IMAGES.beachStairs);
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileFramed, setIsMobileFramed] = useState<boolean>(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Photos captured
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([
    {
      id: 'initial-photo',
      dataUrl: SAMPLE_IMAGES.beachStairs,
      timestamp: Date.now() - 300000,
      presetName: 'Detalhe',
      ratio: '4:3',
      mode: 'Foto',
    },
  ]);

  const activePreset = useMemo(() => {
    return presets.find((p) => p.id === activePresetId) || null;
  }, [presets, activePresetId]);

  const showToast = useCallback((msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 2800);
  }, []);

  // Audio synthesize shutter click
  const playShutterSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio not permitted or supported
    }
  }, []);

  // Shutter action
  const handleShutter = useCallback(() => {
    if (isTakingPhoto) return;

    const executeCapture = () => {
      setIsTakingPhoto(true);
      playShutterSound();

      // Take snapshot onto an offscreen canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = currentSceneUrl;

      img.onload = () => {
        canvas.width = img.naturalWidth || 1080;
        canvas.height = img.naturalHeight || 1440;
        if (ctx) {
          if (activePreset) {
            ctx.filter = getCssFilterString(activePreset.adjustments);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/png');

          const newPhoto: CapturedPhoto = {
            id: `photo-${Date.now()}`,
            dataUrl,
            timestamp: Date.now(),
            presetName: activePreset ? activePreset.name : 'Padrão',
            ratio: activeRatio,
            mode: activeMode,
          };

          setCapturedPhotos((prev) => [...prev, newPhoto]);
          showToast(`Foto capturada com preset "${activePreset ? activePreset.name : 'Normal'}"!`);
        }
      };

      img.onerror = () => {
        // Fallback photo
        const newPhoto: CapturedPhoto = {
          id: `photo-${Date.now()}`,
          dataUrl: currentSceneUrl,
          timestamp: Date.now(),
          presetName: activePreset ? activePreset.name : 'Padrão',
          ratio: activeRatio,
          mode: activeMode,
        };
        setCapturedPhotos((prev) => [...prev, newPhoto]);
        showToast('Foto capturada!');
      };

      setTimeout(() => {
        setIsTakingPhoto(false);
      }, 300);
    };

    if (timerMode > 0) {
      showToast(`Temporizador: ${timerMode}s`);
      setTimeout(() => {
        executeCapture();
      }, timerMode * 1000);
    } else {
      executeCapture();
    }
  }, [
    isTakingPhoto,
    timerMode,
    currentSceneUrl,
    activePreset,
    activeRatio,
    activeMode,
    playShutterSound,
    showToast,
  ]);

  // Flip camera / switch scene
  const handleSwitchCamera = () => {
    if (isWebcamActive) {
      setIsWebcamActive(false);
      showToast('Modo Cenário HD ativado');
    } else {
      const sceneKeys = Object.keys(SAMPLE_IMAGES);
      const currentIndex = sceneKeys.indexOf(currentSceneKey);
      const nextIndex = (currentIndex + 1) % sceneKeys.length;
      const nextKey = sceneKeys[nextIndex];
      setCurrentSceneKey(nextKey);
      setCurrentSceneUrl((SAMPLE_IMAGES as any)[nextKey]);
      showToast(`Cenário alternado`);
    }
  };

  // Preset Selection flow
  const handleSelectPreset = (preset: Preset) => {
    setActivePresetId(preset.id);
    setCurrentScreen('camera');
    showToast(`Preset "${preset.name}" aplicado à câmera!`);
  };

  const handleEditPreset = (preset: Preset) => {
    setEditingPreset(preset);
    setIsEditingExisting(true);
    setWorkingAdjustments(JSON.parse(JSON.stringify(preset.adjustments)));
    setWorkingImageSrc(preset.sampleImage || preset.coverImage);
    setCurrentScreen('preset-adjust');
  };

  const handleAddNewPreset = () => {
    setEditingPreset(null);
    setIsEditingExisting(false);
    // Use Porsche Rain adjustments as default reference matching screenshot
    setWorkingAdjustments(JSON.parse(JSON.stringify(PORSCHE_RAIN_ADJUSTMENTS)));
    setWorkingImageSrc(SAMPLE_IMAGES.porscheRain);
    setCurrentScreen('preset-adjust');
  };

  const handleSavePresetFinal = (meta: {
    name: string;
    description: string;
    category: any;
    coverImage: string;
    visibility: 'Publico' | 'Privado';
  }) => {
    if (isEditingExisting && editingPreset) {
      // Update existing preset
      setPresets((prev) =>
        prev.map((p) =>
          p.id === editingPreset.id
            ? {
                ...p,
                name: meta.name,
                description: meta.description,
                category: meta.category,
                coverImage: meta.coverImage,
                visibility: meta.visibility,
                adjustments: workingAdjustments,
              }
            : p
        )
      );
      showToast(`Preset "${meta.name}" atualizado!`);
    } else {
      // Create new preset
      const newPresetId = `preset-${Date.now()}`;
      const newPreset: Preset = {
        id: newPresetId,
        name: meta.name,
        description: meta.description,
        category: meta.category,
        coverImage: meta.coverImage,
        sampleImage: meta.coverImage,
        visibility: meta.visibility,
        adjustments: workingAdjustments,
        isCustom: true,
        likes: 1,
        saves: 1,
      };
      setPresets((prev) => [newPreset, ...prev]);
      setActivePresetId(newPresetId);
      showToast(`Novo preset "${meta.name}" salvo com sucesso!`);
    }
    setCurrentScreen('presets-list');
  };

  // Community integration
  const handleApplyCommunityPreset = (commPreset: CommunityPreset) => {
    // Check if preset is already in library or add on the fly
    const existing = presets.find((p) => p.name === commPreset.name);
    if (existing) {
      setActivePresetId(existing.id);
    } else {
      const newId = `comm-applied-${commPreset.id}`;
      const newPreset: Preset = {
        id: newId,
        name: commPreset.name,
        description: `Preset compartilhado por @${commPreset.authorHandle}`,
        category: (commPreset.category as any) || 'Retrato',
        coverImage: commPreset.coverImage,
        sampleImage: commPreset.coverImage,
        visibility: 'Publico',
        adjustments: commPreset.adjustments,
        likes: 5500,
        saves: 2100,
      };
      setPresets((prev) => [newPreset, ...prev]);
      setActivePresetId(newId);
    }
    setCurrentScreen('camera');
    showToast(`Preset "${commPreset.name}" aplicado à câmera!`);
  };

  const handleSaveCommunityPreset = (commPreset: CommunityPreset) => {
    const existing = presets.find((p) => p.name === commPreset.name);
    if (!existing) {
      const newId = `saved-${commPreset.id}`;
      const newPreset: Preset = {
        id: newId,
        name: commPreset.name,
        description: `Salvo da comunidade (@${commPreset.authorHandle})`,
        category: (commPreset.category as any) || 'Urbano',
        coverImage: commPreset.coverImage,
        sampleImage: commPreset.coverImage,
        visibility: 'Publico',
        adjustments: commPreset.adjustments,
        likes: 5500,
        saves: 2100,
      };
      setPresets((prev) => [...prev, newPreset]);
      showToast(`Preset "${commPreset.name}" adicionado à sua biblioteca!`);
    } else {
      showToast(`Você já possui o preset "${commPreset.name}"`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#070709] flex flex-col items-center justify-center relative font-sans">
      {/* Desktop / Mobile Framing Wrapper */}
      <div
        id="app-viewport-container"
        className={`w-full transition-all duration-300 ${
          isMobileFramed
            ? 'max-w-md h-[100dvh] max-h-[920px] rounded-none sm:rounded-[42px] border-0 sm:border-[10px] sm:border-[#1e1e24] overflow-hidden shadow-2xl relative bg-black flex flex-col'
            : 'max-w-4xl min-h-screen bg-black flex flex-col'
        }`}
      >
        {/* Active View Switcher */}
        {currentScreen === 'camera' && (
          <div className="w-full h-full flex flex-col justify-between bg-black relative">
            {/* Top Bar */}
            <CameraTopBar
              flashMode={flashMode}
              onToggleFlash={() => {
                const next = flashMode === 'off' ? 'on' : flashMode === 'on' ? 'auto' : 'off';
                setFlashMode(next);
                showToast(`Flash: ${next.toUpperCase()}`);
              }}
              timerMode={timerMode}
              onToggleTimer={() => {
                const next = timerMode === 0 ? 3 : timerMode === 3 ? 10 : 0;
                setTimerMode(next);
                showToast(next > 0 ? `Temporizador: ${next}s` : 'Temporizador desligado');
              }}
              onOpenPresets={() => setCurrentScreen('presets-list')}
              onOpenCommunity={() => setCurrentScreen('community')}
              onOpenSettings={() => setIsSettingsOpen(true)}
              hasActivePreset={Boolean(activePresetId)}
            />

            {/* Live Camera Viewfinder */}
            <CameraViewfinder
              activePreset={activePreset}
              activeRatio={activeRatio}
              showGrid={showGrid}
              sampleSceneImage={currentSceneUrl}
              isTakingPhoto={isTakingPhoto}
              isWebcamActive={isWebcamActive}
              onClearPreset={() => {
                setActivePresetId(null);
                showToast('Preset desativado');
              }}
              onOpenPresets={() => setCurrentScreen('presets-list')}
            />

            {/* Bottom Controls Bar */}
            <CameraBottomBar
              activeRatio={activeRatio}
              onChangeRatio={(r) => setActiveRatio(r)}
              activeMode={activeMode}
              onChangeMode={(m) => {
                setActiveMode(m);
                showToast(`Modo: ${m}`);
              }}
              onShutter={handleShutter}
              onSwitchCamera={handleSwitchCamera}
              onOpenGallery={() => setIsGalleryOpen(true)}
              lastPhotoThumb={capturedPhotos[capturedPhotos.length - 1]?.dataUrl}
              isTakingPhoto={isTakingPhoto}
            />
          </div>
        )}

        {/* Screen: Presets List */}
        {currentScreen === 'presets-list' && (
          <PresetsListScreen
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onEditPreset={handleEditPreset}
            onAddNewPreset={handleAddNewPreset}
            onBack={() => setCurrentScreen('camera')}
          />
        )}

        {/* Screen: Adjustments / Novo Preset */}
        {currentScreen === 'preset-adjust' && (
          <PresetAdjustScreen
            title={isEditingExisting ? 'AJUSTES' : 'NOVO PRESET'}
            imageSrc={workingImageSrc}
            adjustments={workingAdjustments}
            onChangeAdjustments={(adj) => setWorkingAdjustments(adj)}
            onBack={() => setCurrentScreen('presets-list')}
            onConfirm={() => setCurrentScreen('preset-metadata')}
            onReset={() => {
              setWorkingAdjustments(DEFAULT_ADJUSTMENTS);
              showToast('Ajustes redefinidos para o padrão');
            }}
          />
        )}

        {/* Screen: Metadata & Final Save */}
        {currentScreen === 'preset-metadata' && (
          <PresetMetadataScreen
            title={isEditingExisting ? 'AJUSTES' : 'NOVO PRESET'}
            imageSrc={workingImageSrc}
            adjustments={workingAdjustments}
            initialPreset={editingPreset || undefined}
            onBack={() => setCurrentScreen('preset-adjust')}
            onSave={handleSavePresetFinal}
          />
        )}

        {/* Screen: Community */}
        {currentScreen === 'community' && (
          <CommunityScreen
            onBackToCamera={() => setCurrentScreen('camera')}
            onApplyPresetToCamera={handleApplyCommunityPreset}
            onSavePresetToLibrary={handleSaveCommunityPreset}
            onCreatePreset={handleAddNewPreset}
          />
        )}

        {/* Notification Toast */}
        {notificationToast && (
          <div
            id="app-toast-alert"
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c1f]/95 border border-[#ca8a04]/50 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <span className="w-2 h-2 rounded-full bg-[#ca8a04]" />
            <span>{notificationToast}</span>
          </div>
        )}
      </div>

      {/* Floating Mode Toggle for Desktop (Mobile First vs Responsive Full Screen) */}
      <div className="hidden sm:flex fixed bottom-3 right-4 z-40 items-center gap-2 bg-[#1c1c1f]/90 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] text-neutral-300 shadow-lg">
        <span>Moldura Smartphone:</span>
        <button
          type="button"
          onClick={() => setIsMobileFramed(!isMobileFramed)}
          className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
            isMobileFramed ? 'bg-[#ca8a04] text-black' : 'bg-neutral-800 text-white'
          }`}
        >
          {isMobileFramed ? 'Ativa (Mobile)' : 'Desativada (Full Web)'}
        </button>
      </div>

      {/* Gallery Modal */}
      {isGalleryOpen && (
        <GalleryModal
          photos={capturedPhotos}
          onClose={() => setIsGalleryOpen(false)}
          onDeletePhoto={(id) => {
            setCapturedPhotos((prev) => prev.filter((p) => p.id !== id));
            showToast('Foto excluída');
          }}
        />
      )}

      {/* Camera Settings / Simulator Modal */}
      <CameraSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        isWebcamActive={isWebcamActive}
        onToggleWebcam={() => {
          setIsWebcamActive(!isWebcamActive);
          showToast(isWebcamActive ? 'Cenário HD ativado' : 'Câmera real ativada');
        }}
        currentSceneKey={currentSceneKey}
        onSelectScene={(key, url) => {
          setCurrentSceneKey(key);
          setCurrentSceneUrl(url);
          showToast(`Cenário alterado`);
        }}
        isMobileFramed={isMobileFramed}
        onToggleMobileFrame={() => setIsMobileFramed(!isMobileFramed)}
      />
    </div>
  );
}
