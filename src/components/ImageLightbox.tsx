import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.75 : 1));
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-between p-4 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top Bar: Title & Controls */}
      <div className="w-full max-w-6xl flex items-center justify-between text-white py-2 px-2 z-10">
        <div className="flex items-center gap-3">
          <span className="font-editorial text-lg text-white font-medium truncate max-w-md">
            {title || 'รูปภาพสถานที่'}
          </span>
          <span className="text-xs text-stone-400 font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title={zoomLevel === 1 ? 'ขยายภาพ (Zoom In)' : 'ย่อภาพ (Zoom Out)'}
          >
            {zoomLevel === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="ปิดหน้าต่าง (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Frame with Previous/Next Arrows */}
      <div className="relative flex-1 w-full max-w-6xl flex items-center justify-center overflow-hidden my-2">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs border border-white/10"
            aria-label="รูปภาพก่อนหน้า"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className="relative max-w-full max-h-[75vh] flex items-center justify-center cursor-zoom-in transition-transform duration-300 select-none"
          onClick={toggleZoom}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={images[currentIndex]}
            alt={`ภาพขนาดใหญ่ที่ ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all backdrop-blur-xs border border-white/10"
            aria-label="รูปภาพถัดไป"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="w-full max-w-2xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-10">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                currentIndex === idx
                  ? 'border-amber-400 scale-105 opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
