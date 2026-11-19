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

interface CompactSnapshot {
  i?: string;
  n?: string;
  c?: string;
  d?: string;
  sd?: string;
  ds?: string;
  im?: string;
}

function getHeaderString(val: string | string[] | undefined): string {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
}

function getQueryString(val: string | string[] | undefined): string {
  if (!val) return '';
  return Array.isArray(val) ? val[0] : val;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeFallbackSnapshot(encoded: string): CompactSnapshot | null {
  try {
    if (!encoded) return null;
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    const json = Buffer.from(normalized + pad, 'base64').toString('utf8');
    return JSON.parse(json) as CompactSnapshot;
  } catch {
    return null;
  }
}

export function isSocialCrawler(userAgent: string): boolean {
  return /(facebookexternalhit|Facebot|Linespider|line-poker|Line|LINE|Twitterbot|Slackbot|Discordbot|WhatsApp|TelegramBot|LinkedInBot|Pinterest|kakaotalk-scrap|Applebot)/i.test(
    userAgent
  );
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const placeId = getQueryString(req.query?.place).trim();
  const encodedFallback = getQueryString(req.query?.d).trim();
  const versionParam = getQueryString(req.query?.v).trim();
  const userAgent = getHeaderString(req.headers['user-agent']);

  const rawHost = getHeaderString(req.headers['x-forwarded-host']) || getHeaderString(req.headers.host);
  const rawProto = getHeaderString(req.headers['x-forwarded-proto']) || 'https';
  const origin = rawHost ? `${rawProto}://${rawHost}` : 'https://loei-journey.vercel.app';

  const targetParams = new URLSearchParams();
  if (placeId) targetParams.set('place', placeId);
  if (encodedFallback) targetParams.set('d', encodedFallback);
  const targetUrl = `${origin}/${targetParams.toString() ? `?${targetParams.toString()}` : ''}`;

  // Human visitors clicking /api/share directly go straight to the interactive SPA place page
  if (!isSocialCrawler(userAgent)) {
    res.statusCode = 302;
    res.setHeader('Location', targetUrl);
    res.end();
    return;
  }

  let shopName = '';
  let district = '';
  let description =
    'แนะนำที่พัก ร้านอาหาร คาเฟ่ สถานที่ท่องเที่ยว และธุรกิจบริการในจังหวัดเลย โดยสำนักงานพาณิชย์จังหวัดเลย';
  let category = 'attraction';
  let fallbackImg = '';

  const snapshot = decodeFallbackSnapshot(encodedFallback);
  if (snapshot?.n) {
    shopName = snapshot.n;
    district = snapshot.d || '';
    description = snapshot.sd || snapshot.ds || description;
    category = snapshot.c || category;
    fallbackImg = snapshot.im || '';
  }

  // 1. Check warm share cache first (contains real name & photo even during Firestore quota limits)
  if (placeId) {
    const cached = getCachedSharePlace(placeId);
    if (cached) {
      shopName = cached.name || shopName;
      district = cached.district || district;
      description = cached.shortDescription || description;
      category = cached.category || category;
      if (cached.imageUrl && !cached.imageUrl.startsWith('data:')) {
        fallbackImg = cached.imageUrl;
      }
    } else {
      // 2. Fetch canonical document from Firestore
      const fromFirestore = await fetchPlaceFromFirestore(placeId);
      if (fromFirestore) {
        shopName = fromFirestore.name || shopName;
        district = fromFirestore.district || district;
        description = fromFirestore.shortDescription || description;
        category = fromFirestore.category || category;
        if (fromFirestore.imageUrl && !fromFirestore.imageUrl.startsWith('data:')) {
          fallbackImg = fromFirestore.imageUrl;
        }
      }
    }
  }

  const title = shopName
    ? `${shopName}${district ? ` · ${district}` : ''} | LOEI JOURNEY`
    : 'LOEI JOURNEY | เลย เจอร์นีย์ - นิตยสารท่องเที่ยวจังหวัดเลย';

  const imgParams = new URLSearchParams();
  if (placeId) imgParams.set('id', placeId);
  if (category) imgParams.set('cat', category);
  if (versionParam) imgParams.set('v', versionParam);
  if (fallbackImg && !fallbackImg.startsWith('data:')) {
    imgParams.set('img', fallbackImg);
  }
  const ogImageUrl = `${origin}/api/place-image?${imgParams.toString()}`;

  const safeTitle = escapeHtml(title);
  const safeShopName = escapeHtml(shopName || 'LOEI JOURNEY');
  const safeDescription = escapeHtml(description.slice(0, 160));
  const safeImageUrl = escapeHtml(ogImageUrl);
  const safeTargetUrl = escapeHtml(targetUrl);

  const html = `<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="LOEI JOURNEY | เลย เจอร์นีย์" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:alt" content="${safeShopName}" />
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="600" />
    <meta property="og:url" content="${safeTargetUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  </head>
  <body>
    <h1>${safeShopName}</h1>
    <p>${safeDescription}</p>
    <img src="${safeImageUrl}" alt="${safeShopName}" />
  </body>
</html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.end(html);
}
