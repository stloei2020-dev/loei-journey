/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Place, Article, PlaceCategory } from './types';
import {
  getPlaces,
  getArticles,
  testConnection,
  trackEvent,
  auth,
  onAuthStateChanged,
  signOut,
  User
} from './lib/firebase';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { FeaturedWeeklySection } from './components/FeaturedWeeklySection';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { DistrictExplorer } from './components/DistrictExplorer';
import { ArticlesSection } from './components/ArticlesSection';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';
import {
  Compass,
  Bed,
  Utensils,
  Coffee,
  Sparkles,
  Mountain,
  Search,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Navigation & Filtering State
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize and load data
  const loadData = async () => {
    try {
      const [fetchedPlaces, fetchedArticles] = await Promise.all([
        getPlaces(),
        getArticles()
      ]);
      setPlaces(fetchedPlaces);
      setArticles(fetchedArticles);
    } catch (err) {
      console.error('Failed to load travel data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    loadData();
    trackEvent('pageview', undefined, undefined, 'web');

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Sync tab navigation with filters
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setSearchQuery('');
    if (tab === 'home') {
      setSelectedCategory('all');
      setSelectedDistrict('all');
    } else if (tab === 'stay') {
      setSelectedCategory('stay');
    } else if (tab === 'dining') {
      setSelectedCategory('restaurant');
    } else if (tab === 'attractions') {
      setSelectedCategory('attraction');
    } else if (tab === 'districts') {
      const el = document.getElementById('districts-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'articles') {
      const el = document.getElementById('articles-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('home');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedDistrict('all');
    setSearchQuery('');
  };

  // Filtered places calculation
  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'restaurant') {
          // In dining tab, show restaurants and cafes
          if (currentTab === 'dining') {
            if (p.category !== 'restaurant' && p.category !== 'cafe') return false;
          } else {
            if (p.category !== selectedCategory) return false;
          }
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }

      // District filter
      if (selectedDistrict !== 'all' && p.district !== selectedDistrict) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesEn = p.nameEn ? p.nameEn.toLowerCase().includes(q) : false;
        const matchesDistrict = p.district.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(q)) : false;
        return matchesName || matchesEn || matchesDistrict || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [places, selectedCategory, selectedDistrict, searchQuery, currentTab]);

  // Featured place of the week
  const featuredPlace = useMemo(() => {
    return places.find((p) => p.id === 'phu-tok-chiang-khan') || places[0];
  }, [places]);

  // Curated lists for home tab
  const stays = useMemo(() => places.filter((p) => p.category === 'stay'), [places]);
  const diningAndCafes = useMemo(() => places.filter((p) => p.category === 'restaurant' || p.category === 'cafe'), [places]);
  const attractions = useMemo(() => places.filter((p) => p.category === 'attraction'), [places]);

  const isFiltered = selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#153326] selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        adminUser={adminUser}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogoutAdmin={() => signOut(auth)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        {currentTab === 'home' && !isFiltered && (
          <HeroBanner
            onSearch={handleHeroSearch}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectDistrict={(district) => {
              setSelectedDistrict(district);
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Global Filter Bar */}
        <div id="catalog-section">
          <CategoryFilterBar
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (currentTab !== 'home') setCurrentTab('home');
            }}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(dist) => setSelectedDistrict(dist)}
            totalCount={filteredPlaces.length}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />
        </div>

        {/* Weekly Editor's Pick (Shown on Home when not filtering) */}
        {currentTab === 'home' && !isFiltered && featuredPlace && (
          <FeaturedWeeklySection
            place={featuredPlace}
            onSelect={(place) => setSelectedPlace(place)}
          />
        )}

        {/* Dynamic Catalog Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Active Search & Filter Indicator */}
          {isFiltered && (
            <div className="mb-8 pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                  ผลการค้นหาและตัวกรอง
                </h2>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  {searchQuery && <span>คำค้นหา: "{searchQuery}"</span>}
                  {selectedCategory !== 'all' && <span>หมวดหมู่: {selectedCategory}</span>}
                  {selectedDistrict !== 'all' && <span>พื้นที่: {selectedDistrict}</span>}
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs text-[#153326] font-medium hover:underline"
              >
                ล้างการค้นหาทั้งหมด
              </button>
            </div>
          )}

          {/* If filtering or in non-home tab, render simple grid */}
          {isFiltered || currentTab !== 'home' ? (
            <div>
              {filteredPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={(p) => setSelectedPlace(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 max-w-lg mx-auto p-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-stone-800">
                    ไม่พบสถานที่ตามเงื่อนไขที่เลือก
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    ลองปรับเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อค้นหาที่พัก ร้านอาหาร และสถานที่ท่องเที่ยวในจังหวัดเลย
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-[#153326] text-white text-xs font-medium rounded-lg hover:bg-emerald-900 transition-colors"
                  >
                    ดูสถานที่ทั้งหมด
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Curated Magazine Layout for Homepage */
            <div className="space-y-16">
              
              {/* SECTION: ACCOMMODATIONS (ที่พักยอดนิยม) */}
              <div>
                <div className="flex items-end justify-between mb-8 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-1">
                      <Bed className="w-3.5 h-3.5" />
                      <span>CURATED RETREATS & LODGES</span>
                    </div>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                      ที่พักยอดนิยมในสายหมอก
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('stay');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="text-xs font-medium text-[#153326] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>ดูที่พักทั้งหมด ({stays.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {stays.slice(0, 3).map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={(p) => setSelectedPlace(p)}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION: DINING & CAFES (ร้านเด็ดและคาเฟ่) */}
              <div>
                <div className="flex items-end justify-between mb-8 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-1">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>TASTES OF LOEI & COFFEE CULTURE</span>
                    </div>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                      ร้านอาหารเด็ด & คาเฟ่บรรยากาศดี
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('restaurant');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="text-xs font-medium text-[#153326] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>ดูทั้งหมด ({diningAndCafes.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {diningAndCafes.slice(0, 4).map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={(p) => setSelectedPlace(p)}
                    />
                  ))}
                </div>
              </div>

              {/* SECTION: ATTRACTIONS (สถานที่ท่องเที่ยวห้ามพลาด) */}
              <div>
                <div className="flex items-end justify-between mb-8 pb-3 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-1">
                      <Mountain className="w-3.5 h-3.5" />
                      <span>NATURAL WONDERS & MUST-VISIT</span>
                    </div>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
                      สถานที่ท่องเที่ยวห้ามพลาด
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('attraction');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="text-xs font-medium text-[#153326] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>ดูที่เที่ยวทั้งหมด ({attractions.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {attractions.slice(0, 3).map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onSelect={(p) => setSelectedPlace(p)}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* 14 Districts Explorer Section */}
        <div id="districts-section">
          <DistrictExplorer
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(districtName) => {
              setSelectedDistrict(districtName);
              setSelectedCategory('all');
              setCurrentTab('home');
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Editorial Articles & Travel Guides */}
        <div id="articles-section">
          <ArticlesSection articles={articles} />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onSelectDistrict={(d) => {
          setSelectedDistrict(d);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <PlaceDetailModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminUser={adminUser}
        places={places}
        articles={articles}
        onRefreshData={loadData}
      />
    </div>
  );
}
