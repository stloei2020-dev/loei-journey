import { Place, PlaceCategory } from '../types';

export const OFFICIAL_CONTACT = {
  organization: 'สำนักงานพาณิชย์จังหวัดเลย',
  address: '302/9 ถนนเลย-เชียงคาน ตำบลกุดป่อง อำเภอเมืองเลย จังหวัดเลย',
  phones: [
    { display: '042 811 163', tel: '042811163' },
    { display: '042 811 485', tel: '042811485' }
  ],
  phoneDisplay: '042 811 163, 042 811 485',
  websiteUrl: 'https://loei.moc.go.th',
  websiteLabel: 'เว็บไซต์สำนักงานพาณิชย์จังหวัดเลย'
} as const;

const FALLBACK_PLACE_IMAGE = '/images/loei_hero_sea_of_mist_1794278412692.jpg';

function encodeUtf8Base64Url(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

function decodeUtf8Base64Url(b64: string): string {
  try {
    const normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const binary = atob(normalized + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

interface CompactPlaceSnapshot {
  i: string; // id
  n: string; // name
  ne?: string; // nameEn
  c: string; // category
  d: string; // district
  sd?: string; // shortDescription
  ds?: string; // description snippet
  ad?: string; // address
  ph?: string; // phone
  oh?: string; // openingHours
  pr?: string; // priceRange
  gm?: string; // googleMapsUrl
  fb?: string; // facebookUrl
  ln?: string; // lineUrl
  wb?: string; // websiteUrl
  rt?: number; // rating
  tg?: string[]; // tags
  im?: string; // non-base64 imageUrl
}

export function buildPlaceShareUrl(placeOrId: Place | string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';

  if (typeof placeOrId === 'string') {
    url.searchParams.set('place', placeOrId);
    return url.toString();
  }

  url.searchParams.set('place', placeOrId.id);

  // Include compact fallback snapshot (no base64 blobs) so shared links keep working
  // even if Firestore daily free-tier read quota is temporarily exhausted
  const rawImg = placeOrId.imageUrl || '';
  const safeImg =
    (rawImg.startsWith('http://') || rawImg.startsWith('https://') || rawImg.startsWith('/')) &&
    rawImg.length <= 320
      ? rawImg
      : undefined;

  const snapshot: CompactPlaceSnapshot = {
    i: placeOrId.id,
    n: placeOrId.name.slice(0, 120),
    c: placeOrId.category,
    d: placeOrId.district,
    sd: (placeOrId.shortDescription || '').slice(0, 140) || undefined,
    ds: (placeOrId.description || '').slice(0, 320) || undefined,
    ad: (placeOrId.address || '').slice(0, 160) || undefined,
    ph: (placeOrId.phone || '').slice(0, 60) || undefined,
    oh: (placeOrId.openingHours || '').slice(0, 80) || undefined,
    pr: (placeOrId.priceRange || '').slice(0, 60) || undefined,
    gm: placeOrId.googleMapsUrl && placeOrId.googleMapsUrl.length <= 220 ? placeOrId.googleMapsUrl : undefined,
    fb: placeOrId.facebookUrl && placeOrId.facebookUrl.length <= 160 ? placeOrId.facebookUrl : undefined,
    ln: placeOrId.lineUrl && placeOrId.lineUrl.length <= 160 ? placeOrId.lineUrl : undefined,
    wb: placeOrId.websiteUrl && placeOrId.websiteUrl.length <= 160 ? placeOrId.websiteUrl : undefined,
    rt: placeOrId.rating,
    tg: placeOrId.tags?.slice(0, 4),
    im: safeImg
  };

  if (placeOrId.nameEn) {
    snapshot.ne = placeOrId.nameEn.slice(0, 100);
  }

  // Strip undefined properties before encoding
  const compact = Object.fromEntries(
    Object.entries(snapshot).filter(([, v]) => v !== undefined && v !== '')
  );

  const encoded = encodeUtf8Base64Url(JSON.stringify(compact));
  if (encoded && encoded.length <= 1500) {
    url.searchParams.set('d', encoded);
  }
  url.searchParams.set('v', String(Date.now()).slice(-6));

  return url.toString();
}

export async function warmShareCache(place: Place): Promise<void> {
  if (typeof window === 'undefined' || !place?.id || !place?.name) return;
  try {
    await fetch('/api/share-cache', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: place.id,
        name: place.name,
        district: place.district,
        category: place.category,
        shortDescription: (place.shortDescription || place.description || '').slice(0, 180),
        imageUrl: place.imageUrl || (place.gallery && place.gallery[0]) || '',
        updatedAt: place.updatedAt || new Date().toISOString()
      })
    });
  } catch {
    // Non-blocking warm-up
  }
}

export function decodePlaceShareFallback(search: string, fallbackId?: string): Place | null {
  try {
    const params = new URLSearchParams(search);
    const encoded = params.get('d');
    if (!encoded) return null;

    const json = decodeUtf8Base64Url(encoded);
    if (!json) return null;

    const snap = JSON.parse(json) as CompactPlaceSnapshot;
    if (!snap || !snap.n || !snap.d) return null;

    const validCategories: PlaceCategory[] = ['stay', 'restaurant', 'cafe', 'attraction', 'souvenir', 'service'];
    const category: PlaceCategory = validCategories.includes(snap.c as PlaceCategory)
      ? (snap.c as PlaceCategory)
      : 'attraction';

    const imageUrl = snap.im || FALLBACK_PLACE_IMAGE;

    return {
      id: snap.i || fallbackId || `place-${Date.now()}`,
      name: snap.n,
      nameEn: snap.ne,
      category,
      district: snap.d,
      shortDescription: snap.sd || snap.ds || snap.n,
      description: snap.ds || snap.sd || snap.n,
      imageUrl,
      gallery: [imageUrl],
      address: snap.ad || `${snap.d} จังหวัดเลย`,
      phone: snap.ph,
      openingHours: snap.oh,
      priceRange: snap.pr,
      googleMapsUrl: snap.gm,
      facebookUrl: snap.fb,
      lineUrl: snap.ln,
      websiteUrl: snap.wb,
      rating: snap.rt,
      tags: snap.tg,
      status: 'published'
    };
  } catch {
    return null;
  }
}

export function buildArticleShareUrl(articleId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('article', articleId);
  return url.toString();
}
