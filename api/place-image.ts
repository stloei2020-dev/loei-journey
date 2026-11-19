import firebaseConfig from '../firebase-applet-config.json';

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

function decodeBase64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function redirectResponse(res: ApiResponse, targetUrl: string) {
  res.statusCode = 302;
  res.setHeader('Location', targetUrl);
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
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
    try {
      const apiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/places/${encodeURIComponent(id)}?key=${firebaseConfig.apiKey}`;
      const resp = await fetch(apiUrl);
      if (resp.ok) {
        const docData = await resp.json() as {
          fields?: {
            imageUrl?: { stringValue?: string };
            gallery?: { arrayValue?: { values?: Array<{ stringValue?: string }> } };
          };
        };
        imageUrl =
          docData.fields?.imageUrl?.stringValue ||
          docData.fields?.gallery?.arrayValue?.values?.[0]?.stringValue ||
          '';
      }
    } catch {
      // Fallback to category image below
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
      const bytes = decodeBase64ToBytes(base64Data);
      const NodeBuffer = (globalThis as { Buffer?: { from: (arr: Uint8Array) => unknown } }).Buffer;
      res.statusCode = 200;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.end(NodeBuffer ? NodeBuffer.from(bytes) : bytes);
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
