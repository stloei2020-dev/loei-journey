import React from 'react';
import { PlaceCategory } from '../types';
import { DISTRICTS } from '../data/seedData';
import { SlidersHorizontal, MapPin, X } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  totalCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  totalCount,
  onResetFilters,
  isFiltered
}) => {
  const categories: { id: PlaceCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'stay', label: 'ที่พักและโรงแรม' },
    { id: 'restaurant', label: 'ร้านอาหาร' },
    { id: 'cafe', label: 'คาเฟ่ & กาแฟ' },
    { id: 'attraction', label: 'สถานที่ท่องเที่ยว' },
    { id: 'souvenir', label: 'ของฝากเมืองเลย' },
  ];

  return (
    <div className="bg-white border-b border-stone-200/90 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Segmented Category Buttons (Functional controls per skill, not static pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                    active
                      ? 'bg-[#153326] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* District selector and result stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => onSelectDistrict(e.target.value)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#153326] cursor-pointer"
              >
                <option value="all">ทุกอำเภอ (14 อำเภอ)</option>
                {DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                title="ล้างตัวกรอง"
              >
                <X className="w-3 h-3" />
                <span>รีเซ็ต</span>
              </button>
            )}

            <span className="text-xs text-stone-400 font-mono tabular-nums">
              {totalCount} รายการ
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
