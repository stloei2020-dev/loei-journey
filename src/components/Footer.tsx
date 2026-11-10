import React from 'react';
import { Compass, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onSelectDistrict: (district: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectDistrict, onOpenAdmin }) => {
  return (
    <footer className="bg-[#0C1C14] text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Manifesto (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="font-editorial text-2xl font-bold text-white tracking-tight">
                LOEI JOURNEY
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-200/80 font-mono">
                เลย เจอร์นีย์
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
              นิตยสารการท่องเที่ยวจังหวัดเลยฉบับดิจิทัลอย่างเป็นทางการ 
              รวบรวมข้อมูลที่พัก ร้านอาหาร คาเฟ่ และสถานที่ท่องเที่ยวธรรมชาติอันบริสุทธิ์ทั้ง 14 อำเภอ 
              เพื่อส่งเสริมการท่องเที่ยวเชิงอนุรักษ์และวิถีวัฒนธรรมลุ่มน้ำโขง
            </p>

            <div className="pt-2 text-xs text-stone-500 font-mono">
              ISSN 2985-120X · Digital Travel Magazine
            </div>
          </div>

          {/* Quick Districts Navigation (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              อำเภอยอดนิยม
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอเชียงคาน')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอเชียงคาน (ถนนคนเดิน & ภูทอก)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอภูกระดึง')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอภูกระดึง (ผาหล่มสัก & ป่าสน)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอภูเรือ')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอภูเรือ (หนาวที่สุดในสยาม)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอหนองหิน')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอหนองหิน (ฟูจิเมืองเลย & คุนหมิง)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอด่านซ้าย')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอด่านซ้าย (ผีตาโขน & พระธาตุศรีสองรัก)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectDistrict('อำเภอเมืองเลย')}
                  className="hover:text-amber-200 transition-colors"
                >
                  อำเภอเมืองเลย (ภูบ่อบิด & อาหารพื้นเมือง)
                </button>
              </li>
            </ul>
          </div>

          {/* Tourism Official Hotlines & Support (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              ข้อมูลติดต่อสำคัญ
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-200/80 mt-0.5 shrink-0" />
                <span>การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานเลย</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-200/80 shrink-0" />
                <span>โทร: 042-812-812, 042-811-405</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-200/80 shrink-0" />
                <span>สายด่วนท่องเที่ยว: 1672 (TAT Contact Center)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-200/80 shrink-0" />
                <span>ตำรวจท่องเที่ยว: 1155</span>
              </div>
            </div>
          </div>

          {/* Admin & Editorial Access (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              ระบบและบุคลากร
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenAdmin}
                className="block text-stone-400 hover:text-amber-200 transition-colors"
              >
                ระบบหลังบ้าน (Admin CMS)
              </button>
              <a
                href="https://thai.tourismthailand.org"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-stone-400 hover:text-amber-200 transition-colors"
              >
                เว็บไซต์ ททท. ประเทศไทย
              </a>
              <span className="block text-stone-600">
                Connected to Firestore DB
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            © {new Date().getFullYear()} LOEI JOURNEY. All rights reserved. นิตยสารการท่องเที่ยวจังหวัดเลย
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>สร้างด้วยความรักในธรรมชาติและมนต์เสน่ห์เมืองเลย</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
