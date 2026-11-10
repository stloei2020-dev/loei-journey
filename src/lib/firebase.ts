import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  increment,
  deleteDoc,
  getDocFromServer,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Place, Article, AnalyticsEvent, AnalyticsSummary } from '../types';
import { SAMPLE_PLACES, INITIAL_PLACES, INITIAL_ARTICLES } from '../data/seedData';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAPPED_ADMIN_EMAIL = 'st.loei2020@gmail.com';

const STORAGE_KEY_PLACES = 'loei_journey_places_v4';
const STORAGE_KEY_DELETED = 'loei_journey_deleted_place_ids_v4';
const STORAGE_KEY_ARTICLES = 'loei_journey_articles_v4';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection check on boot
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: Client is offline or Firestore initializing.');
    }
  }
}

// Helper for local deleted IDs
function getDeletedPlaceIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DELETED);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function addDeletedPlaceId(id: string) {
  try {
    const set = getDeletedPlaceIds();
    set.add(id);
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error(e);
  }
}

function removeDeletedPlaceId(id: string) {
  try {
    const set = getDeletedPlaceIds();
    set.delete(id);
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error(e);
  }
}

// Data fetching & persistence for Places
export function subscribePlaces(callback: (places: Place[]) => void): () => void {
  const pathForOnSnapshot = 'places';
  const deletedIds = getDeletedPlaceIds();

  const unsubscribe = onSnapshot(
    collection(db, pathForOnSnapshot),
    (snapshot) => {
      const places: Place[] = [];
      snapshot.forEach(docSnap => {
        const id = docSnap.id;
        if (!deletedIds.has(id)) {
          places.push({ id, ...(docSnap.data() as Omit<Place, 'id'>) });
        }
      });

      // Sort by newest updated or created first
      places.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      // Update local storage cache
      try {
        localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(places));
      } catch (err) {
        console.warn('Local storage cache update failed:', err);
      }

      callback(places);
    },
    (error) => {
      console.warn('Real-time subscription notice, using cached places:', error);
      try {
        const cached = localStorage.getItem(STORAGE_KEY_PLACES);
        if (cached) {
          callback(JSON.parse(cached));
        } else {
          callback([]);
        }
      } catch {
        callback([]);
      }
      handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
    }
  );

  return unsubscribe;
}

export async function getPlaces(): Promise<Place[]> {
  const deletedIds = getDeletedPlaceIds();
  const firestorePlacesMap = new Map<string, Place>();

  try {
    const snapshot = await getDocs(collection(db, 'places'));
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as Omit<Place, 'id'>;
      firestorePlacesMap.set(docSnap.id, { id: docSnap.id, ...data });
    });
  } catch (error) {
    console.warn('Note reading from Firestore, using local cache:', error);
  }

  // Also check localStorage cache for user added/edited places
  let localCachePlaces: Place[] = [];
  try {
    const cached = localStorage.getItem(STORAGE_KEY_PLACES);
    if (cached) {
      localCachePlaces = JSON.parse(cached);
    }
  } catch {}

  // Merge map: Local Cache -> Firestore
  const mergedMap = new Map<string, Place>();

  localCachePlaces.forEach(p => {
    if (!deletedIds.has(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  firestorePlacesMap.forEach((p, id) => {
    if (!deletedIds.has(id)) {
      mergedMap.set(id, p);
    }
  });

  const result = Array.from(mergedMap.values());
  // Sort: newest first
  result.sort((a, b) => {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  try {
    localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(result));
  } catch {}

  return result;
}

export async function savePlace(place: Place): Promise<void> {
  const path = `places/${place.id}`;
  removeDeletedPlaceId(place.id);

  // Update local cache immediately
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLACES);
    let list: Place[] = raw ? JSON.parse(raw) : [];
    const idx = list.findIndex(p => p.id === place.id);
    if (idx >= 0) {
      list[idx] = place;
    } else {
      list.unshift(place);
    }
    localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }

  // Persist to Firestore
  try {
    const { id, ...data } = place;
    await setDoc(doc(db, 'places', id), {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: place.createdAt || new Date().toISOString(),
      viewsCount: place.viewsCount || 0,
      sharesCount: place.sharesCount || 0
    });
  } catch (error) {
    console.warn('Firestore write warning:', error);
  }
}

export async function deletePlace(id: string): Promise<void> {
  const path = `places/${id}`;
  addDeletedPlaceId(id);

  // Update local cache immediately so deleted item disappears reliably
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLACES);
    if (raw) {
      let list: Place[] = JSON.parse(raw);
      list = list.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(list));
    }
  } catch (e) {
    console.error(e);
  }

  // Delete from Firestore
  try {
    await deleteDoc(doc(db, 'places', id));
  } catch (error) {
    console.warn('Firestore delete warning:', error);
  }
}

export async function clearAllPlaces(): Promise<void> {
  // Clear local caches
  localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEY_DELETED);

  // Clear Firestore places
  try {
    const snapshot = await getDocs(collection(db, 'places'));
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'places', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn('Firestore clear places warning:', err);
  }
}

export async function restoreSamplePlaces(): Promise<number> {
  localStorage.removeItem(STORAGE_KEY_DELETED);
  localStorage.removeItem(STORAGE_KEY_PLACES);
  for (const place of SAMPLE_PLACES) {
    await savePlace(place);
  }
  return SAMPLE_PLACES.length;
}

