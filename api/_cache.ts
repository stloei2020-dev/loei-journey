import fs from 'node:fs';
import path from 'node:path';
import firebaseConfig from '../firebase-applet-config.json';

export interface CachedSharePlace {
  id: string;
  name: string;
  district: string;
  category: string;
  shortDescription: string;
  imageUrl: string;
  updatedAt?: string;
}

const MEMORY_CACHE = new Map<string, CachedSharePlace>();
const CACHE_DIR = '/tmp/loei_share_cache';

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 120);
}

export function getCachedSharePlace(id: string): CachedSharePlace | null {
  if (!id) return null;
  const safeId = sanitizeId(id);

  const fromMem = MEMORY_CACHE.get(safeId);
  if (fromMem) return fromMem;

  try {
    const filePath = path.join(CACHE_DIR, `${safeId}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as CachedSharePlace;
      if (parsed && parsed.id) {
        MEMORY_CACHE.set(safeId, parsed);
        return parsed;
      }
    }
  } catch {}

  return null;
}

export function setCachedSharePlace(place: CachedSharePlace): void {
  if (!place || !place.id || !place.name) return;
  const safeId = sanitizeId(place.id);
  const entry: CachedSharePlace = {
    id: place.id,
    name: place.name.slice(0, 160),
    district: (place.district || '').slice(0, 80),
    category: (place.category || 'attraction').slice(0, 40),
    shortDescription: (place.shortDescription || '').slice(0, 220),
    imageUrl: place.imageUrl || '',
    updatedAt: place.updatedAt || new Date().toISOString()
  };

  MEMORY_CACHE.set(safeId, entry);

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const filePath = path.join(CACHE_DIR, `${safeId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry), 'utf8');
  } catch {}
}

export async function fetchPlaceFromFirestore(id: string): Promise<CachedSharePlace | null> {
  if (!id) return null;

  try {
    const apiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/places/${encodeURIComponent(id)}?key=${firebaseConfig.apiKey}`;
    const resp = await fetch(apiUrl);
    if (!resp.ok) return null;

    const docData = (await resp.json()) as {
      fields?: {
        name?: { stringValue?: string };
        district?: { stringValue?: string };
        category?: { stringValue?: string };
        shortDescription?: { stringValue?: string };
        description?: { stringValue?: string };
        imageUrl?: { stringValue?: string };
        updatedAt?: { stringValue?: string };
        gallery?: { arrayValue?: { values?: Array<{ stringValue?: string }> } };
      };
    };

    const name = docData.fields?.name?.stringValue;
    if (!name) return null;

    const place: CachedSharePlace = {
      id,
      name,
      district: docData.fields?.district?.stringValue || '',
      category: docData.fields?.category?.stringValue || 'attraction',
      shortDescription:
        docData.fields?.shortDescription?.stringValue ||
        docData.fields?.description?.stringValue?.slice(0, 200) ||
        '',
      imageUrl:
        docData.fields?.imageUrl?.stringValue ||
        docData.fields?.gallery?.arrayValue?.values?.[0]?.stringValue ||
        '',
      updatedAt: docData.fields?.updatedAt?.stringValue || new Date().toISOString()
    };

    setCachedSharePlace(place);
    return place;
  } catch {
    return null;
  }
}
