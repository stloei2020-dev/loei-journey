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
  deleteDoc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Place, Article } from '../types';
import { INITIAL_PLACES, INITIAL_ARTICLES } from '../data/seedData';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const BOOTSTRAPPED_ADMIN_EMAIL = 'st.loei2020@gmail.com';

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

// Data fetching & persistence
export async function getPlaces(): Promise<Place[]> {
  const path = 'places';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      return INITIAL_PLACES;
    }
    const places: Place[] = [];
    snapshot.forEach(docSnap => {
      places.push({ id: docSnap.id, ...(docSnap.data() as Omit<Place, 'id'>) });
    });
    return places;
  } catch (error) {
    console.warn('Error reading places from Firestore, falling back to curated places:', error);
    return INITIAL_PLACES;
  }
}

export async function savePlace(place: Place): Promise<void> {
  const path = `places/${place.id}`;
  try {
    const { id, ...data } = place;
    await setDoc(doc(db, 'places', id), {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: place.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePlace(id: string): Promise<void> {
  const path = `places/${id}`;
  try {
    await deleteDoc(doc(db, 'places', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getArticles(): Promise<Article[]> {
  const path = 'articles';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (snapshot.empty) {
      return INITIAL_ARTICLES;
    }
    const articles: Article[] = [];
    snapshot.forEach(docSnap => {
      articles.push({ id: docSnap.id, ...(docSnap.data() as Omit<Article, 'id'>) });
    });
    return articles;
  } catch (error) {
    console.warn('Error reading articles from Firestore, falling back to curated articles:', error);
    return INITIAL_ARTICLES;
  }
}

export async function saveArticle(article: Article): Promise<void> {
  const path = `articles/${article.id}`;
  try {
    const { id, ...data } = article;
    await setDoc(doc(db, 'articles', id), {
      ...data,
      updatedAt: new Date().toISOString(),
      createdAt: article.createdAt || new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  const path = `articles/${id}`;
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function seedDatabase(): Promise<{ placesCount: number; articlesCount: number }> {
  for (const place of INITIAL_PLACES) {
    await savePlace(place);
  }
  for (const article of INITIAL_ARTICLES) {
    await saveArticle(article);
  }
  return {
    placesCount: INITIAL_PLACES.length,
    articlesCount: INITIAL_ARTICLES.length
  };
}

export { onAuthStateChanged, signInWithPopup, signOut };
export type { User };
