import React, { useState } from 'react';
import { Place, Article, PlaceCategory } from '../types';
import { DISTRICTS } from '../data/seedData';
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
  BOOTSTRAPPED_ADMIN_EMAIL
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
  RefreshCw
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: User | null;
  places: Place[];
  articles: Article[];
  onRefreshData: () => Promise<void>;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  places,
  articles,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'places' | 'articles' | 'seed'>('places');
  const [editingPlace, setEditingPlace] = useState<Partial<Place> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setStatusMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setStatusMessage({ text: 'เข้าสู่ระบบสำเร็จ' });
      await onRefreshData();
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        text: 'ไม่สามารถเข้าสู่ระบบผ่าน Google ได้: ' + (err.message || String(err)),
        isError: true
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStatusMessage({ text: 'ออกจากระบบเรียบร้อย' });
    } catch (err: any) {
      console.error(err);
    }
  };

  // Place form submission
  const handleSavePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace?.name || !editingPlace?.category || !editingPlace?.district || !editingPlace?.description || !editingPlace?.imageUrl) {
      setStatusMessage({ text: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ, หมวดหมู่, อำเภอ, รายละเอียด, รูปภาพ)', isError: true });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const id = editingPlace.id || `place-${Date.now()}`;
      const placeData: Place = {
        id,
        name: editingPlace.name,
        nameEn: editingPlace.nameEn || '',
        category: editingPlace.category as PlaceCategory,
        district: editingPlace.district,
        description: editingPlace.description,
        shortDescription: editingPlace.shortDescription || editingPlace.description.slice(0, 150),
        imageUrl: editingPlace.imageUrl,
        gallery: editingPlace.gallery || [editingPlace.imageUrl],
        address: editingPlace.address || `อำเภอ${editingPlace.district} จังหวัดเลย`,
        phone: editingPlace.phone || '',
        priceRange: editingPlace.priceRange || '',
        openingHours: editingPlace.openingHours || 'เปิดบริการทุกวัน',
        googleMapsUrl: editingPlace.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(editingPlace.name + ' เลย')}`,
        rating: Number(editingPlace.rating) || 4.8,
        isFeatured: Boolean(editingPlace.isFeatured),
        tags: editingPlace.tags || ['ท่องเที่ยวเลย']
      };

      await savePlace(placeData);
      await onRefreshData();
      setEditingPlace(null);
      setStatusMessage({ text: `บันทึกสถานที่ "${placeData.name}" สำเร็จ!` });
    } catch (err: any) {
      setStatusMessage({ text: 'เกิดข้อผิดพลาดในการบันทึก: ' + (err.message || String(err)), isError: true });
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

  // Article form submission
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
                LOEI JOURNEY — ระบบจัดการหลังบ้าน (CMS)
              </h2>
              <p className="text-[11px] text-stone-300 font-sans">
                จัดการฐานข้อมูลสถานที่ท่องเที่ยว ที่พัก คาเฟ่ ร้านอาหาร และบทความนิตยสาร
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
            {adminUser ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>เข้าสู่ระบบแล้ว: {adminUser.email || adminUser.displayName || 'Admin'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                <span>ยังไม่ได้เข้าสู่ระบบ (สามารถดูและจัดการข้อมูลได้)</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!adminUser ? (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#153326] hover:bg-emerald-900 text-white rounded-md text-xs font-medium transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>เข้าสู่ระบบด้วย Google ({BOOTSTRAPPED_ADMIN_EMAIL})</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-md text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ออกจากระบบ</span>
              </button>
            )}
          </div>
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-white gap-4">
          <button
            onClick={() => {
              setActiveTab('places');
              setEditingPlace(null);
            }}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'places'
                ? 'border-[#153326] text-[#153326]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>จัดการสถานที่ ({places.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('articles');
              setEditingArticle(null);
            }}
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
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
            className={`py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'seed'
                ? 'border-[#153326] text-[#153326]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ซิงค์ข้อมูล Firestore</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="overflow-y-auto p-6 flex-1 bg-[#FAF8F5]">
          
          {/* TAB 1: PLACES */}
          {activeTab === 'places' && (
            <div className="space-y-6">
              
              {/* If editing or adding new place */}
              {editingPlace ? (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
                    <h3 className="font-editorial text-lg font-bold text-stone-900">
                      {editingPlace.id ? 'แก้ไขข้อมูลสถานที่' : 'เพิ่มสถานที่ใหม่'}
                    </h3>
                    <button
                      onClick={() => setEditingPlace(null)}
                      className="text-xs text-stone-500 hover:text-stone-800 underline"
                    >
                      ยกเลิก
                    </button>
                  </div>

                  <form onSubmit={handleSavePlace} className="space-y-4 text-xs sm:text-sm">
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
                              {d.name}
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
                        ลิงก์รูปภาพหน้าปก (URL หรือ Asset Path) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPlace.imageUrl || ''}
                        onChange={(e) => setEditingPlace({ ...editingPlace, imageUrl: e.target.value })}
                        className="w-full border border-stone-300 rounded-lg p-2.5 focus:border-[#153326] focus:outline-none"
                        placeholder="/src/assets/images/... หรือ https://..."
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        คำโปรยสั้น (Short Excerpt)
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">
                          เบอร์โทรศัพท์
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
                        ไฮไลท์แนะนำบนหน้าแรก (Featured on Home Cover)
                      </label>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingPlace(null)}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-stone-500">
                      รายการสถานที่ทั้งหมด {places.length} แห่ง
                    </span>
                    <button
                      onClick={() => setEditingPlace({ category: 'attraction', district: 'อำเภอเชียงคาน' })}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#153326] hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มสถานที่ใหม่</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-medium">
                          <tr>
                            <th className="p-3.5">รูป & ชื่อสถานที่</th>
                            <th className="p-3.5">หมวดหมู่</th>
                            <th className="p-3.5">อำเภอ</th>
                            <th className="p-3.5">คะแนน</th>
                            <th className="p-3.5 text-right">การจัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {places.map((place) => (
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
                                      {place.address}
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
                              <td className="p-3.5 font-mono text-amber-700">
                                {place.rating ? place.rating.toFixed(1) : '-'}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingPlace(place)}
                                    className="p-1.5 text-stone-500 hover:text-[#153326] hover:bg-stone-100 rounded"
                                    title="แก้ไข"
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
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              
              {editingArticle ? (
                <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
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
                          placeholder="เช่น Travel Guide, Gastronomy, Culture"
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
                        placeholder="สรุปย่อความน่าสนใจของบทความ..."
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
                        placeholder="เขียนเนื้อหาบทความ..."
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

          {/* TAB 3: SEED & SYNC */}
          {activeTab === 'seed' && (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-stone-200 text-center space-y-5 shadow-xs">
              <div className="w-12 h-12 bg-emerald-50 text-[#153326] rounded-full flex items-center justify-center mx-auto">
                <Database className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  ซิงค์ข้อมูลนิตยสารตั้งต้นสู่ Firebase Firestore
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  กดปุ่มนี้เพื่ออัปโหลดสถานที่ท่องเที่ยวไอคอนิกของจังหวัดเลยทั้ง 14 อำเภอ 
                  รวมถึงที่พัก คาเฟ่ ร้านอาหาร และบทความรีวิว เข้าสู่ฐานข้อมูลคลาวด์ Firestore ทันที
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-xl text-xs text-stone-600 text-left space-y-1.5 border border-stone-200">
                <div className="font-semibold text-stone-800 mb-1">ข้อมูลที่จะทำการซิงค์:</div>
                <div>• สถานที่ท่องเที่ยว: ภูทอก, ผาหล่มสัก ภูกระดึง, ภูป่าเปาะ, ถนนคนเดินเชียงคาน</div>
                <div>• ที่พัก: สุเนต์ตา โฮสเทล, ภูผาน้ำ รีสอร์ท, ดิ โอลด์ เชียงคาน</div>
                <div>• ร้านอาหาร & คาเฟ่: ป้าบัวหวาน ข้าวปุ้นน้ำแจ่ว, เดอเลย คาเฟ่, เฮือนหลวงพระบาง</div>
                <div>• บทความนิตยสาร: บันทึกล่าทะเลหมอก 4 ภู, มนต์เสน่ห์สโลว์ไลฟ์เชียงคาน</div>
              </div>

              <button
                onClick={handleSeedDatabase}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#153326] hover:bg-emerald-900 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'กำลังซิงค์ข้อมูล...' : 'เริ่มการซิงค์ข้อมูลสู่ Firestore'}</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
