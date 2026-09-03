/**
 * Local development / self-hosted production entry point.
 *
 * - Dev (npm run dev): mounts the Vite dev server as middleware and serves the
 *   API from the same origin on port 3000.
 * - Production self-hosted (npm run build && npm start): serves the built SPA
 *   from dist/ plus the API on the same origin.
 *
 * On Vercel this file is NOT used — the API runs as a serverless function
 * (see api/index.ts) and static files are served by Vercel's CDN.
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './server/app';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tiles Gallery Server running on https://tiles-gallery-pearl.vercel.app/:${PORT}`);
  });
}

startServer();
