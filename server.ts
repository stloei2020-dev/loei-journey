import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import shareCacheHandler from './api/share-cache';
import placeImageHandler from './api/place-image';
import shareHandler, { isSocialCrawler } from './api/share';

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  app.use('/api/share-cache', express.json({ limit: '2mb' }));

  app.post('/api/share-cache', async (req, res) => {
    await shareCacheHandler(req, res);
  });

  app.get('/api/place-image', async (req, res) => {
    await placeImageHandler(
      {
        query: req.query as Record<string, string | string[] | undefined>,
        headers: req.headers
      },
      res
    );
  });

  app.get('/api/share', async (req, res) => {
    await shareHandler(
      {
        query: req.query as Record<string, string | string[] | undefined>,
        headers: req.headers
      },
      res
    );
  });

  // Intercept social crawler requests on root URL (?place=...) to return shop-specific OpenGraph tags
  app.get('/', async (req, res, next) => {
    const placeParam = req.query.place;
    const ua = req.headers['user-agent'] || '';
    if (placeParam && isSocialCrawler(Array.isArray(ua) ? ua[0] : ua)) {
      await shareHandler(
        {
          query: req.query as Record<string, string | string[] | undefined>,
          headers: req.headers
        },
        res
      );
      return;
    }
    next();
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
