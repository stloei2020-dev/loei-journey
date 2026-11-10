import React, { useState } from 'react';
import { HERO_IMAGE } from '../data/seedData';
import { Search, Compass, CloudSun, MapPin, Sparkles, Filter, X } from 'lucide-react';
import { PlaceCategory, PriceFilter } from '../types';
import { DISTRICTS } from '../data/seedData';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  onSelectDistrict: (district: string) => void;
  priceFilter: PriceFilter;
  onSelectPriceFilter: (p: PriceFilter) => void;
  hasStandardsOnly: boolean;
  onToggleStandardsOnly: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onSelectCategory,
  onSelectDistrict,
  priceFilter,
  onSelectPriceFilter,
  hasStandardsOnly,
  onToggleStandardsOnly
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [imageError, setImageError] = useState(false);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <section className="relative overflow-hidden bg-[#0C1E16] text-white min-h-[580px] sm:min-h-[640px] flex items-center">
      {/* Background Hero Photography with Fallback Container */}
      <div className="absolute inset-0 z-0 bg-[#0C1E16]">
        {!imageError && (
          <img
            src={HERO_IMAGE}
            alt=""
            role="presentation"
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000"
          />
        )}
        
        {/* Measured Rich Gradient Overlay for high-contrast legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A12] via-[#0C1E16]/75 to-[#0C1E16]/45" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0C1E16]/30 to-[#0A1A12]/80" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* Curatorial Header / Volume Marker */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-widest uppercase text-amber-200/90 font-mono mb-4">
          <span className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-sm text-white">
            VOL. 24 · LOEI TRAVEL MAGAZINE
          </span>
          <span aria-hidden="true" className="text-white/40">·</span>
          <span className="flex items-center gap-1.5 text-stone-200">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            <span>อุณหภูมิยอดภู 16°C · ทะเลหมอกหนาแน่น</span>
          </span>
        </div>

        {/* Display Headline with Natural Thai Phrasing & No Awkward Breaks */}
        <div className="max-w-3xl">
          <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF8F5] leading-[1.2] mb-5 text-balance">
            <span className="inline-block">ดินแดนแห่งทะเลภูเขา</span>{' '}
            <span className="inline-block italic font-normal text-amber-200">สุดหนาวในสยาม</span>{' '}
            <span className="inline-block">ดอกไม้งามสามฤดู</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-stone-200/95 font-light leading-relaxed max-w-2xl mb-8">
            ศูนย์รวมข้อมูลท่องเที่ยวจังหวัดเลยระดับมืออาชีพ คัดสรรสุดยอดที่พักริมสายหมอก 
            ร้านอาหารรสเด็ด คาเฟ่วิวธรรมชาติ สถานที่ท่องเที่ยวห้ามพลาด และธุรกิจบริการน่าสนใจทั้ง 14 อำเภอ
          </p>
        </div>

        {/* Fast Multi-parameter Search Bar */}
        <div className="max-w-3xl bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl shadow-2xl border border-stone-200/70 text-stone-800">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-3 py-2 text-stone-800">
              <Search className="w-5 h-5 text-stone-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="ค้นหาชื่อสถานที่, ที่พัก, ข้าวปุ้นน้ำแจ่ว, ภูกระดึง, รถเช่า..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-stone-400 font-sans"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                className={`px-3 py-2.5 text-xs font-medium rounded-xl transition-colors border flex items-center gap-1.5 shrink-0 ${
                  showAdvancedFilter || priceFilter !== 'all' || hasStandardsOnly
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
                title="ตัวกรองเพิ่มเติม (ราคา, มาตรฐาน)"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>ตัวกรอง</span>
                {(priceFilter !== 'all' || hasStandardsOnly) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#153326] hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-sm shrink-0 flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>ค้นหาทันที</span>
              </button>
            </div>
          </form>

          {/* Advanced Search Options Dropdown (Price & Standards Filter) */}
          {showAdvancedFilter && (
            <div className="mt-3 pt-3 border-t border-stone-200 px-3 pb-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  ช่วงระดับราคา:
                </label>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'ทั้งหมด' },
                    { id: 'budget', label: 'ประหยัด (< 300บ.)' },
                    { id: 'moderate', label: 'ปานกลาง (300-1,000บ.)' },
                    { id: 'luxury', label: 'พรีเมียม (> 1,000บ.)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPriceFilter(p.id as PriceFilter)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        priceFilter === p.id
                          ? 'bg-[#153326] text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  มาตรฐานรับรองคุณภาพ:
                </label>
                <button
                  type="button"
                  onClick={onToggleStandardsOnly}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                    hasStandardsOnly
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>เฉพาะสถานที่ที่ได้รับตรามาตรฐาน (SHA / Green Hotel / OTOP ฯลฯ)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Category Buttons (Interactive controls) */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-stone-300">
          <span className="font-medium text-amber-200 mr-1">หมวดหมู่ลัด:</span>
          <button
            onClick={() => onSelectCategory('stay')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            ที่พักริมหมอก
          </button>
          <button
            onClick={() => onSelectCategory('restaurant')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            ร้านอาหารพื้นถิ่น
          </button>
          <button
            onClick={() => onSelectCategory('cafe')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            คาเฟ่กาแฟภูเรือ
          </button>
          <button
            onClick={() => onSelectCategory('attraction')}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            สถานที่ท่องเที่ยว
          </button>
          <button
            onClick={() => onSelectCategory('service')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 backdrop-blur-xs transition-colors"
          >
            ธุรกิจบริการน่าสนใจ
          </button>
        </div>

      </div>
    </section>
  );
};
