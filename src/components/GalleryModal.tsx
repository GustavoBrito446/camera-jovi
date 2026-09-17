import React from 'react';
import { X, Download, Trash2, Camera, Calendar, Clock } from 'lucide-react';
import { CapturedPhoto } from '../types';

interface GalleryModalProps {
  photos: CapturedPhoto[];
  onClose: () => void;
  onDeletePhoto: (id: string) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ photos, onClose, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = React.useState<CapturedPhoto | null>(
    photos.length > 0 ? photos[photos.length - 1] : null
  );

  const handleDownload = (photo: CapturedPhoto) => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `photo-${photo.presetName}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 text-white select-none">
      {/* Header */}
      <div className="w-full flex items-center justify-between py-2 mb-4 border-b border-white/10 max-w-2xl mx-auto">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Camera className="w-5 h-5 text-[#ca8a04]" /> Galeria de Capturas
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
          <Camera className="w-12 h-12 mb-3 text-neutral-600" />
          <p className="text-sm">Nenhuma foto capturada ainda.</p>
          <p className="text-xs text-neutral-500 mt-1">
            Use o botão de obturador na câmera para tirar fotos com seus presets!
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full overflow-hidden">
          {/* Main Selected Photo View */}
          {selectedPhoto && (
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center mb-4">
              <img
                src={selectedPhoto.dataUrl}
                alt="Captured"
                className="max-h-full max-w-full object-contain"
              />

              {/* Tag with preset used */}
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/10 text-amber-300 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Preset: {selectedPhoto.presetName}
              </div>

              {/* Bottom bar of image */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(selectedPhoto.timestamp).toLocaleTimeString()}</span>
                  <span className="text-neutral-500">|</span>
                  <span>Modo {selectedPhoto.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedPhoto)}
                    className="p-1.5 hover:text-amber-400"
                    title="Baixar Foto"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="p-1.5 hover:text-red-400"
                    title="Excluir Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filmstrip / Thumbnail list */}
          <div className="h-20 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-2">
            {photos.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedPhoto(item)}
                className={`relative h-16 w-16 rounded-xl overflow-hidden shrink-0 border-2 transition-transform active:scale-95 ${
                  selectedPhoto?.id === item.id ? 'border-[#ca8a04] scale-105' : 'border-transparent opacity-70'
                }`}
              >
                <img src={item.dataUrl} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
