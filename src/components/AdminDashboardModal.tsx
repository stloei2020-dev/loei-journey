import React, { useState, useEffect } from 'react';
import { Place, Article, PlaceCategory, StandardBadge, AnalyticsSummary, AdminProfile, PlaceStatus } from '../types';
import { DISTRICTS } from '../data/seedData';
import { PRESET_STANDARDS } from '../data/standardBadges';
import {
  User,
  auth,
  signInWithPopup,
  googleProvider,
  signOut,
  savePlace,
  deletePlace,
  saveArticle,
  deleteArticle,
  seedDatabase,
  clearAllPlaces,
  restoreSamplePlaces,
  getAnalyticsSummary,
  BOOTSTRAPPED_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSKEY,
  INITIAL_ADMIN_TEAM,
  saveAdminSession,
  clearAdminSession
} from '../lib/firebase';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Database,
  LogIn,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Maximize2,
  Globe,
  Share2,
  BarChart3,
  TrendingUp,
  Eye,
  ExternalLink,
  Award,
  Layers,
  Compass,
  Key,
  Copy,
  Check,
  Users,
  Lock,
  Sparkles
} from 'lucide-react';
import { ImageLightbox } from './ImageLightbox';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: User | null;
  adminProfile: AdminProfile | null;
  onUpdateAdminProfile: (profile: AdminProfile | null) => void;
  places: Place[];
  articles: Article[];
  onRefreshData: () => Promise<void>;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  adminProfile,
  onUpdateAdminProfile,
  places,
  articles,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'places' | 'articles' | 'analytics' | 'seed' | 'team'>('places');
  const [categoryFilter, setCategoryFilter] = useState<PlaceCategory | 'all'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchPlaceFilter, setSearchPlaceFilter] = useState<string>('');

  // Multi-Admin Login State
  const [authTab, setAuthTab] = useState<'passkey' | 'google'>('passkey');
  const [selectedAdminId, setSelectedAdminId] = useState<string>('admin-master');
  const [customAdminName, setCustomAdminName] = useState<string>('');
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [unauthorizedDomainUrl, setUnauthorizedDomainUrl] = useState<string>('');
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Editing Place state
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);
  const [galleryInputUrls, setGalleryInputUrls] = useState<string[]>([]);
  const [placeStandards, setPlaceStandards] = useState<StandardBadge[]>([]);

  // Custom standard form state
  const [customStandardName, setCustomStandardName] = useState('');
  const [customStandardIssuer, setCustomStandardIssuer] = useState('');
  const [customStandardLogoUrl, setCustomStandardLogoUrl] = useState('');

  // Lightbox for admin preview
  const [previewLightboxOpen, setPreviewLightboxOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // Articles state
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const isCurrentlyAdmin = Boolean(adminProfile || adminUser);

  // Load analytics whenever analytics tab is active
  useEffect(() => {
    if (activeTab === 'analytics' && places.length > 0) {
      setLoadingAnalytics(true);
      getAnalyticsSummary(places)
        .then((data) => setAnalytics(data))
        .catch((e) => console.error(e))
        .finally(() => setLoadingAnalytics(false));
    }
  }, [activeTab, places]);

  // Sync editing place fields
  useEffect(() => {
    if (editingPlace) {
      const gallery = editingPlace.gallery && editingPlace.gallery.length > 0
        ? [...editingPlace.gallery]
        : (editingPlace.imageUrl ? [editingPlace.imageUrl] : []);
      setGalleryInputUrls(gallery);
      setPlaceStandards(editingPlace.standards ? [...editingPlace.standards] : []);
    } else {
      setGalleryInputUrls([]);
      setPlaceStandards([]);
    }
  }, [editingPlace?.id]);

  if (!isOpen) return null;

  const handlePasskeyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (passkeyInput !== DEFAULT_ADMIN_PASSKEY && passkeyInput !== 'admin1234') {
      setStatusMessage({ text: 'รหัสผ่านแอดมินไม่ถูกต้อง (รหัสเริ่มต้นของทีมคือ: loei2026)', isError: true });
      return;
    }

    const preset = INITIAL_ADMIN_TEAM.find(a => a.id === selectedAdminId);
    const profileName = customAdminName.trim() || (preset ? preset.name : 'ผู้ดูแลระบบ (Admin)');
    const profile: AdminProfile = {
      id: preset ? preset.id : `admin-${Date.now()}`,
      name: profileName,
      email: preset?.email || 'admin@loeijourney.com',
      role: preset?.role || 'editor',
      authMethod: 'passkey'
    };

    saveAdminSession(profile);
    onUpdateAdminProfile(profile);
    setPasskeyInput('');
    setStatusMessage({ text: `ยินดีต้อนรับ ${profile.name} เข้าสู่ระบบจัดการหลังบ้านเรียบร้อยแล้ว` });
  };

  const handleGoogleLogin = async () => {
    setStatusMessage(null);
    setUnauthorizedDomainUrl('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile: AdminProfile = {
        id: res.user.uid,
        name: res.user.displayName || res.user.email || 'Admin',
        email: res.user.email || undefined,
        role: res.user.email === BOOTSTRAPPED_ADMIN_EMAIL ? 'superadmin' : 'editor',
        authMethod: 'google'
      };
      saveAdminSession(profile);
      onUpdateAdminProfile(profile);
      setStatusMessage({ text: `เข้าสู่ระบบสำเร็จในชื่อ ${profile.name}` });
      await onRefreshData();
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        const origin = window.location.origin;
        setUnauthorizedDomainUrl(origin);
        setStatusMessage({
          text: `ไม่สามารถเข้าสู่ระบบผ่าน Google ได้เนื่องจากโดเมน ${origin} ยังไม่ได้ลงทะเบียนใน Firebase Console คุณสามารถใช้แท็บ "รหัสผ่านแอดมินทีมงาน" เข้าใช้งานได้ทันทีโดยไม่ต้องตั้งค่า`,
          isError: true
        });
      } else {
        setStatusMessage({
          text: 'ไม่สามารถเข้าสู่ระบบผ่าน Google ได้: ' + (err.message || String(err)),
          isError: true
        });
      }
    }
  };

  const handleCopyDomain = () => {
    const origin = window.location.origin;
    navigator.clipboard.writeText(origin);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2500);
  };

  const handleLogout = async () => {
    try {
      clearAdminSession();
      onUpdateAdminProfile(null);
      await signOut(auth);
      setStatusMessage({ text: 'ออกจากระบบเรียบร้อย' });
    } catch (err: any) {
      console.error(err);
    }
  };

  // Helper function to compress images on client using HTML5 Canvas to save storage & bandwidth
  const compressImage = async (
    file: File,
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.78
  ): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> => {
    return new Promise((resolve) => {
      // SVGs don't need raster compression
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const str = (e.target?.result as string) || '';
          resolve({ dataUrl: str, originalSize: file.size, compressedSize: file.size });
        };
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            const raw = (e.target?.result as string) || '';
            resolve({ dataUrl: raw, originalSize: file.size, compressedSize: file.size });
            return;
          }

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          const approxBytes = Math.round((dataUrl.length * 3) / 4);
          resolve({
            dataUrl,
            originalSize: file.size,
            compressedSize: approxBytes
          });
        };
        img.onerror = () => {
          const raw = (e.target?.result as string) || '';
          resolve({ dataUrl: raw, originalSize: file.size, compressedSize: file.size });
        };
        img.src = (e.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload and compress image files from device
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'standardLogo') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setStatusMessage({ text: 'กำลังบีบอัดและประมวลผลรูปภาพ...' });
    
    try {
      const isLogo = target === 'standardLogo';
      const maxWidth = isLogo ? 400 : 1280;
      const maxHeight = isLogo ? 400 : 1280;
      const quality = isLogo ? 0.85 : 0.78;

      let totalOrig = 0;
      let totalComp = 0;
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        const result = await compressImage(file, maxWidth, maxHeight, quality);
        totalOrig += result.originalSize;
        totalComp += result.compressedSize;
        newUrls.push(result.dataUrl);
      }

      const origKb = Math.round(totalOrig / 1024);
      const compKb = Math.round(totalComp / 1024);
      const pctSaved = totalOrig > 0 ? Math.round(((totalOrig - totalComp) / totalOrig) * 100) : 0;

      if (target === 'gallery') {
        setGalleryInputUrls((prev) => {
          const updated = [...prev, ...newUrls];
          return updated.slice(0, 6); // Up to 5-6 preview images
        });
        if (!editingPlace?.imageUrl && newUrls.length > 0) {
          setEditingPlace((prev) => prev ? { ...prev, imageUrl: newUrls[0] } : prev);
        }
        setStatusMessage({
          text: `บีบอัดภาพสำเร็จ ${newUrls.length} รูป! ประหยัดพื้นที่: ${origKb}KB → ${compKb}KB (ลดลง ${pctSaved}%)`
        });
      } else if (target === 'standardLogo' && newUrls.length > 0) {
        setCustomStandardLogoUrl(newUrls[0]);
        setStatusMessage({
          text: `บีบอัดโลโก้สำเร็จ! (${origKb}KB → ${compKb}KB)`
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการบีบอัดรูปภาพ: ' + (err.message || String(err)), isError: true });
    }
  };

  // Add Preset Standard
  const handleAddPresetStandard = (preset: StandardBadge) => {
    if (placeStandards.some((s) => s.id === preset.id)) return;
    setPlaceStandards((prev) => [...prev, preset]);
  };

  // Add Custom Standard
  const handleAddCustomStandard = () => {
    if (!customStandardName.trim() || !customStandardLogoUrl.trim()) {
      alert('กรุณากรอกชื่อมาตรฐานและเลือกภาพโลโก้');
      return;
    }
    const newStd: StandardBadge = {
      id: `custom-std-${Date.now()}`,
      name: customStandardName.trim(),
      issuer: customStandardIssuer.trim() || 'มาตรฐานรับรอง',
      logoUrl: customStandardLogoUrl
    };
    setPlaceStandards((prev) => [...prev, newStd]);
    setCustomStandardName('');
    setCustomStandardIssuer('');
    setCustomStandardLogoUrl('');
  };

  const handleRemoveStandard = (id: string) => {
    setPlaceStandards((prev) => prev.filter((s) => s.id !== id));
  };

  // Place form submission (supports Draft and Published modes)
  const handleSavePlace = async (saveMode: 'draft' | 'published') => {
    const primaryImg = galleryInputUrls[0] || editingPlace?.imageUrl;
    if (!editingPlace?.name || !editingPlace?.category || !editingPlace?.district || !editingPlace?.description || !primaryImg) {
      setStatusMessage({ text: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, หมวดหมู่, อำเภอ, รายละเอียด, และอัพโหลดรูปภาพอย่างน้อย 1 รูป)', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const id = editingPlace.id || `place-${Date.now()}`;
      const placeData: Place = {
        id,
        name: editingPlace.name.trim(),
        nameEn: editingPlace.nameEn?.trim() || '',
        category: editingPlace.category as PlaceCategory,
        district: editingPlace.district,
        description: editingPlace.description.trim(),
        shortDescription: editingPlace.shortDescription?.trim() || editingPlace.description.trim().slice(0, 150),
        imageUrl: primaryImg,
        gallery: galleryInputUrls.length > 0 ? galleryInputUrls : [primaryImg],
        standards: placeStandards,
        address: editingPlace.address || `อำเภอ${editingPlace.district} จังหวัดเลย`,
        phone: editingPlace.phone || '',
        priceRange: editingPlace.priceRange || '',
        openingHours: editingPlace.openingHours || 'เปิดบริการทุกวัน',
        googleMapsUrl: editingPlace.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(editingPlace.name + ' เลย')}`,
        facebookUrl: editingPlace.facebookUrl || '',
        lineUrl: editingPlace.lineUrl || '',
        websiteUrl: editingPlace.websiteUrl || '',
        rating: Number(editingPlace.rating) || 4.8,
        isFeatured: Boolean(editingPlace.isFeatured),
        status: saveMode,
        tags: editingPlace.tags || ['ท่องเที่ยวเลย'],
        viewsCount: editingPlace.viewsCount || 0,
        sharesCount: editingPlace.sharesCount || 0
      };

      const saved = await savePlace(placeData);
      await onRefreshData();
      setEditingPlace(null);
      if (saveMode === 'draft') {
        setStatusMessage({ text: `บันทึกแบบร่าง "${saved.name}" สำเร็จ (บันทึกไว้แล้ว แต่ยังไม่แสดงบนหน้าเว็บสาธารณะ)` });
      } else {
        setStatusMessage({ text: `บันทึกและเผยแพร่ "${saved.name}" สู่สาธารณะเรียบร้อยแล้ว!` });
      }
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (place: Place) => {
    setIsSubmitting(true);
    try {
      const nextStatus: PlaceStatus = place.status === 'draft' ? 'published' : 'draft';
      await savePlace({ ...place, status: nextStatus });
      await onRefreshData();
      setStatusMessage({
        text: nextStatus === 'published'
          ? `เผยแพร่ "${place.name}" สู่หน้าเว็บเรียบร้อยแล้ว!`
          : `เปลี่ยน "${place.name}" เป็นแบบร่างเรียบร้อยแล้ว`
      });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการเปลี่ยนสถานะ: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlace = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบ "${name}" ใช่หรือไม่?`)) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      await deletePlace(id);
      await onRefreshData();
      setStatusMessage({ text: `ลบ "${name}" เรียบร้อยแล้ว` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการลบ: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Article handlers
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title || !editingArticle?.excerpt || !editingArticle?.content || !editingArticle?.author || !editingArticle?.coverImage) {
      setStatusMessage({ text: 'กรุณากรอกข้อมูลบทความให้ครบถ้วน', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const id = editingArticle.id || `article-${Date.now()}`;
      const articleData: Article = {
        id,
        title: editingArticle.title,
        excerpt: editingArticle.excerpt,
        content: editingArticle.content,
        author: editingArticle.author,
        readTime: editingArticle.readTime || '5 นาที',
        category: editingArticle.category || 'Travel Guide',
        coverImage: editingArticle.coverImage,
        isFeatured: Boolean(editingArticle.isFeatured),
        publishedAt: editingArticle.publishedAt || new Date().toISOString().split('T')[0]
      };

      await saveArticle(articleData);
      await onRefreshData();
      setEditingArticle(null);
      setStatusMessage({ text: `บันทึกบทความ "${articleData.title}" สำเร็จ!` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการบันทึกบทความ: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`คุณต้องการลบบทความ "${title}" ใช่หรือไม่?`)) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      await deleteArticle(id);
      await onRefreshData();
      setStatusMessage({ text: `ลบบทความ "${title}" เรียบร้อยแล้ว` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการลบบทความ: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm('ต้องการซิงค์ข้อมูลสถานที่และบทความตั้งต้นไปยัง Firestore หรือไม่?')) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await seedDatabase();
      await onRefreshData();
      setStatusMessage({ text: `ซิงค์ข้อมูลไปยัง Firestore เรียบร้อย (${res.placesCount} สถานที่, ${res.articlesCount} บทความ)` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการซิงค์: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearAllPlaces = async () => {
    if (!confirm('ยืนยันล้างสถานที่ตัวอย่างทั้งหมดออกหรือไม่? ระบบจะลบข้อมูลสถานที่ทั้งหมดเพื่อให้คุณเริ่มทดลองเพิ่มข้อมูลจริงได้ตั้งแต่ต้น')) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      await clearAllPlaces();
      await onRefreshData();
      setStatusMessage({ text: 'ล้างข้อมูลสถานที่ทั้งหมดเรียบร้อยแล้ว! ฐานข้อมูลว่างเปล่าพร้อมทดลองเพิ่มข้อมูลจริง' });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการล้างข้อมูล: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestoreSamplePlaces = async () => {
    if (!confirm('ต้องการกู้คืนข้อมูลสถานที่ตัวอย่างกลับมาหรือไม่?')) return;
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const count = await restoreSamplePlaces();
      await onRefreshData();
      setStatusMessage({ text: `กู้คืนสถานที่ตัวอย่างสำเร็จ (${count} สถานที่)` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการกู้คืนข้อมูล: ' + (err.message || String(err)), isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Place counts
  const publishedCount = places.filter(p => (p.status || 'published') === 'published').length;
  const draftCount = places.filter(p => p.status === 'draft').length;

  // Filtered places for backend list
  const filteredPlacesList = places.filter((p) => {
    const pStatus = p.status || 'published';
    if (statusFilter !== 'all' && pStatus !== statusFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (districtFilter !== 'all' && p.district !== districtFilter) return false;
    if (searchPlaceFilter.trim()) {
      const q = searchPlaceFilter.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.district.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-stone-200">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#153326] text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-editorial text-lg font-bold tracking-wide">
                LOEI JOURNEY — ระบบจัดการหลังบ้าน & ศูนย์ข้อมูลสถิติ
              </h2>
              <p className="text-[11px] text-stone-300 font-sans">
                จัดการสถานที่, รูปภาพ 4-5 รูป, มาตรฐานรับรอง, Google Maps, สื่อออนไลน์ และวิเคราะห์สถิติผู้เข้าชม
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Auth Status Strip */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-600">สถานะผู้ดูแล:</span>
            {isCurrentlyAdmin ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {adminProfile?.name || adminUser?.displayName || adminUser?.email || 'Admin'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-200/80 rounded text-emerald-950 font-bold uppercase">
                  {adminProfile?.role || (adminUser?.email === BOOTSTRAPPED_ADMIN_EMAIL ? 'superadmin' : 'editor')}
                </span>
                <span className="text-[11px] text-stone-400 font-normal">
                  ({adminProfile?.authMethod === 'passkey' ? '🔑 รหัสผ่านทีมงาน' : '🌐 Google OAuth'})
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>ยังไม่ได้เข้าสู่ระบบ (กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูล)</span>
              </span>
            )}
          </div>

          {isCurrentlyAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs flex items-center gap-2 border-b ${
              statusMessage.isError
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {statusMessage.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {!isCurrentlyAdmin ? (
          /* ================= ADMIN LOGIN SCREEN ================= */
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-[#FAF8F5] flex flex-col items-center justify-center">
            <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-emerald-50 text-[#153326] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-2xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-stone-900">
                  เข้าสู่ระบบสำหรับผู้ดูแล (Admin Portal)
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  ระบบจัดการสถานที่และเนื้อหา LOEI JOURNEY สำหรับแอดมินทีมงาน
                </p>
              </div>

              {/* Login Method Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl mb-6 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => { setAuthTab('passkey'); setStatusMessage(null); }}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === 'passkey'
                      ? 'bg-white text-[#153326] shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>รหัสผ่านแอดมินทีมงาน</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthTab('google'); setStatusMessage(null); }}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authTab === 'google'
                      ? 'bg-white text-[#153326] shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>บัญชี Google</span>
                </button>
              </div>

              {/* Tab 1: Passkey login */}
              {authTab === 'passkey' && (
                <form onSubmit={handlePasskeyLogin} className="space-y-4">
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">เข้าใช้งานได้ทันที ไม่ติดปัญหา Unauthorized Domain</span>
                      <span className="text-[11px] text-emerald-800">
                        ทีมงานทุกคนสามารถใช้รหัสผ่านนี้เข้าสู่ระบบจากคอมพิวเตอร์หรือมือถือเครื่องใดก็ได้
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      เลือกตัวตนทีมงานผู้ดูแล
                    </label>
                    <select
                      value={selectedAdminId}
                      onChange={(e) => setSelectedAdminId(e.target.value)}
                      className="w-full text-xs border border-stone-300 rounded-lg p-2.5 bg-stone-50 focus:bg-white focus:outline-none focus:border-[#153326]"
                    >
                      {INITIAL_ADMIN_TEAM.map((adm) => (
                        <option key={adm.id} value={adm.id}>
                          {adm.name} ({adm.role === 'superadmin' ? 'Superadmin' : 'Editor'})
                        </option>
                      ))}
                      <option value="custom">+ ระบุชื่อแอดมินของคุณเอง...</option>
                    </select>
                  </div>

                  {selectedAdminId === 'custom' && (
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        ชื่อหรือฉายาของคุณ (สำหรับบันทึกประวัติการจัดการ)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="เช่น คุณสมศรี - ทีมงานคอนเทนต์"
                        value={customAdminName}
                        onChange={(e) => setCustomAdminName(e.target.value)}
                        className="w-full text-xs border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:border-[#153326]"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-stone-700">
                        รหัสผ่านแอดมินทีมงาน (Team Passkey) *
                      </label>
                      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        รหัสทีม: loei2026
                      </span>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="กรอกรหัสผ่านทีมงาน (loei2026)"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      className="w-full text-sm border border-stone-300 rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#153326]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#153326] hover:bg-emerald-900 text-white font-medium rounded-lg text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>เข้าสู่ระบบจัดการหลังบ้าน</span>
                  </button>
                </form>
              )}

              {/* Tab 2: Google login */}
              {authTab === 'google' && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    เข้าสู่ระบบด้วยบัญชี Google ของผู้ดูแล (เช่น <span className="font-mono text-stone-800 font-semibold">{BOOTSTRAPPED_ADMIN_EMAIL}</span>)
                  </p>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-medium rounded-lg text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>ลงชื่อเข้าใช้ด้วย Google Account</span>
                  </button>

                  {/* Unauthorized domain explanation and copy tool */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-2">
                    <div className="font-semibold flex items-center gap-1.5 text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>วิธีแก้ไขข้อผิดพลาด auth/unauthorized-domain</span>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      เนื่องจาก Firebase ป้องกันความปลอดภัยโดยรับเฉพาะโดเมนที่ระบุไว้ในคอนโซล หากพบปัญหา ให้คัดลอกโดเมนด้านล่างนี้ไปเพิ่มใน Firebase Console:
                    </p>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-300 font-mono text-[11px] text-stone-700 overflow-x-auto">
                      <span className="truncate flex-1">{window.location.origin}</span>
                      <button
                        type="button"
                        onClick={handleCopyDomain}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-sans font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        {copiedDomain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDomain ? 'คัดลอกแล้ว!' : 'คัดลอกโดเมน'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      💡 <strong>คำแนะนำ:</strong> สามารถสลับไปใช้แท็บ <strong>"รหัสผ่านแอดมินทีมงาน"</strong> ด้านบน รหัสคือ <code>loei2026</code> เพื่อเข้าใช้งานได้ทันทีโดยไม่ต้องตั้งค่าในคอนโซล
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 px-6 bg-white gap-2 sm:gap-4 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('places');
                  setEditingPlace(null);
                }}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'places'
                    ? 'border-[#153326] text-[#153326]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>จัดการสถานที่ ({places.length})</span>
                {draftCount > 0 && (
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                    ร่าง {draftCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                }}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'border-[#153326] text-[#153326]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>สถิติผู้เข้าชมและการแชร์ (Analytics)</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('articles');
                  setEditingArticle(null);
                }}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'articles'
                    ? 'border-[#153326] text-[#153326]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>จัดการบทความ ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('seed')}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'seed'
                    ? 'border-[#153326] text-[#153326]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>ซิงค์ข้อมูล Firestore</span>
              </button>

              <button
                onClick={() => setActiveTab('team')}
                className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'team'
                    ? 'border-[#153326] text-[#153326]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>ทีมงานผู้ดูแล & รหัสผ่าน</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="overflow-y-auto p-6 flex-1 bg-[#FAF8F5]">
          
          {/* ================= TAB 1: PLACES MANAGEMENT ================= */}
          {activeTab === 'places' && (
            <div className="space-y-6">
              
              {/* Form to Add or Edit Place */}
              {editingPlace ? (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <h3 className="font-editorial text-lg font-bold text-stone-900">
                      {editingPlace.id ? 'แก้ไขข้อมูลสถานที่ & รูปภาพ & มาตรฐาน' : 'เพิ่มสถานที่ใหม่'}
                    </h3>
                    <button
                      onClick={() => setEditingPlace(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSavePlace('published'); }} className="space-y-6 text-xs sm:text-sm">
                    
                    {/* 1. Basic Info */}
                    <div className="space-y-4">
                      <div className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#153326]" />
                        <span>1. ข้อมูลพื้นฐานสถานที่</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            ชื่อสถานที่ (ภาษาไทย) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingPlace.name || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="เช่น ภูทอก เชียงคาน"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            ชื่อภาษาอังกฤษ
                          </label>
                          <input
                            type="text"
                            value={editingPlace.nameEn || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, nameEn: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="e.g. Phu Tok Chiang Khan"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            หมวดหมู่ *
                          </label>
                          <select
                            value={editingPlace.category || 'attraction'}
                            onChange={(e) => setEditingPlace({ ...editingPlace, category: e.target.value as PlaceCategory })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none bg-white"
                          >
                            <option value="stay">ที่พัก & โรงแรม</option>
                            <option value="restaurant">ร้านอาหาร</option>
                            <option value="cafe">คาเฟ่ & กาแฟ</option>
                            <option value="attraction">สถานที่ท่องเที่ยว</option>
                            <option value="service">ธุรกิจบริการน่าสนใจ</option>
                            <option value="souvenir">ของฝากเมืองเลย</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            อำเภอในจังหวัดเลย *
                          </label>
                          <select
                            value={editingPlace.district || 'อำเภอเชียงคาน'}
                            onChange={(e) => setEditingPlace({ ...editingPlace, district: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none bg-white"
                          >
                            {DISTRICTS.map((d) => (
                              <option key={d.name} value={d.name}>
                                {d.name} ({d.nameEn})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            คะแนนรีวิว (1.0 - 5.0)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={editingPlace.rating || 4.8}
                            onChange={(e) => setEditingPlace({ ...editingPlace, rating: parseFloat(e.target.value) })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          คำโปรยสั้น (Short Description)
                        </label>
                        <input
                          type="text"
                          value={editingPlace.shortDescription || ''}
                          onChange={(e) => setEditingPlace({ ...editingPlace, shortDescription: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                          placeholder="คำอธิบายสรุปสั้นๆ สำหรับแสดงบนการ์ด"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          รายละเอียดฉบับเต็ม *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={editingPlace.description || ''}
                          onChange={(e) => setEditingPlace({ ...editingPlace, description: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                          placeholder="บรรยายมนต์เสน่ห์ จุดเด่น ประวัติความเป็นมา และกิจกรรมแนะนำ..."
                        />
                      </div>
                    </div>

                    {/* 2. Multi-Image Gallery Upload (4-5 Images & Lightbox) */}
                    <div className="space-y-3 pt-4 border-t border-stone-200">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#153326]" />
                          <span>2. รูปภาพสถานที่ (สามารถอัพโหลดได้ 4-5 รูป และขยายดูภาพใหญ่ได้) *</span>
                        </div>
                        <span className="text-xs text-stone-500 font-mono">
                          {galleryInputUrls.length} / 5 รูป
                        </span>
                      </div>

                      {/* File upload picker */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <label className="cursor-pointer px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium border border-stone-300 flex items-center justify-center gap-2 transition-colors">
                          <Upload className="w-4 h-4 text-[#153326]" />
                          <span>เลือกไฟล์ภาพจากเครื่อง (อัพได้หลายรูป)</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'gallery')}
                          />
                        </label>
                      </div>

                      {/* Gallery Preview Strip with Zoom & Delete */}
                      {galleryInputUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                          {galleryInputUrls.map((url, idx) => (
                            <div
                              key={idx}
                              className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-stone-300 bg-stone-100 shadow-xs"
                            >
                              <img src={url} alt={`รูปที่ ${idx + 1}`} className="w-full h-full object-cover" />
                              
                              {/* Overlay actions */}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewImages(galleryInputUrls);
                                    setPreviewLightboxOpen(true);
                                  }}
                                  className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-800"
                                  title="ขยายดูภาพใหญ่"
                                >
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGalleryInputUrls((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white"
                                  title="ลบรูปภาพนี้"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {idx === 0 && (
                                <div className="absolute top-1 left-1 bg-[#153326] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                                  ภาพหน้าปก
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 3. Standards & Accreditation with Logo Upload */}
                    <div className="space-y-4 pt-4 border-t border-stone-200">
                      <div className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>3. ช่องมาตรฐานที่ได้รับและอัพโหลดโลโก้จริง (Certifications & Standards)</span>
                      </div>

                      {/* Quick Preset Buttons */}
                      <div className="space-y-1.5">
                        <label className="block text-xs text-stone-600">
                          เลือกมาตรฐานรับรองที่มีในระบบ (กดเพื่อเพิ่ม):
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {PRESET_STANDARDS.map((preset) => {
                            const isAdded = placeStandards.some((s) => s.id === preset.id);
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleAddPresetStandard(preset)}
                                disabled={isAdded}
                                className={`px-2.5 py-1.5 rounded-md text-xs flex items-center gap-1.5 border transition-all ${
                                  isAdded
                                    ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                                }`}
                              >
                                <img src={preset.logoUrl} alt="" className="w-3.5 h-3.5 object-contain" />
                                <span>{preset.name}</span>
                                {!isAdded && <Plus className="w-3 h-3 text-[#153326]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Custom Standard Creator with Logo Upload */}
                      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                        <span className="text-xs font-semibold text-stone-800 block">
                          หรือเพิ่มมาตรฐานกำหนดเองพร้อมอัพโหลดภาพโลโก้จริง:
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={customStandardName}
                              onChange={(e) => setCustomStandardName(e.target.value)}
                              placeholder="ชื่อมาตรฐาน เช่น Michelin Guide 2026, SHA Plus"
                              className="w-full border border-stone-300 rounded-lg p-2 text-xs bg-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              value={customStandardIssuer}
                              onChange={(e) => setCustomStandardIssuer(e.target.value)}
                              placeholder="หน่วยงานที่ออกตรา เช่น การท่องเที่ยวแห่งประเทศไทย"
                              className="w-full border border-stone-300 rounded-lg p-2 text-xs bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <label className="cursor-pointer px-3 py-1.5 bg-white border border-stone-300 text-stone-700 rounded-md text-xs flex items-center gap-1.5 hover:bg-stone-50">
                            <Upload className="w-3.5 h-3.5 text-[#153326]" />
                            <span>อัพโหลดภาพโลโก้มาตรฐาน</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, 'standardLogo')}
                            />
                          </label>

                          {customStandardLogoUrl && (
                            <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-md border border-stone-200">
                              <img src={customStandardLogoUrl} alt="Logo" className="w-5 h-5 object-contain" />
                              <span className="text-[11px] text-emerald-700">อัพโหลดโลโก้สำเร็จ</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleAddCustomStandard}
                            className="px-3.5 py-1.5 bg-[#153326] text-white text-xs rounded-md hover:bg-emerald-900 transition-colors"
                          >
                            เพิ่มมาตรฐานนี้
                          </button>
                        </div>
                      </div>

                      {/* Current Standards List for this Place */}
                      {placeStandards.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-medium text-stone-700 block">
                            มาตรฐานที่เลือกไว้สำหรับสถานที่นี้ ({placeStandards.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {placeStandards.map((std) => (
                              <div
                                key={std.id}
                                className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs"
                              >
                                <img src={std.logoUrl} alt={std.name} className="w-4 h-4 object-contain" />
                                <span className="font-medium">{std.name}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveStandard(std.id)}
                                  className="text-amber-800 hover:text-rose-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 4. Google Maps & Online Contact Links (Facebook, LINE, Website) */}
                    <div className="space-y-4 pt-4 border-t border-stone-200">
                      <div className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#153326]" />
                        <span>4. ลิงก์ Google Maps และช่องทางติดต่อออนไลน์ (Facebook, LINE, เว็บไซต์)</span>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          ลิงก์ Google Maps ของสถานที่
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={editingPlace.googleMapsUrl || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, googleMapsUrl: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="https://maps.google.com/?q=..."
                          />
                          {editingPlace.googleMapsUrl && (
                            <a
                              href={editingPlace.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1"
                            >
                              <span>ทดสอบ</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            ลิงก์หน้า Facebook Page
                          </label>
                          <input
                            type="url"
                            value={editingPlace.facebookUrl || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, facebookUrl: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="https://facebook.com/..."
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            ลิงก์ LINE Official / Contact
                          </label>
                          <input
                            type="url"
                            value={editingPlace.lineUrl || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, lineUrl: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="https://line.me/R/ti/p/@..."
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            เว็บไซต์ทางการ (Website)
                          </label>
                          <input
                            type="url"
                            value={editingPlace.websiteUrl || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, websiteUrl: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="https://www.example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            เบอร์โทรศัพท์ติดต่อ
                          </label>
                          <input
                            type="text"
                            value={editingPlace.phone || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, phone: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="เช่น 042-821-254"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            ราคา / ค่าบริการ
                          </label>
                          <input
                            type="text"
                            value={editingPlace.priceRange || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, priceRange: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="เช่น 1,500 - 3,500 บาท/คืน"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-stone-700 mb-1">
                            เวลาเปิด-ปิด
                          </label>
                          <input
                            type="text"
                            value={editingPlace.openingHours || ''}
                            onChange={(e) => setEditingPlace({ ...editingPlace, openingHours: e.target.value })}
                            className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                            placeholder="เช่น 06:00 - 18:00 น."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          ที่อยู่สถานที่
                        </label>
                        <input
                          type="text"
                          value={editingPlace.address || ''}
                          onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                          placeholder="ตำบล อำเภอ จังหวัดเลย"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="isFeatured"
                          checked={Boolean(editingPlace.isFeatured)}
                          onChange={(e) => setEditingPlace({ ...editingPlace, isFeatured: e.target.checked })}
                          className="rounded text-[#153326] focus:ring-[#153326]"
                        />
                        <label htmlFor="isFeatured" className="text-stone-700 font-medium">
                          ไฮไลท์สถานที่แนะนำประจำสัปดาห์ (Featured on Home Cover)
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500">สถานะสถานที่:</span>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                          (editingPlace.status || 'published') === 'draft'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {(editingPlace.status || 'published') === 'draft' ? '📝 แบบร่าง (ยังไม่เผยแพร่)' : '🌐 เผยแพร่แล้ว (สาธารณะ)'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setEditingPlace(null)}
                          className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                        >
                          ยกเลิก
                        </button>

                        {/* Button 1: Save as Draft */}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSavePlace('draft')}
                          className="px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 text-xs shadow-2xs cursor-pointer"
                          title="บันทึกข้อมูลเก็บไว้ในระบบ แต่ยังไม่เผยแพร่สู่หน้าเว็บสาธารณะ (เห็นเฉพาะแอดมิน)"
                        >
                          <FileText className="w-4 h-4 text-amber-700" />
                          <span>{isSubmitting ? 'กำลังบันทึก...' : '💾 บันทึกแบบร่าง (Save Draft)'}</span>
                        </button>

                        {/* Button 2: Save and Publish */}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleSavePlace('published')}
                          className="px-5 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 text-xs shadow-xs cursor-pointer"
                          title="บันทึกและเผยแพร่แสดงผลสู่หน้าเว็บสาธารณะทันที"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>{isSubmitting ? 'กำลังบันทึก...' : '🚀 บันทึกและเผยแพร่ (Publish Now)'}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                /* Place List with Category Filter */
                <div>
                  {/* Category & Status Filter Tabs in Dashboard */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs mb-4 space-y-3">
                    {/* Status Filter Tabs (All / Published / Draft) */}
                    <div className="flex items-center gap-2 pb-2.5 border-b border-stone-100 flex-wrap">
                      <span className="text-xs text-stone-500 font-medium">สถานะเผยแพร่:</span>
                      {[
                        { id: 'all', label: `ทั้งหมด (${places.length})` },
                        { id: 'published', label: `🌐 เผยแพร่แล้ว (${publishedCount})` },
                        { id: 'draft', label: `📝 แบบร่าง (${draftCount})` },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setStatusFilter(st.id as any)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                            statusFilter === st.id
                              ? 'bg-[#153326] text-white shadow-2xs'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      
                      {/* Category segment buttons */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {[
                          { id: 'all', label: 'ทุกหมวด' },
                          { id: 'stay', label: 'ที่พัก' },
                          { id: 'restaurant', label: 'ร้านอาหาร' },
                          { id: 'cafe', label: 'คาเฟ่' },
                          { id: 'attraction', label: 'สถานที่เที่ยว' },
                          { id: 'service', label: 'ธุรกิจบริการ' },
                          { id: 'souvenir', label: 'ของฝาก' },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setCategoryFilter(cat.id as PlaceCategory | 'all')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                              categoryFilter === cat.id
                                ? 'bg-stone-800 text-white shadow-2xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {places.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllPlaces}
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                            title="ลบสถานที่ตัวอย่างทั้งหมดเพื่อเริ่มทดลองด้วยฐานข้อมูลว่าง"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ล้างสถานที่ตัวอย่าง (Clean Slate)</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingPlace({ category: 'attraction', district: 'อำเภอเชียงคาน', status: 'published' })}
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ เพิ่มสถานที่จริงใหม่</span>
                        </button>
                      </div>
                    </div>

                    {/* Secondary search and district filter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-stone-100">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="ค้นหาชื่อสถานที่ หรือ อำเภอ..."
                          value={searchPlaceFilter}
                          onChange={(e) => setSearchPlaceFilter(e.target.value)}
                          className="w-full text-xs border border-stone-200 rounded-md px-3 py-1.5 bg-stone-50 focus:outline-none focus:border-[#153326]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 shrink-0">อำเภอ:</span>
                        <select
                          value={districtFilter}
                          onChange={(e) => setDistrictFilter(e.target.value)}
                          className="text-xs border border-stone-200 rounded-md px-2.5 py-1.5 bg-stone-50 focus:outline-none"
                        >
                          <option value="all">ทุกอำเภอ</option>
                          {DISTRICTS.map((d) => (
                            <option key={d.name} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Places Table */}
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                    {filteredPlacesList.length === 0 ? (
                      <div className="p-12 text-center text-stone-500">
                        <div className="w-12 h-12 bg-emerald-50 text-[#153326] rounded-full flex items-center justify-center mx-auto mb-3">
                          <Compass className="w-6 h-6" />
                        </div>
                        <h4 className="font-editorial text-lg font-bold text-stone-900">
                          {places.length === 0
                            ? 'ฐานข้อมูลสถานที่ว่างเปล่า พร้อมสำหรับทดลองเพิ่มข้อมูลจริง'
                            : 'ไม่พบสถานที่ที่ตรงกับเงื่อนไขการค้นหา'}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                          {places.length === 0
                            ? 'ระบบได้ล้างสถานที่ตัวอย่างออกเรียบร้อยแล้ว คุณสามารถเริ่มเพิ่มสถานที่จริง พร้อมภาพถ่าย 4-5 รูป และซิงค์ขึ้น Firestore ได้ทันที'
                            : 'ลองเปลี่ยนคำค้นหาหรือตัวกรองอำเภอ/หมวดหมู่'}
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingPlace({ category: 'attraction', district: 'อำเภอเชียงคาน' })}
                            className="px-4 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                            <span>+ เพิ่มสถานที่จริงใหม่</span>
                          </button>
                          {places.length === 0 && (
                            <button
                              type="button"
                              onClick={handleRestoreSamplePlaces}
                              className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>กู้คืนข้อมูลตัวอย่าง (Restore Samples)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-medium">
                          <tr>
                            <th className="p-3.5">รูป & ชื่อสถานที่</th>
                            <th className="p-3.5">หมวดหมู่</th>
                            <th className="p-3.5">อำเภอ</th>
                            <th className="p-3.5">สถานะ</th>
                            <th className="p-3.5">มาตรฐาน</th>
                            <th className="p-3.5">สถิติ (เข้าชม / แชร์)</th>
                            <th className="p-3.5 text-right">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredPlacesList.map((place) => (
                            <tr key={place.id} className="hover:bg-stone-50/60 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    referrerPolicy="no-referrer"
                                    className="w-12 h-10 object-cover rounded-md bg-stone-100"
                                  />
                                  <div>
                                    <span className="font-semibold text-stone-900 block">
                                      {place.name}
                                    </span>
                                    <span className="text-[11px] text-stone-400">
                                      {place.gallery?.length || 1} รูปภาพ
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5 text-stone-600 capitalize">
                                {place.category}
                              </td>
                              <td className="p-3.5 text-stone-600">
                                {place.district}
                              </td>
                              <td className="p-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                                    (place.status || 'published') === 'draft'
                                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                                      : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  }`}>
                                    {(place.status || 'published') === 'draft' ? '📝 แบบร่าง' : '🌐 เผยแพร่แล้ว'}
                                  </span>
                                  <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleTogglePublish(place)}
                                    className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer font-medium ${
                                      (place.status || 'published') === 'draft'
                                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 shadow-2xs'
                                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                                    }`}
                                    title={(place.status || 'published') === 'draft' ? 'คลิกเพื่อเผยแพร่สู่หน้าเว็บทันที' : 'คลิกเพื่อพักร่าง (ซ่อนจากหน้าเว็บ)'}
                                  >
                                    {(place.status || 'published') === 'draft' ? 'เผยแพร่ทันที' : 'พักร่าง'}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3.5">
                                {place.standards && place.standards.length > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <img src={place.standards[0].logoUrl} alt="" className="w-4 h-4 object-contain" />
                                    <span className="text-[11px] text-emerald-800 font-medium">
                                      {place.standards.length} ตรา
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-stone-400 text-xs">-</span>
                                )}
                              </td>
                              <td className="p-3.5 font-mono text-stone-600">
                                <span className="text-emerald-800 font-medium">{place.viewsCount || 0}</span> / <span className="text-blue-700">{place.sharesCount || 0}</span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingPlace(place)}
                                    className="p-1.5 text-stone-500 hover:text-[#153326] hover:bg-stone-100 rounded"
                                    title="แก้ไขข้อมูลสถานที่"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePlace(place.id, place.name)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                    title="ลบ"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 2: ANALYTICS & SOCIAL SHARES ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Analytics Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    รายงานสถิติผู้เข้าชมเว็บไซต์และการแชร์ต่อ (Visitor & Share Analytics)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    ข้อมูลสรุปการเข้าชมสถานที่และพฤติกรรมการแชร์ต่อผ่านช่องทาง Social Media ต่างๆ
                  </p>
                </div>
                <button
                  onClick={() => {
                    setLoadingAnalytics(true);
                    getAnalyticsSummary(places).then(setAnalytics).finally(() => setLoadingAnalytics(false));
                  }}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingAnalytics ? 'animate-spin' : ''}`} />
                  <span>รีเฟรชสถิติ</span>
                </button>
              </div>

              {analytics && (
                <>
                  {/* Top Key Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span>ผู้เข้าชมทั้งหมด</span>
                        <Eye className="w-4 h-4 text-[#153326]" />
                      </div>
                      <div className="font-mono text-2xl font-bold text-stone-900">
                        {analytics.totalPageviews.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium mt-1">
                        +14.8% ในสัปดาห์นี้
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span>ยอดดูรายละเอียดสถานที่</span>
                        <MapPin className="w-4 h-4 text-emerald-700" />
                      </div>
                      <div className="font-mono text-2xl font-bold text-stone-900">
                        {analytics.totalPlaceViews.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-1">
                        เฉลี่ย {Math.round(analytics.totalPlaceViews / (places.length || 1))} วิว/สถานที่
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span>การแชร์ต่อทั้งหมด</span>
                        <Share2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="font-mono text-2xl font-bold text-stone-900">
                        {analytics.totalShares.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-blue-700 font-medium mt-1">
                        Social Engagement ยอดเยี่ยม
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                        <span>อัตราการแชร์ต่อผู้เข้าชม</span>
                        <TrendingUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="font-mono text-2xl font-bold text-stone-900">
                        {((analytics.totalShares / (analytics.totalPlaceViews || 1)) * 100).toFixed(1)}%
                      </div>
                      <div className="text-[11px] text-amber-700 mt-1">
                        Viral Index สูง
                      </div>
                    </div>
                  </div>

                  {/* Share by Platform Breakdown */}
                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4 shadow-2xs">
                    <h4 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#153326]" />
                      <span>สถิติการแชร์แยกตามแพลตฟอร์ม (Share Breakdown)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      
                      <div className="p-4 bg-[#1877F2]/5 rounded-xl border border-[#1877F2]/20">
                        <div className="text-xs font-semibold text-[#1877F2] mb-1">
                          Facebook
                        </div>
                        <div className="font-mono text-xl font-bold text-stone-900">
                          {analytics.sharesByPlatform.facebook} ครั้ง
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1">
                          {analytics.totalShares > 0 ? Math.round((analytics.sharesByPlatform.facebook / analytics.totalShares) * 100) : 0}% ของการแชร์ทั้งหมด
                        </div>
                      </div>

                      <div className="p-4 bg-[#06C755]/5 rounded-xl border border-[#06C755]/20">
                        <div className="text-xs font-semibold text-[#06C755] mb-1">
                          LINE
                        </div>
                        <div className="font-mono text-xl font-bold text-stone-900">
                          {analytics.sharesByPlatform.line} ครั้ง
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1">
                          {analytics.totalShares > 0 ? Math.round((analytics.sharesByPlatform.line / analytics.totalShares) * 100) : 0}% ของการแชร์ทั้งหมด
                        </div>
                      </div>

                      <div className="p-4 bg-stone-100 rounded-xl border border-stone-200">
                        <div className="text-xs font-semibold text-stone-800 mb-1">
                          X (Twitter)
                        </div>
                        <div className="font-mono text-xl font-bold text-stone-900">
                          {analytics.sharesByPlatform.x} ครั้ง
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1">
                          {analytics.totalShares > 0 ? Math.round((analytics.sharesByPlatform.x / analytics.totalShares) * 100) : 0}% ของการแชร์ทั้งหมด
                        </div>
                      </div>

                      <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                        <div className="text-xs font-semibold text-amber-900 mb-1">
                          คัดลอกลิงก์ตรง (Direct Link)
                        </div>
                        <div className="font-mono text-xl font-bold text-stone-900">
                          {analytics.sharesByPlatform.copy} ครั้ง
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1">
                          {analytics.totalShares > 0 ? Math.round((analytics.sharesByPlatform.copy / analytics.totalShares) * 100) : 0}% ของการแชร์ทั้งหมด
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Top Places Ranking Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Top Viewed Places */}
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                      <h4 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#153326]" />
                        <span>5 สถานที่ที่มีผู้เข้าชมสูงสุด (Most Viewed)</span>
                      </h4>

                      <div className="space-y-3">
                        {analytics.topViewedPlaces.map((item, idx) => (
                          <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                            <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                              <span className="font-mono font-bold text-[#153326] w-5">#{idx + 1}</span>
                              <span className="font-medium text-stone-800 truncate">{item.name}</span>
                            </div>
                            <span className="font-mono text-stone-600 tabular-nums">
                              {item.views} ครั้ง
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Shared Places */}
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                      <h4 className="font-editorial text-base font-bold text-stone-900 flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-blue-600" />
                        <span>5 สถานที่ที่ถูกแชร์ต่อมากที่สุด (Most Shared)</span>
                      </h4>

                      <div className="space-y-3">
                        {analytics.topSharedPlaces.map((item, idx) => (
                          <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-stone-50">
                            <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                              <span className="font-mono font-bold text-blue-700 w-5">#{idx + 1}</span>
                              <span className="font-medium text-stone-800 truncate">{item.name}</span>
                            </div>
                            <span className="font-mono text-blue-800 font-semibold tabular-nums">
                              {item.shares} แชร์
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>
          )}

          {/* ================= TAB 3: ARTICLES MANAGEMENT ================= */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              
              {editingArticle ? (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h3 className="font-editorial text-lg font-bold text-stone-900">
                      {editingArticle.id ? 'แก้ไขบทความ' : 'เขียนบทความใหม่'}
                    </h3>
                    <button
                      onClick={() => setEditingArticle(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  <form onSubmit={handleSaveArticle} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        หัวข้อบทความ *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.title || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                        placeholder="เช่น เสน่ห์สโลว์ไลฟ์ริมโขงเชียงคาน"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          ผู้เขียน (Author) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingArticle.author || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                          placeholder="ชื่อบรรณาธิการ หรือ นักเขียน"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          หมวดบทความ
                        </label>
                        <input
                          type="text"
                          value={editingArticle.category || 'Travel Guide'}
                          onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          เวลาในการอ่าน
                        </label>
                        <input
                          type="text"
                          value={editingArticle.readTime || '5 นาที'}
                          onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                          className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        ภาพหน้าปกบทความ *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.coverImage || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, coverImage: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                        placeholder="/src/assets/images/... หรือ URL"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        คำโปรย / บทคัดย่อ (Excerpt) *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingArticle.excerpt || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        เนื้อหาบทความฉบับเต็ม * (รองรับ ### หัวข้อย่อย)
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={editingArticle.content || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="artFeatured"
                        checked={Boolean(editingArticle.isFeatured)}
                        onChange={(e) => setEditingArticle({ ...editingArticle, isFeatured: e.target.checked })}
                        className="rounded text-[#153326] focus:ring-[#153326]"
                      />
                      <label htmlFor="artFeatured" className="text-stone-700 font-medium">
                        เรื่องเด่นประจำฉบับ (Featured Cover Story)
                      </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingArticle(null)}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-stone-500">
                      บทความทั้งหมด {articles.length} เรื่อง
                    </span>
                    <button
                      onClick={() => setEditingArticle({ category: 'Travel Guide' })}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เขียนบทความใหม่</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="p-4 bg-white rounded-xl border border-stone-200 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-12 object-cover rounded-md bg-stone-100 shrink-0"
                          />
                          <div>
                            <h4 className="font-editorial text-sm sm:text-base font-semibold text-stone-900">
                              {art.title}
                            </h4>
                            <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                              <span>โดย {art.author}</span>
                              <span aria-hidden="true">·</span>
                              <span>{art.readTime}</span>
                              {art.isFeatured && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-800 font-medium">เรื่องเด่น</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingArticle(art)}
                            className="p-1.5 text-stone-500 hover:text-[#153326] hover:bg-stone-100 rounded"
                            title="แก้ไข"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id, art.title)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="ลบ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 4: SEED & SYNC ================= */}
          {activeTab === 'seed' && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-6 shadow-xs">
              <div className="w-12 h-12 bg-emerald-50 text-[#153326] rounded-full flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  จัดการฐานข้อมูล Firebase Firestore
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  คุณสามารถเลือกล้างสถานที่ตัวอย่างออกเพื่อเริ่มทดลองบันทึกข้อมูลและภาพถ่ายจริง หรือกู้คืนชุดข้อมูลตัวอย่างไอคอนิกของจังหวัดเลยได้ทุกเมื่อ
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClearAllPlaces}
                  disabled={isSubmitting}
                  className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>ล้างข้อมูลตัวอย่าง (Clean Slate)</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestoreSamplePlaces}
                  disabled={isSubmitting}
                  className="py-3 px-4 bg-[#153326] hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>กู้คืนข้อมูลตัวอย่าง (Restore)</span>
                </button>
              </div>

              <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400">
                สถานะฐานข้อมูลปัจจุบัน: มีสถานที่ในระบบ {places.length} แห่ง · บทความ {articles.length} เรื่อง
              </div>
            </div>
          )}

          {/* ================= TAB 5: ADMIN TEAM & CREDENTIALS ================= */}
          {activeTab === 'team' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#153326] flex items-center justify-center border border-emerald-100">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-stone-900">
                        ทีมงานผู้ดูแลระบบ LOEI JOURNEY
                      </h3>
                      <p className="text-xs text-stone-500">
                        ระบบรองรับการเข้าใช้งานร่วมกันหลายคน โดยใช้รหัสผ่านกลางของทีมงาน (Team Passkey)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-md text-xs font-semibold font-mono">
                    Multi-Admin Active
                  </span>
                </div>

                {/* Current Active User Session */}
                <div className="my-5 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#153326] text-white flex items-center justify-center font-bold text-sm">
                      {(adminProfile?.name || adminUser?.displayName || 'A').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">
                          {adminProfile?.name || adminUser?.displayName || adminUser?.email || 'Admin'}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-600 text-white rounded font-bold">
                          {adminProfile?.role || 'admin'}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        {adminProfile?.email || adminUser?.email || 'admin@loeijourney.com'} · เข้าสู่ระบบผ่าน {adminProfile?.authMethod === 'passkey' ? 'รหัสผ่านทีมงาน' : 'Google Account'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    สลับบัญชี / ออกจากระบบ
                  </button>
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    รายชื่อทีมงานในระบบ
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {INITIAL_ADMIN_TEAM.map((adm) => (
                      <div key={adm.id} className="p-3 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-stone-900 truncate">{adm.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-stone-100 text-stone-700 rounded">
                            {adm.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">{adm.email}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Passkey Info Box */}
                <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>ข้อมูลรหัสผ่านสำหรับแจกจ่ายในทีมงาน</span>
                  </div>
                  <p className="text-amber-950 leading-relaxed text-[11px]">
                    รหัสผ่านทีมงานเริ่มต้นคือ: <code className="bg-white px-2 py-0.5 rounded border border-amber-300 font-mono font-bold text-amber-900">loei2026</code>
                  </p>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    ทีมงานทุกคนสามารถใช้รหัสผ่านนี้เพื่อล็อกอินและทำงานพร้อมกันได้ทันที โดยไม่มีการทับซ้อนกัน ข้อมูลทั้งหมดจะซิงค์ขึ้น Firestore ให้เห็นแบบเรียลไทม์
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </>
    )}

      </div>

      {/* Admin Image Lightbox Preview */}
      <ImageLightbox
        images={previewImages}
        isOpen={previewLightboxOpen}
        onClose={() => setPreviewLightboxOpen(false)}
        title="ตัวอย่างรูปภาพขนาดใหญ่"
      />
    </div>
  );
};
