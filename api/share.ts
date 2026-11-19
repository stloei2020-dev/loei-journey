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
    const binary = atob(normalized + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as CompactSnapshot;
  } catch {
    return null;
  }
}

function isSocialCrawler(userAgent: string): boolean {
  return /(facebookexternalhit|Facebot|Linespider|Line|LINE|Twitterbot|Slackbot|Discordbot|WhatsApp|TelegramBot|LinkedInBot|Pinterest|kakaotalk-scrap|Applebot)/i.test(
    userAgent
  );
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  const placeId = getQueryString(req.query?.place).trim();
  const encodedFallback = getQueryString(req.query?.d).trim();
  const userAgent = getHeaderString(req.headers['user-agent']);

  const rawHost = getHeaderString(req.headers['x-forwarded-host']) || getHeaderString(req.headers.host);
  const rawProto = getHeaderString(req.headers['x-forwarded-proto']) || 'https';
  const origin = rawHost ? `${rawProto}://${rawHost}` : 'https://loei-journey.vercel.app';

  const targetParams = new URLSearchParams();
  if (placeId) targetParams.set('place', placeId);
  if (encodedFallback) targetParams.set('d', encodedFallback);
  const targetUrl = `${origin}/${targetParams.toString() ? `?${targetParams.toString()}` : ''}`;

  // If a human visitor hits /api/share directly, send them straight to the SPA place view
  if (!isSocialCrawler(userAgent)) {
    res.statusCode = 302;
    res.setHeader('Location', targetUrl);
    res.end();
    return;
  }

  let title = 'LOEI JOURNEY | เลย เจอร์นีย์ - นิตยสารท่องเที่ยวจังหวัดเลย';
  let description =
    'แนะนำที่พัก ร้านอาหาร คาเฟ่ สถานที่ท่องเที่ยว และธุรกิจบริการในจังหวัดเลย โดยสำนักงานพาณิชย์จังหวัดเลย';
  let category = 'attraction';
  let fallbackImg = '';

  const snapshot = decodeFallbackSnapshot(encodedFallback);
  if (snapshot?.n) {
    title = `${snapshot.n}${snapshot.d ? ` (${snapshot.d})` : ''} | LOEI JOURNEY`;
    description = snapshot.sd || snapshot.ds || description;
    category = snapshot.c || category;
    fallbackImg = snapshot.im || '';
  }

  // Try fetching canonical details from Firestore (only 1 document read)
  if (placeId) {
    try {
      const apiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/places/${encodeURIComponent(placeId)}?key=${firebaseConfig.apiKey}`;
      const resp = await fetch(apiUrl);
      if (resp.ok) {
        const docData = await resp.json() as {
          fields?: {
            name?: { stringValue?: string };
            district?: { stringValue?: string };
            category?: { stringValue?: string };
            shortDescription?: { stringValue?: string };
            description?: { stringValue?: string };
          };
        };
        const name = docData.fields?.name?.stringValue;
        const district = docData.fields?.district?.stringValue;
        const docCat = docData.fields?.category?.stringValue;
        const shortDesc = docData.fields?.shortDescription?.stringValue;
        const fullDesc = docData.fields?.description?.stringValue;

        if (name) {
          title = `${name}${district ? ` (${district})` : ''} | LOEI JOURNEY`;
        }
        if (shortDesc || fullDesc) {
          description = (shortDesc || fullDesc || '').slice(0, 160);
        }
        if (docCat) {
          category = docCat;
        }
      }
    } catch {
      // Fallback snapshot already loaded above if available
    }
  }

  const imgParams = new URLSearchParams();
  if (placeId) imgParams.set('id', placeId);
  if (category) imgParams.set('cat', category);
  if (fallbackImg && !fallbackImg.startsWith('data:')) {
    imgParams.set('img', fallbackImg);
  }
  const ogImageUrl = `${origin}/api/place-image?${imgParams.toString()}`;

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
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
    <meta property="og:image:width" content="800" />
    <meta property="og:image:height" content="600" />
    <meta property="og:url" content="${safeTargetUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
  </head>
  <body>
    <h1>${safeTitle}</h1>
    <p>${safeDescription}</p>
    <img src="${safeImageUrl}" alt="${safeTitle}" />
  </body>
</html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.end(html);
}
