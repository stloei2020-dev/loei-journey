import { fetchPlaceFromFirestore, getCachedSharePlace } from './_cache';

interface ApiRequest {
  query?: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface ApiResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(data?: unknown): void;
}

const FALLBACK_IMAGES: Record<string, string> = {
  stay: '/images/loei_hero_sea_of_mist_1794278412692.jpg',
  attraction: '/images/phu_kradueng_cliff_pine_1794278415253.jpg',
  restaurant: '/images/loei_cuisine_and_cafe_1794278415525.jpg',
  cafe: '/images/loei_cuisine_and_cafe_1794278415525.jpg',
  souvenir: '/images/chiang_khan_walking_street_1794278414260.jpg',
  service: '/images/phu_pa_po_mountain_1794278416294.jpg',
  default: '/images/loei_hero_sea_of_mist_1794278412692.jpg'
};

function getHeaderString(val: string | string[] | undefined): string {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
}

function getQueryString(val: string | string[] | undefined): string {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
}

function redirectResponse(res: ApiResponse, targetUrl: string) {
  res.statusCode = 302;
  res.setHeader('Location', targetUrl);
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
  res.end();
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const id = getQueryString(req.query?.id).trim();
  const cat = getQueryString(req.query?.cat).trim() || 'default';
  const fallbackParamImg = getQueryString(req.query?.img).trim();

  const rawHost = getHeaderString(req.headers['x-forwarded-host']) || getHeaderString(req.headers.host);
  const rawProto = getHeaderString(req.headers['x-forwarded-proto']) || 'https';
  const origin = rawHost ? `${rawProto}://${rawHost}` : '';

  let imageUrl = '';

  if (id) {
    // 1. Check local share cache first (works even if Firestore quota is exceeded)
    const cached = getCachedSharePlace(id);
    if (cached?.imageUrl) {
      imageUrl = cached.imageUrl;
    }

    // 2. Otherwise read canonical place document from Firestore
    if (!imageUrl) {
      const fromFirestore = await fetchPlaceFromFirestore(id);
      if (fromFirestore?.imageUrl) {
        imageUrl = fromFirestore.imageUrl;
      }
    }
  }

  if (!imageUrl && fallbackParamImg) {
    imageUrl = fallbackParamImg;
  }

  // Decode inline base64 photo uploaded via Admin CMS and stream binary image for OpenGraph crawlers
  if (imageUrl.startsWith('data:image/')) {
    const match = imageUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const base64Data = match[2];
      const bytes = Buffer.from(base64Data, 'base64');
      res.statusCode = 200;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
      res.end(bytes);
      return;
    }
  }

  // External HTTP(S) image
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    redirectResponse(res, imageUrl);
    return;
  }

  // Static local image path
  const resolvedPath = imageUrl.startsWith('/')
    ? imageUrl
    : (FALLBACK_IMAGES[cat] || FALLBACK_IMAGES.default);

  const finalUrl = origin ? `${origin}${resolvedPath}` : resolvedPath;
  redirectResponse(res, finalUrl);
}
