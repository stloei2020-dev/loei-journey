import React, { useState } from 'react';
import { Place } from '../types';
import { Star, MapPin, ArrowUpRight, Compass, Award } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, onSelect }) => {
  const [imageError, setImageError] = useState(false);

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
      {/* Visual Image container with 4:3 Aspect Ratio and Lazy Loading */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {!imageError ? (
          <img
            src={place.imageUrl}
            alt={place.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400 p-4">
            <Compass className="w-8 h-8 mb-1.5 opacity-60 text-emerald-800" />
            <span className="text-xs font-serif text-stone-600 text-center">{place.name}</span>
          </div>
        )}

        {/* Minimal Editorial Category Stamp on top right */}
        <div className="absolute top-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-sans px-2.5 py-1 rounded-sm shadow-xs">
          {categoryLabels[place.category] || place.category}
        </div>

        {/* Standard certification logo badge on bottom left of image */}
        {place.standards && place.standards.length > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-0.5 border border-stone-200/80 shadow-xs">
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
