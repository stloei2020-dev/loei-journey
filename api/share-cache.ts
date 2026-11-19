import { CachedSharePlace, setCachedSharePlace } from './_cache';

interface ApiRequest {
  method?: string;
  body?: unknown;
  on?(event: string, cb: (chunk: Uint8Array) => void): void;
}

interface ApiResponse {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(data?: unknown): void;
}

async function readJsonBody(req: ApiRequest): Promise<Record<string, unknown> | null> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  if (!req.on) return null;

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let total = 0;
    req.on?.('data', (chunk) => {
      total += chunk.length;
      if (total <= 1500000) {
        chunks.push(Buffer.from(chunk));
      }
    });
    req.on?.('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : null);
      } catch {
        resolve(null);
      }
    });
    req.on?.('error', () => resolve(null));
  });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false }));
    return;
  }

  const body = await readJsonBody(req);
  if (!body || typeof body.id !== 'string' || typeof body.name !== 'string') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: false }));
    return;
  }

  const payload: CachedSharePlace = {
    id: body.id,
    name: body.name,
    district: typeof body.district === 'string' ? body.district : '',
    category: typeof body.category === 'string' ? body.category : 'attraction',
    shortDescription: typeof body.shortDescription === 'string' ? body.shortDescription : '',
    imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : '',
    updatedAt: typeof body.updatedAt === 'string' ? body.updatedAt : new Date().toISOString()
  };

  setCachedSharePlace(payload);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
}
