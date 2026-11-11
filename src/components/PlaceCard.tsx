import React, { useState } from 'react';
import { Place } from '../types';
import { Star, MapPin, ArrowUpRight, Compass, ChevronLeft, ChevronRight } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect }) => {
  const [imageError, setImageError] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Combine gallery and main image for preview slider
  const rawImages = [
    place.imageUrl,
    ...(place.gallery || []).filter(img => img && img !== place.imageUrl)
  ].filter(Boolean);

  const images = rawImages.length > 0 ? rawImages : [place.imageUrl];
  const activeImage = images[currentIdx] || place.imageUrl;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setImageError(false);
    setCurrentIdx(idx);
  };

  const categoryLabels: Record<string, string> = {
    stay: 'ที่พัก & โรงแรม',
    restaurant: 'ร้านอาหาร',
    cafe: 'คาเฟ่ & กาแฟ',
    attraction: 'สถานที่ท่องเที่ยว',
    souvenir: 'ของฝากเมืองเลย',
    service: 'ธุรกิจบริการน่าสนใจ'
  };

  return (
    <article
      onClick={() => onSelect(place)}
      className="group bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-stone-300 transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col h-full"
    >
      {/* Visual Image container with 4:3 Aspect Ratio and Slide Preview */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden select-none">
        {!imageError ? (
          <img
            key={activeImage}
            src={activeImage}
            alt={`${place.name} รูปที่ ${currentIdx + 1}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400 p-4">
            <Compass className="w-8 h-8 mb-1.5 opacity-60 text-emerald-800" />
            <span className="text-xs font-serif text-stone-600 text-center">{place.name}</span>
          </div>
        )}

        {/* Image Slider Navigation Controls (when multiple preview images exist) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="รูปก่อนหน้า"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="รูปถัดไป"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slider Dot Indicators & Image Counter */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/55 backdrop-blur-md px-2 py-0.5 rounded-full z-10">
              <span className="text-[10px] font-mono text-white/90">
                {currentIdx + 1}/{images.length}
              </span>
              <div className="flex items-center gap-1 ml-1">
                {images.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => handleDotClick(e, dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      dotIdx === currentIdx
                        ? 'w-3 bg-amber-400'
                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`ไปยังรูปภาพที่ ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Draft indicator if viewing as admin */}
        {place.status === 'draft' && (
          <div className="absolute top-2.5 left-2.5 bg-amber-500 text-stone-950 font-bold text-[10px] tracking-wide px-2 py-0.5 rounded shadow-xs z-10 flex items-center gap-1 border border-amber-300">
            <span>📝 แบบร่าง (Draft)</span>
          </div>
        )}

        {/* Minimal Editorial Category Stamp on top right */}
        <div className="absolute top-2.5 right-2.5 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-sans px-2.5 py-1 rounded-sm shadow-xs z-10">
          {categoryLabels[place.category] || place.category}
        </div>

        {/* Standard certification logo badge on bottom left of image */}
        {place.standards && place.standards.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-0.5 border border-stone-200/80 shadow-xs z-10">
            <img
              src={place.standards[0].logoUrl}
              alt=""
              className="w-4 h-4 object-contain"
            />
            <span className="text-[10px] font-medium text-stone-800">
              {place.standards[0].name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Zero-Pill Typography */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata line: clean unboxed text with '·' separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <span className="font-medium text-stone-700">{place.district}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            {place.priceRange && (
              <>
                <span className="truncate max-w-[140px]">{place.priceRange}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
              </>
            )}
            {place.rating && (
              <span className="flex items-center gap-0.5 text-amber-700 font-mono tabular-nums">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                <span>{place.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Place Name */}
          <h3 className="font-editorial text-lg sm:text-xl font-semibold text-stone-900 group-hover:text-[#153326] transition-colors leading-snug mb-2 line-clamp-1">
            {place.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {place.shortDescription || place.description}
          </p>
        </div>

        {/* Bottom Bar: Clean subtle tags & View Details trigger */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-stone-400 truncate max-w-[70%]">
            {place.tags && place.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-stone-500 text-[11px]">
                #{tag}
              </span>
            ))}
          </div>

          <span className="text-xs font-medium text-[#153326] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
            <span>ดูข้อมูล</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
