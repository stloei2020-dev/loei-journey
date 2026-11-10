import React from 'react';
import { HERO_IMAGE } from '../data/seedData';
import { Search, Compass, CloudSun, MapPin, Sparkles } from 'lucide-react';
import { PlaceCategory } from '../types';

interface HeroBannerProps {
  onSearch: (query: string) => void;
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  onSelectDistrict: (district: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onSelectCategory,
  onSelectDistrict
}) => {
  const [searchInput, setSearchInput] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <section className="relative overflow-hidden bg-[#0F241B] text-white">
      {/* Background Hero Photography */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="ทะเลหมอกภูทอก เชียงคาน จังหวัดเลย"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000"
        />
        {/* Measured Scrim for contrast according to skill */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A13] via-[#0F241B]/70 to-[#0F241B]/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
        
        {/* Curatorial Header / Issue Marker */}
        <div className="flex flex-wrap items-center gap-3 text-xs tracking-widest uppercase text-amber-200/90 font-mono mb-4">
          <span>THE OFFICIAL TRAVEL CURATION</span>
          <span aria-hidden="true">·</span>
          <span>PROVINCE OF LOEI, THAILAND</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 text-stone-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            <span>ฤดูหนาว 18°C ทะเลหมอกสมบูรณ์</span>
          </span>
        </div>

        {/* Display Headline */}
        <div className="max-w-3xl">
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#FAF8F5] leading-tight mb-6">
            ดินแดนแห่งทะเลภูเขา <br className="hidden sm:inline" />
            <span className="italic font-normal text-amber-100">สุดหนาวในสยาม</span> ดอกไม้งามสามฤดู
          </h1>
          <p className="text-base sm:text-lg text-stone-200/95 leading-relaxed font-light max-w-2xl mb-8">
            นิตยสารการท่องเที่ยวระดับมืออาชีพ คัดสรรสุดยอดที่พักริมสายหมอก คาเฟ่บรรยากาศอบอุ่น 
            ร้านอาหารรสเด็ดตำรับเมืองเลย และสถานที่ท่องเที่ยวห้ามพลาดทั้ง 14 อำเภอ
          </p>
        </div>

        {/* Search & Quick Discovery Bar */}
        <div className="max-w-2xl bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-xl border border-stone-200/50">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center px-3 py-2 text-stone-800">
              <Search className="w-5 h-5 text-stone-400 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="ค้นหา เช่น เชียงคาน, ภูเรือ, ข้าวปุ้นน้ำแจ่ว, ที่พัก..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-stone-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#153326] hover:bg-emerald-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shrink-0 flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>ค้นหาสถานที่</span>
            </button>
          </form>
        </div>

        {/* Quick Filter Buttons (Interactive Controls, not pills) */}
        <div className="mt-8 flex flex-wrap items-center gap-2 pt-4 border-t border-white/10 text-xs text-stone-300">
          <span className="font-medium text-amber-200/90 mr-1">ค้นหายอดนิยม:</span>
          <button
            onClick={() => {
              onSelectCategory('stay');
              onSelectDistrict('อำเภอเชียงคาน');
            }}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            ที่พักริมโขง เชียงคาน
          </button>
          <button
            onClick={() => {
              onSelectCategory('attraction');
              onSelectDistrict('อำเภอภูกระดึง');
            }}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            ผาหล่มสัก ภูกระดึง
          </button>
          <button
            onClick={() => {
              onSelectCategory('cafe');
              onSelectDistrict('all');
            }}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            คาเฟ่และโรงคั่วกาแฟ
          </button>
          <button
            onClick={() => {
              onSelectCategory('restaurant');
              onSelectDistrict('all');
            }}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition-colors"
          >
            ข้าวปุ้นน้ำแจ่วสูตรโบราณ
          </button>
        </div>

      </div>
    </section>
  );
};
