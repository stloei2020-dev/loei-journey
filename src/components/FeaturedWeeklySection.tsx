import React, { useState } from 'react';
import { Place } from '../types';
import {
  Sparkles,
  Star,
  MapPin,
  ArrowUpRight,
  Compass,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

interface FeaturedWeeklySectionProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const FeaturedWeeklySection: React.FC<FeaturedWeeklySectionProps> = ({ place, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!place) return null;

  // Build gallery array of 4-5 images
  const allImages = place.gallery && place.gallery.length > 0
    ? (place.gallery.includes(place.imageUrl) ? place.gallery : [place.imageUrl, ...place.gallery])
    : [place.imageUrl];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>CURATOR'S CHOICE · สถานที่แนะนำประจำสัปดาห์</span>
          </div>

          {/* Standards indicator if available */}
          {place.standards && place.standards.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">มาตรฐานที่ได้รับ:</span>
              <div className="flex items-center gap-1.5">
                {place.standards.map((st, i) => (
                  <div
                    key={st.id || i}
                    className="flex items-center gap-1 bg-white border border-stone-200/90 shadow-2xs rounded-full px-2.5 py-0.5"
                    title={`${st.name} (${st.issuer || 'มาตรฐานรับรอง'})`}
                  >
                    <img src={st.logoUrl} alt={st.name} className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-medium text-stone-700">{st.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Split: Editorial presentation with interactive image slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/90 shadow-xs">
          
          {/* Left Column: Visual Photography Slider (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden group shadow-sm bg-stone-200 select-none">
              
              <img
                src={allImages[currentImageIndex] || place.imageUrl}
                alt={`${place.name} ภาพที่ ${currentImageIndex + 1}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/loei_hero_sea_of_mist_1794278412692.jpg';
                }}
                className="w-full h-full object-cover transition-all duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
              
              {/* Prev / Next Slider Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/75 text-white transition-all backdrop-blur-xs opacity-90 group-hover:opacity-100"
                    aria-label="รูปก่อนหน้า"
                    title="เลื่อนดูภาพก่อนหน้า"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/75 text-white transition-all backdrop-blur-xs opacity-90 group-hover:opacity-100"
                    aria-label="รูปถัดไป"
                    title="เลื่อนดูภาพถัดไป"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Lightbox Zoom Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/40 hover:bg-black/70 text-white transition-all backdrop-blur-xs"
                title="คลิกเพื่อขยายดูรูปภาพขนาดใหญ่"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Slider Image Counter Pill */}
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
                ภาพ {currentImageIndex + 1} / {allImages.length}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between pointer-events-none">
                <div>
                  <span className="text-xs uppercase tracking-wider font-mono text-amber-200/90 block">
                    {place.district}
                  </span>
                  <span className="font-editorial text-xl sm:text-2xl font-bold">
                    {place.name}
                  </span>
                </div>
                <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{place.rating ? place.rating.toFixed(1) : '5.0'}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation Bar for Slider */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      currentImageIndex === idx
                        ? 'border-[#153326] scale-102 opacity-100 shadow-xs'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Curatorial Prose & Standards Badges (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#153326]" />
                <span className="font-medium text-stone-800">{place.district}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-medium">สุดยอดสถานที่แนะนำประจำสัปดาห์</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-4">
                {place.name}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base font-light leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Official Standards & Accreditations Showcase */}
              {place.standards && place.standards.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5 mb-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>มาตรฐานและรางวัลรับรองคุณภาพ</span>
                  </div>
                  <div className="space-y-2">
                    {place.standards.map((st, i) => (
                      <div key={st.id || i} className="flex items-start gap-2.5 text-xs text-stone-600">
                        <img
                          src={st.logoUrl}
                          alt={st.name}
                          className="w-6 h-6 object-contain shrink-0 mt-0.5"
                        />
                        <div>
                          <span className="font-medium text-stone-900 block">{st.name}</span>
                          <span className="text-[11px] text-stone-500">{st.issuer || st.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key details */}
              <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>เวลาแนะนำ: {place.openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>ค่าบริการ / ราคา: {place.priceRange}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onSelect(place)}
                className="w-full sm:w-auto px-6 py-3 bg-[#153326] hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>สำรวจข้อมูลและวิธีการเดินทาง</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="w-full sm:w-auto px-4 py-3 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-4 h-4 text-stone-500" />
                <span>ขยายดูแกลเลอรีภาพ</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Viewer */}
      <ImageLightbox
        images={allImages}
        initialIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={place.name}
      />
    </section>
  );
};
