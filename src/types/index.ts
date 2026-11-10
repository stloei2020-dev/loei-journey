export type PlaceCategory = 'stay' | 'restaurant' | 'cafe' | 'attraction' | 'souvenir';

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
  address: string;
  phone?: string;
  priceRange?: string;
  openingHours?: string;
  googleMapsUrl?: string;
  rating?: number;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
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

export interface FilterState {
  searchQuery: string;
  category: PlaceCategory | 'all';
  district: string;
}
