import React, { useState } from 'react';
import { Place } from '../types';
import {
  X,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  Star,
  ExternalLink,
  Share2,
  Bookmark,
  Check,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  const [activeImage, setActiveImage] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  React.useEffect(() => {
    if (place) {
      setActiveImage(place.imageUrl);
      setCopiedLink(false);
      setShowShareMenu(false);
    }
  }, [place]);

  if (!place) return null;

  const galleryImages = place.gallery && place.gallery.length > 0
    ? [place.imageUrl, ...place.gallery.filter(img => img !== place.imageUrl)]
    : [place.imageUrl];

  const handleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `แนะนำที่เที่ยวจังหวัดเลย: ${place.name} (${place.district}) - LOEI JOURNEY`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareLine = () => {
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-stone-200">
        
        {/* Modal Header & Quick Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF8F5]">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="text-[#153326] font-semibold">{place.district}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{place.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition-all ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800'
              }`}
              title={isBookmarked ? 'บันทึกแล้ว' : 'บันทึกเป็นที่เที่ยวโปรด'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Share Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                title="แชร์ข้อมูล"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-20 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-medium text-stone-400 px-2 py-1 uppercase tracking-wider">
                    แชร์ไปยังโซเชียล
                  </div>
                  <button
                    onClick={handleShareFacebook}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={handleShareLine}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
                  >
                    LINE
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors"
                  >
                    X (Twitter)
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors flex items-center justify-between"
                  >
                    <span>คัดลอกลิงก์</span>
                    {copiedLink && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white border border-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Main Visual & Gallery Strip */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={activeImage}
                alt={place.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImage === img ? 'border-[#153326] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`ภาพที่ ${i+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Place Title & Rating */}
          <div className="border-b border-stone-100 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                  {place.name}
                </h2>
                {place.nameEn && (
                  <p className="text-sm font-sans text-stone-500 mt-0.5">
                    {place.nameEn}
                  </p>
                )}
              </div>

              {place.rating && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg shrink-0 w-fit">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-mono font-semibold text-amber-900 text-sm tabular-nums">
                    {place.rating.toFixed(1)} / 5.0
                  </span>
                  <span className="text-xs text-amber-700">แนะนำ</span>
                </div>
              )}
            </div>
          </div>

          {/* Long Description */}
          <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed">
            <p className="whitespace-pre-line">{place.description}</p>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {place.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Essential Info Grid (Contact, Hours, Price, Maps) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-5 rounded-xl border border-stone-200/90 text-xs sm:text-sm">
            
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#153326] mt-0.5 shrink-0" />
              <div>
                <span className="block font-semibold text-stone-800 mb-0.5">ที่ตั้ง & พิกัด</span>
                <span className="text-stone-600 leading-normal">{place.address}</span>
              </div>
            </div>

            {/* Opening Hours */}
            {place.openingHours && (
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#153326] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-stone-800 mb-0.5">เวลาทำการ</span>
                  <span className="text-stone-600 leading-normal">{place.openingHours}</span>
                </div>
              </div>
            )}

            {/* Price Range */}
            {place.priceRange && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-[#153326] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-stone-800 mb-0.5">ราคา / ค่าบริการ</span>
                  <span className="text-stone-600 leading-normal">{place.priceRange}</span>
                </div>
              </div>
            )}

            {/* Phone */}
            {place.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#153326] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-semibold text-stone-800 mb-0.5">ติดต่อสอบถาม</span>
                  <a
                    href={`tel:${place.phone.replace(/[^0-9]/g, '')}`}
                    className="text-[#153326] font-medium hover:underline"
                  >
                    {place.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3">
            {place.googleMapsUrl && (
              <a
                href={place.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#153326] hover:bg-emerald-900 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>นำทางด้วย Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
