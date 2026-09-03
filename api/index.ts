/**
 * Vercel serverless entry point for the Express backend.
 *
 * Vercel's Node.js runtime imports this file and uses the default export as
 * the request handler (see: https://vercel.com/guides/using-express-with-vercel).
 * vercel.json rewrites all /api/* and /tiles* requests to this function while
 * preserving the original request URL, so the full Express route table in
 * server/app.ts works unchanged.
 *
 * The same Express app also powers local development (npm run dev) via server.ts.
 */
import app from '../server/app.js';

export default app;
