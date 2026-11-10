import React, { useState } from 'react';
import { Menu, X, Shield, LogOut, Compass, Sparkles } from 'lucide-react';
import { User } from '../lib/firebase';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  adminUser: User | null;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  adminUser,
  onOpenAdmin,
  onLogoutAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'stay', label: 'ที่พักและโรงแรม' },
    { id: 'dining', label: 'ร้านอาหาร & คาเฟ่' },
    { id: 'attractions', label: 'สถานที่ท่องเที่ยว' },
    { id: 'services', label: 'ธุรกิจบริการน่าสนใจ' },
    { id: 'articles', label: 'บทความและรีวิว' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Bar Announcement / Magazine Volume Marker */}
      <div className="bg-[#153326] text-[#F3EFE6] px-4 py-1 text-xs text-center tracking-wider font-light flex items-center justify-center gap-3">
        <span className="uppercase tracking-widest text-[11px] text-amber-200/90 font-mono">Vol. 24 / Travel Guide</span>
        <span aria-hidden="true" className="text-white/30">|</span>
        <span className="truncate">สัมผัสมนต์เสน่ห์แห่งทะเลภูเขา ดอกไม้งาม และสายหมอกเมืองเลย</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single element) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-baseline gap-2.5 text-left text-stone-900 group whitespace-nowrap shrink-0 focus:outline-none"
          >
            <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#153326] group-hover:text-emerald-800 transition-colors">
              LOEI JOURNEY
            </span>
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-stone-500 font-sans font-medium">
              เลย เจอร์นีย์
            </span>
          </button>

          {/* Zone 2: 5 Clean Single-Line Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors hover:text-[#153326] ${
                    isActive ? 'text-[#153326] font-semibold' : 'text-stone-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#153326] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action (Admin Access / System Status) */}
          <div className="flex items-center gap-3 shrink-0">
            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#153326] rounded-md hover:bg-emerald-900 transition-colors shadow-sm whitespace-nowrap shrink-0"
                  title="จัดการหลังบ้าน"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-300" />
                  <span>ระบบหลังบ้าน</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-100 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 hover:text-[#153326] hover:border-stone-400 transition-all shadow-xs whitespace-nowrap shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-stone-400" />
                <span>สำหรับผู้ดูแล (Admin)</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                currentTab === link.id
                  ? 'bg-[#153326]/10 text-[#153326] font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#153326] rounded-md hover:bg-emerald-900 transition-colors"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>{adminUser ? 'เข้าสู่ระบบหลังบ้าน (Admin)' : 'เข้าสู่ระบบผู้ดูแล'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
