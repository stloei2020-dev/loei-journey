import React from 'react';
import { Place } from '../types';
import { Sparkles, Star, MapPin, ArrowUpRight, Compass, Clock } from 'lucide-react';

interface FeaturedWeeklySectionProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const FeaturedWeeklySection: React.FC<FeaturedWeeklySectionProps> = ({ place, onSelect }) => {
  if (!place) return null;

  return (
    <section className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Kicker */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>CURATOR'S CHOICE · สถานที่แนะนำประจำสัปดาห์</span>
        </div>

        {/* 2-Column Split: Editorial presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/90 shadow-xs">
          
          {/* Left Column: Visual Photography (7 cols) */}
          <div
            onClick={() => onSelect(place)}
            className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group shadow-sm"
          >
            <img
              src={place.imageUrl}
              alt={place.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
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

          {/* Right Column: Curatorial Prose & Story (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#153326]" />
                <span className="font-medium text-stone-800">{place.district}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-medium">สุดยอดจุดชมวิวเมืองเลย</span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-4">
                {place.name}
              </h2>

              <p className="text-stone-700 text-sm sm:text-base font-light leading-relaxed mb-6">
                {place.description}
              </p>

              {/* Highlights definitions list */}
              <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>เวลาแนะนำ: {place.openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>ค่าบริการ: {place.priceRange}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onSelect(place)}
                className="w-full sm:w-auto px-6 py-3 bg-[#153326] hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>สำรวจข้อมูลและวิธีการเดินทาง</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
