export type PlaceCategory = 'stay' | 'restaurant' | 'cafe' | 'attraction' | 'souvenir' | 'service';

export interface StandardBadge {
  id: string;
  name: string;
  issuer?: string;
  logoUrl: string;
  description?: string;
}

export type PlaceStatus = 'draft' | 'published';

export interface Place {
  id: string;
  name: string;
  nameEn?: string;
  category: PlaceCategory;
  district: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  gallery?: string[];
  standards?: StandardBadge[];
  address: string;
  phone?: string;
  priceRange?: string;
  openingHours?: string;
  googleMapsUrl?: string;
  facebookUrl?: string;
  lineUrl?: string;
  websiteUrl?: string;
  rating?: number;
  isFeatured?: boolean;
  status?: PlaceStatus;
  tags?: string[];
  viewsCount?: number;
  sharesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminProfile {
  id: string;
  name: string;
  email?: string;
  role: 'superadmin' | 'editor';
  authMethod: 'google' | 'passkey';
  avatar?: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  category: string;
  coverImage: string;
  isFeatured?: boolean;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistrictInfo {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  highlightAttraction: string;
  imageUrl: string;
}

export type PriceFilter = 'all' | 'budget' | 'moderate' | 'luxury';

export interface FilterState {
  searchQuery: string;
  category: PlaceCategory | 'all';
  district: string;
  priceFilter: PriceFilter;
  hasStandardsOnly: boolean;
}

export interface AnalyticsEvent {
  id: string;
  type: 'pageview' | 'share' | 'view_place';
  placeId?: string;
  placeName?: string;
  platform?: 'facebook' | 'line' | 'x' | 'copy' | 'web';
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageviews: number;
  totalPlaceViews: number;
  totalShares: number;
  sharesByPlatform: {
    facebook: number;
    line: number;
    x: number;
    copy: number;
  };
  topViewedPlaces: { id: string; name: string; views: number; category: string }[];
  topSharedPlaces: { id: string; name: string; shares: number; category: string }[];
  viewsByCategory: Record<string, number>;
  viewsByDistrict: Record<string, number>;
}
