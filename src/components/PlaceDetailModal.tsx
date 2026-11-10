import React, { useState, useEffect } from 'react';
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
  Compass,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Award,
  Globe,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageLightbox } from './ImageLightbox';
import { trackEvent } from '../lib/firebase';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Build clean array of 4-5 images
  const allImages = place?.gallery && place.gallery.length > 0
    ? (place.gallery.includes(place.imageUrl) ? place.gallery : [place.imageUrl, ...place.gallery])
    : (place ? [place.imageUrl] : []);

  useEffect(() => {
    if (place) {
      setCurrentImageIndex(0);
      setCopiedLink(false);
      setShowShareMenu(false);
      // Track view_place event in analytics
      trackEvent('view_place', place.id, place.name, 'web');
    }
  }, [place]);

  if (!place) return null;

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
    trackEvent('share', place.id, place.name, 'copy');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareLine = () => {
    trackEvent('share', place.id, place.name, 'line');
    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    trackEvent('share', place.id, place.name, 'facebook');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    trackEvent('share', place.id, place.name, 'x');
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-stone-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FAF8F5]">
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="text-[#153326] font-semibold">{place.district}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{place.category}</span>
              {place.viewsCount !== undefined && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-stone-400">เข้าชม {place.viewsCount + 1} ครั้ง</span>
                </>
              )}
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

              {/* Share Menu */}
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
                      แชร์ข้อมูลสถานที่
                    </div>
                    <button
                      onClick={handleShareFacebook}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors flex items-center justify-between"
                    >
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={handleShareLine}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors flex items-center justify-between"
                    >
                      <span>LINE</span>
                    </button>
                    <button
                      onClick={handleShareTwitter}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md transition-colors flex items-center justify-between"
                    >
                      <span>X (Twitter)</span>
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

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* Visual Carousel & Lightbox Trigger */}
            <div className="space-y-3">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group">
                <img
                  src={allImages[currentImageIndex] || place.imageUrl}
                  alt={place.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Left/Right Arrows */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                      title="ภาพก่อนหน้า"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                      title="ภาพถัดไป"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Lightbox Trigger Button */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-md"
                  title="คลิกเพื่อขยายดูรูปภาพขนาดใหญ่"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ขยายดูภาพใหญ่</span>
                </button>

                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        currentImageIndex === i ? 'border-[#153326] scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`ภาพที่ ${i+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Standards Badges Header */}
            <div className="border-b border-stone-100 pb-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
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

                <div className="flex flex-wrap items-center gap-2">
                  {place.rating && (
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg shrink-0">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-mono font-semibold text-amber-900 text-sm tabular-nums">
                        {place.rating.toFixed(1)} / 5.0
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Standards Badges Bar (with actual logos) */}
              {place.standards && place.standards.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block mb-2">
                    มาตรฐานและตรารับรองคุณภาพ (Certifications & Awards):
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {place.standards.map((st, i) => (
                      <div
                        key={st.id || i}
                        className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs"
                        title={st.description || st.name}
                      >
                        <img src={st.logoUrl} alt={st.name} className="w-5 h-5 object-contain" />
                        <div>
                          <span className="text-xs font-semibold text-stone-800 block leading-tight">
                            {st.name}
                          </span>
                          {st.issuer && (
                            <span className="text-[10px] text-stone-500 block">
                              {st.issuer}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

            {/* Direct Online Contact Links Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-stone-500 font-medium">ช่องทางติดต่อออนไลน์:</span>
              
              {place.facebookUrl && (
                <a
                  href={place.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Facebook Page</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {place.lineUrl && (
                <a
                  href={place.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#06C755]/10 hover:bg-[#06C755]/20 text-[#06C755] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>LINE Official</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              {place.websiteUrl && (
                <a
                  href={place.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>เว็บไซต์ทางการ</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100">
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
                onClick={() => setIsLightboxOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-4 h-4 text-stone-500" />
                <span>ขยายภาพแกลเลอรี</span>
              </button>
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

      {/* Image Lightbox Viewer */}
      <ImageLightbox
        images={allImages}
        initialIndex={currentImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        title={place.name}
      />
    </>
  );
};