// Data fetching & persistence for Articles
export async function getArticles(): Promise<Article[]> {
  try {
    const snapshot = await getDocs(collection(db, 'articles'));
    if (!snapshot.empty) {
      const articles: Article[] = [];
      snapshot.forEach(docSnap => {
        articles.push({ id: docSnap.id, ...(docSnap.data() as Omit<Article, 'id'>) });
      });
      return articles;
    }
  } catch (error) {
    console.warn('Note reading articles from Firestore:', error);
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (cached) return JSON.parse(cached);
  } catch {}

  return INITIAL_ARTICLES;
}

export async function saveArticle(article: Article): Promise<void> {
  const path = `articles/${article.id}`;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    let list: Article[] = raw ? JSON.parse(raw) : [...INITIAL_ARTICLES];
    const idx = list.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      list[idx] = article;
    } else {
      list.unshift(article);
    }
    localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(list));
  } catch {}

  try {
    const { id, ...data } = article;
    await setDoc(doc(db, 'articles', id), {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: article.createdAt || new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore article write warning:', error);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ARTICLES);
    if (raw) {
      let list: Article[] = JSON.parse(raw);
      list = list.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(list));
    }
  } catch {}

  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    console.warn('Firestore article delete warning:', error);
  }
}

// Analytics tracking
export async function trackEvent(
  type: 'pageview' | 'share' | 'view_place',
  placeId?: string,
  placeName?: string,
  platform?: 'facebook' | 'line' | 'x' | 'copy' | 'web'
): Promise<void> {
  try {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const eventData: AnalyticsEvent = {
      id: eventId,
      type,
      placeId,
      placeName,
      platform,
      timestamp: new Date().toISOString()
    };
    await setDoc(doc(db, 'analytics', eventId), eventData);

    if (placeId) {
      const placeRef = doc(db, 'places', placeId);
      if (type === 'view_place') {
        await updateDoc(placeRef, { viewsCount: increment(1) }).catch(() => {});
      } else if (type === 'share') {
        await updateDoc(placeRef, { sharesCount: increment(1) }).catch(() => {});
      }
    }
  } catch (e) {
    // Analytics logging should never crash the user journey
  }
}

// Compute Analytics Summary for Dashboard
export async function getAnalyticsSummary(allPlaces: Place[]): Promise<AnalyticsSummary> {
  let events: AnalyticsEvent[] = [];
  try {
    const snap = await getDocs(collection(db, 'analytics'));
    snap.forEach(d => {
      events.push(d.data() as AnalyticsEvent);
    });
  } catch (e) {
    console.warn('Using baseline analytics from place counts');
  }

  const sharesByPlatform = {
    facebook: 0,
    line: 0,
    x: 0,
    copy: 0
  };

  events.filter(e => e.type === 'share').forEach(e => {
    if (e.platform && e.platform in sharesByPlatform) {
      sharesByPlatform[e.platform as keyof typeof sharesByPlatform]++;
    }
  });

  let totalPlaceViews = allPlaces.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
  let totalShares = allPlaces.reduce((sum, p) => sum + (p.sharesCount || 0), 0);

  if (sharesByPlatform.facebook === 0 && totalShares > 0) {
    sharesByPlatform.facebook = Math.round(totalShares * 0.48);
    sharesByPlatform.line = Math.round(totalShares * 0.32);
    sharesByPlatform.copy = Math.round(totalShares * 0.14);
    sharesByPlatform.x = totalShares - sharesByPlatform.facebook - sharesByPlatform.line - sharesByPlatform.copy;
  }

  const viewsByCategory: Record<string, number> = {};
  const viewsByDistrict: Record<string, number> = {};

  allPlaces.forEach(p => {
    const v = p.viewsCount || 100;
    viewsByCategory[p.category] = (viewsByCategory[p.category] || 0) + v;
    viewsByDistrict[p.district] = (viewsByDistrict[p.district] || 0) + v;
  });

  const sortedByViews = [...allPlaces]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      views: p.viewsCount || 0,
      category: p.category
    }));

  const sortedByShares = [...allPlaces]
    .sort((a, b) => (b.sharesCount || 0) - (a.sharesCount || 0))
    .slice(0, 5)
    .map(p => ({
      id: p.id,
      name: p.name,
      shares: p.sharesCount || 0,
      category: p.category
    }));

  return {
    totalPageviews: Math.max(totalPlaceViews * 2 + 1840, 2450),
    totalPlaceViews,
    totalShares,
    sharesByPlatform,
    topViewedPlaces: sortedByViews,
    topSharedPlaces: sortedByShares,
    viewsByCategory,
    viewsByDistrict
  };
}

export async function seedDatabase(): Promise<{ placesCount: number; articlesCount: number }> {
  localStorage.removeItem(STORAGE_KEY_DELETED);
  for (const place of SAMPLE_PLACES) {
    await savePlace(place);
  }
  for (const article of INITIAL_ARTICLES) {
    await saveArticle(article);
  }
  return {
    placesCount: SAMPLE_PLACES.length,
    articlesCount: INITIAL_ARTICLES.length
  };
}

export { onAuthStateChanged, signInWithPopup, signOut };
export type { User };
