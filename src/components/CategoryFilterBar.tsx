import React from 'react';
import { PlaceCategory, PriceFilter } from '../types';
import { DISTRICTS } from '../data/seedData';
import { SlidersHorizontal, MapPin, X, DollarSign, Sparkles } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: PlaceCategory | 'all';
  onSelectCategory: (cat: PlaceCategory | 'all') => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
  priceFilter: PriceFilter;
  onSelectPriceFilter: (p: PriceFilter) => void;
  hasStandardsOnly: boolean;
  onToggleStandardsOnly: () => void;
  totalCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDistrict,
  onSelectDistrict,
  priceFilter,
  onSelectPriceFilter,
  hasStandardsOnly,
  onToggleStandardsOnly,
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
    { id: 'service', label: 'ธุรกิจบริการน่าสนใจ' },
    { id: 'souvenir', label: 'ของฝากเมืองเลย' },
  ];

  return (
    <div className="bg-white border-b border-stone-200/90 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Segmented Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
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

          {/* District, Price & Standards Filters */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 text-xs">
            
            {/* District selector */}
            <div className="flex items-center gap-1.5 text-stone-500">
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

            {/* Price filter selector */}
            <div className="flex items-center gap-1 text-stone-500">
              <DollarSign className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={priceFilter}
                onChange={(e) => onSelectPriceFilter(e.target.value as PriceFilter)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-[#153326] cursor-pointer"
              >
                <option value="all">ทุกระดับราคา</option>
                <option value="budget">ประหยัด (&lt; 300บ.)</option>
                <option value="moderate">ปานกลาง (300-1,000บ.)</option>
                <option value="luxury">พรีเมียม (&gt; 1,000บ.)</option>
              </select>
            </div>

            {/* Standards Only Button */}
            <button
              onClick={onToggleStandardsOnly}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1 transition-colors ${
                hasStandardsOnly
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
              }`}
              title="แสดงเฉพาะสถานที่ที่ได้รับมาตรฐานรับรอง"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>มีมาตรฐาน</span>
            </button>

            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 px-2 py-1 rounded transition-colors"
                title="ล้างตัวกรองทั้งหมด"
              >
                <X className="w-3 h-3" />
                <span>รีเซ็ต</span>
              </button>
            )}

            <span className="text-xs text-stone-400 font-mono tabular-nums pl-1 border-l border-stone-200">
              {totalCount} รายการ
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
