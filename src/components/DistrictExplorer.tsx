import React from 'react';
import { DISTRICTS } from '../data/seedData';
import { DistrictInfo } from '../types';
import { MapPin, ArrowRight, Mountain } from 'lucide-react';

interface DistrictExplorerProps {
  onSelectDistrict: (districtName: string) => void;
  selectedDistrict: string;
}

export const DistrictExplorer: React.FC<DistrictExplorerProps> = ({
  onSelectDistrict,
  selectedDistrict
}) => {
  return (
    <section className="py-16 bg-[#F4F1EA] border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Header */}
        <div className="max-w-2xl mb-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-2">
            <Mountain className="w-3.5 h-3.5" />
            <span>LOEI 14 DISTRICTS EXPEDITION</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            เที่ยวตามอำเภอ: มนต์เสน่ห์ทั้ง 14 อำเภอเมืองเลย
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            จังหวัดเลยประกอบด้วย 14 อำเภอที่มีเอกลักษณ์ทางวัฒนธรรมและภูมิประเทศเฉพาะตัว 
            คลิกเลือกอำเภอเพื่อสำรวจที่พัก คาเฟ่ และสถานที่ท่องเที่ยวในพื้นที่
          </p>
        </div>

        {/* District Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DISTRICTS.map((district) => {
            const isSelected = selectedDistrict === district.name;
            return (
              <div
                key={district.name}
                onClick={() => onSelectDistrict(district.name)}
                className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#153326] shadow-md ring-2 ring-[#153326]/10'
                    : 'bg-white/90 border-stone-200/90 hover:bg-white hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-editorial text-lg font-semibold text-stone-900 group-hover:text-[#153326] transition-colors">
                      {district.name}
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400 uppercase">
                      {district.nameEn}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-800 font-medium mb-3 line-clamp-1">
                    "{district.tagline}"
                  </p>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {district.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 truncate max-w-[80%]">
                    ไฮไลท์: {district.highlightAttraction.split(',')[0]}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#153326] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
