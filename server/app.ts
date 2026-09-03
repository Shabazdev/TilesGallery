import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
// Tiles are imported statically so the dataset is bundled with the code.
// This is required for serverless deployment (Vercel) where runtime file
// access to the project directory is not guaranteed.
import tilesJson from '../data/tiles.json' with { type: 'json' };

// Helper to sanitize environment variable strings
function cleanEnv(val?: string): string {
  if (!val) return '';
  let str = val.trim();
  str = str.replace(/^[A-Z0-9_]+=\s*/, '');
  str = str.replace(/^["']|["']$/g, '').trim();
  return str;
}

// Load environment variables (.env.local with override, then .env)
dotenv.config({ path: path.join(process.cwd(), '.env.local'), override: true });
dotenv.config();

// Sanitize process.env variables that may have prefix artifacts
for (const key of [
  'BETTER_AUTH_SECRET', 'BETTER_AUTH_URL', 'NEXT_PUBLIC_API_URL', 'VITE_API_URL',
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI',
  'CORS_ORIGINS', 'APP_URL',
]) {
  if (process.env[key]) {
    process.env[key] = cleanEnv(process.env[key]);
  }
}

// Guard against a misconfigured BETTER_AUTH_URL pointing at the json-server port
if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL.includes(':5000')) {
  console.warn('[AUTH] Ignoring BETTER_AUTH_URL because it points to the json-server port 5000.');
  delete process.env.BETTER_AUTH_URL;
}

const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || '';
if (!BETTER_AUTH_SECRET) {
  console.warn('[AUTH] Warning: BETTER_AUTH_SECRET is not configured in environment variables.');
}

const app = express();

// Trust reverse-proxy headers (Vercel / Cloud Run) so req.secure and req.hostname
// reflect the original client request (https) instead of the internal http hop.
app.set('trust proxy', true);

const IS_PRODUCTION = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

// --- CORS ---
// Allowed origins can be locked down via CORS_ORIGINS (comma-separated).
// When unset, any origin is reflected; the API uses Bearer-token auth (no
// cross-site cookies), so this remains safe. Same-origin requests on Vercel
// never trigger CORS at all.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    const wildcard = allowedOrigins.includes('*');
    if (allowedOrigins.length === 0 || wildcard || allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', wildcard ? '*' : origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '86400');
    }
  }
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

// --- Session cookie helpers ---
// Sessions are primarily carried by the HMAC-signed token (Bearer header /
// localStorage), which is fully stateless and serverless-safe. The cookie is a
// redundant, HttpOnly transport so the session survives even if localStorage
// is unavailable.
const SESSION_COOKIE = 'session_token';
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_MS,
  });
}

// Health check for uptime monitoring / deployment verification
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    time: new Date().toISOString(),
  });
});

// In-memory mock user store for Better-Auth demo
interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  password?: string;
  createdAt: string;
  role: string;
}

const users: User[] = [
  {
    id: 'user_default',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@studio.design',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-01-15T10:00:00.000Z',
    role: 'Interior Architect',
    password: 'Password123'
  }
];

// Active sessions: token -> userId
const sessions = new Map<string, string>();
// Prepopulate default demo session
sessions.set('demo_token', 'user_default');

// Cryptographically sign token using process.env.BETTER_AUTH_SECRET
function createSignedToken(userId: string): string {
  const secret = process.env.BETTER_AUTH_SECRET || 'tiles-default-secret';
  const timestamp = Date.now().toString(36);
  const entropy = crypto.randomBytes(16).toString('hex');
  const payload = `${userId}.${timestamp}.${entropy}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `sess_${payload}.${hmac}`;
}

// Verify token signature against process.env.BETTER_AUTH_SECRET
function verifySignedToken(token: string): string | null {
  if (!token) return null;
  if (!token.startsWith('sess_')) {
    // Demo token or in-memory fallback
    return sessions.get(token) || null;
  }
  try {
    const withoutPrefix = token.slice(5);
    const lastDot = withoutPrefix.lastIndexOf('.');
    if (lastDot === -1) return null;

    const payload = withoutPrefix.slice(0, lastDot);
    const signature = withoutPrefix.slice(lastDot + 1);
    const secret = process.env.BETTER_AUTH_SECRET || 'tiles-default-secret';
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');

    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const parts = payload.split('.');
      return parts[0] || null;
    }
  } catch {
    // Signature verification failed
  }
  return null;
}

// Helper to get user from Bearer or Cookie header
function getSessionUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/session_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (token) {
    const userId = verifySignedToken(token);
    if (userId) {
      return users.find((u) => u.id === userId) || null;
    }
  }
  return null;
}

// --- JSON Server compatible Tile Endpoints ---
function getTilesData() {
  try {
    return Array.isArray(tilesJson?.tiles) ? tilesJson.tiles : [];
  } catch (err) {
    console.error('Error loading tiles data:', err);
    return [];
  }
}

const handleGetTiles = (req: Request, res: Response) => {
  try {
    let tiles = getTilesData();
    const { q, category, _limit, inStock } = req.query;

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      tiles = tiles.filter(
        (t: any) => t.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (inStock === 'true') {
      tiles = tiles.filter((t: any) => t.inStock === true);
    }

    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      tiles = tiles.filter(
        (t: any) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.material.toLowerCase().includes(search) ||
          (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(search)))
      );
    }

    if (_limit) {
      const limit = parseInt(_limit as string, 10);
      if (!isNaN(limit) && limit > 0) {
        tiles = tiles.slice(0, limit);
      }
    }

    res.json(tiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tiles' });
  }
};

const handleGetTileById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tiles = getTilesData();
    const tile = tiles.find((t: any) => t.id === id);

    if (!tile) {
      return res.status(404).json({ error: 'Tile not found' });
    }

    res.json(tile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tile' });
  }
};

// Route handlers for both /tiles and /api/tiles
app.get('/tiles', handleGetTiles);
app.get('/api/tiles', handleGetTiles);

app.get('/tiles/:id', handleGetTileById);
app.get('/api/tiles/:id', handleGetTileById);

// --- Better Auth API Endpoints ---
app.get('/api/auth/session', (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.json({ session: null, user: null });
  }
  const { password, ...safeUser } = user;
  res.json({
    session: { id: 'session_active', userId: user.id },
    user: safeUser,
  });
});

app.post('/api/auth/sign-in/email', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (!existing || existing.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createSignedToken(existing.id);
  sessions.set(token, existing.id);
  setSessionCookie(res, token);

  const { password: _, ...safeUser } = existing;
  res.json({ token, user: safeUser, message: 'Signed in successfully' });
});

app.post('/api/auth/sign-up/email', (req: Request, res: Response) => {
  const { name, email, password, image } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser: User = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    image:
      image && image.trim()
        ? image.trim()
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    password,
    createdAt: new Date().toISOString(),
    role: 'Collector & Designer',
  };

  users.push(newUser);
  res.json({ success: true, message: 'Registration successful! Please login.' });
});

// OAuth CSRF state tracking with redirectUri mapping (cleared after 10 minutes)
interface OAuthStateRecord {
  createdAt: number;
  redirectUri: string;
}
const oauthStates = new Map<string, OAuthStateRecord>();

// Resolves the public base URL of the application.
// Priority:
//   1. BETTER_AUTH_URL / APP_URL env vars (authoritative when set on Vercel)
//   2. Vercel-provided env (VERCEL_PROJECT_PRODUCTION_URL for production, VERCEL_URL for previews)
//   3. Reverse-proxy request headers (x-forwarded-host / x-forwarded-proto, set by Vercel)
//   4. Local development fallback
// localhost is ONLY ever used as the final local-development fallback.
function resolveAuthBaseUrl(req?: Request): string {
  for (const key of ['BETTER_AUTH_URL', 'APP_URL']) {
    const val = cleanEnv(process.env[key]);
    if (val && (val.startsWith('http://') || val.startsWith('https://')) && !val.includes(':5000')) {
      return val.replace(/\/+$/, '');
    }
  }

  const vercelUrl = cleanEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL);
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (host) {
      return `https://${host}`;
    }
  }

  if (req) {
    const fHost = ((req.headers['x-forwarded-host'] as string) || '').split(',')[0].trim();
    const fProto = ((req.headers['x-forwarded-proto'] as string) || (req.secure ? 'https' : 'http')).split(',')[0].trim();
    const host = fHost || ((req.headers.host as string) || '').trim();
    const proto = fProto || (req.secure ? 'https' : 'http');
    if (host) {
      return `${proto}://${host}`.replace(/\/+$/, '');
    }
  }

  return 'http://localhost:3000';
}

// Resolves the exact Google OAuth redirect URI.
// Priority:
//   1. GOOGLE_REDIRECT_URI env var (pin to the exact URI registered in Google Cloud Console)
//   2. Client-supplied override — honoured only outside production (prevents open-redirect abuse)
//   3. Derived from the resolved public base URL
// The resulting value must match an Authorized redirect URI in Google Cloud Console,
// e.g. https://<your-app>.vercel.app/api/auth/callback/google
function resolveRedirectUri(req: Request): string {
  const callbackPath = '/api/auth/callback/google';
  const pinned = cleanEnv(process.env.GOOGLE_REDIRECT_URI);
  if (pinned && (pinned.startsWith('http://') || pinned.startsWith('https://'))) {
    return pinned.replace(/\/+$/, '');
  }
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const explicit = req.query.redirect_uri || req.query.callbackUrl;
    if (typeof explicit === 'string') {
      const cleaned = cleanEnv(explicit);
      if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
        return cleaned.replace(/\/+$/, '');
      }
    }
  }
  return `${resolveAuthBaseUrl(req)}${callbackPath}`;
}

function renderAuthCallbackHtml(data: { success: boolean; token?: string; user?: any; error?: string }) {
  const jsonPayload = JSON.stringify(data);
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Authentication - Tiles Gallery</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; text-align: center; }
      .card { background: white; padding: 2.25rem 2rem; border-radius: 1rem; border: 1px solid #e7e5e4; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05); max-width: 440px; width: 90%; }
      .spinner { border: 3px solid #e7e5e4; border-top-color: #d97706; border-radius: 50%; width: 32px; height: 32px; animation: spin 1s linear infinite; margin: 0 auto 1.25rem; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: #1c1917; }
      .desc { font-size: 0.875rem; color: #78716c; line-height: 1.5; margin-bottom: 1rem; }
      .error-box { color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.8125rem; margin-top: 1rem; text-align: left; word-break: break-word; }
      .btn { display: inline-block; margin-top: 1.25rem; padding: 0.625rem 1.25rem; background: #1c1917; color: white; border-radius: 0.5rem; text-decoration: none; font-size: 0.875rem; font-weight: 500; cursor: pointer; border: none; }
      .btn:hover { background: #292524; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="spinner" id="spinner"></div>
      <div class="title" id="title">${data.success ? 'Authentication Complete' : 'Authentication Notice'}</div>
      <div class="desc" id="status-text">${data.success ? 'Finalizing your session, closing window...' : (data.error || 'Authentication could not be completed.')}</div>
      ${!data.success ? `<div class="error-box">${data.error || 'Please try again or use email sign in.'}</div>` : ''}
      <button class="btn" id="action-btn" style="display:none;" onclick="handleAction()">Return to Application</button>
    </div>
    <script>
      const authData = ${jsonPayload};

      function handleAction() {
        if (window.opener && !window.opener.closed) {
          window.close();
        } else {
          window.location.href = '/';
        }
      }

      try {
        // 1. Immediately persist credentials to localStorage on the current domain
        if (authData.success && authData.token) {
          localStorage.setItem('tiles_gallery_token', authData.token);
          localStorage.setItem('tiles_gallery_user', JSON.stringify(authData.user));
          try {
            window.dispatchEvent(new Event('storage'));
          } catch (e) {}
        }

        // 2. Broadcast via BroadcastChannel (reliable cross-window communication on same origin)
        try {
          const channel = new BroadcastChannel('google_oauth_channel');
          channel.postMessage({ type: 'GOOGLE_AUTH_RESULT', ...authData });
          channel.close();
        } catch (bcErr) {}

        // 3. Post message to window.opener if available
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_RESULT', ...authData }, '*');
          } catch (pmErr) {
            console.warn('Could not postMessage to opener:', pmErr);
          }
        }

        // 4. Close popup or display return button
        if (authData.success) {
          setTimeout(() => {
            try {
              window.close();
            } catch (e) {}
            const spinnerEl = document.getElementById('spinner');
            const actionBtn = document.getElementById('action-btn');
            if (spinnerEl) spinnerEl.style.display = 'none';
            if (actionBtn) {
              actionBtn.style.display = 'inline-block';
              actionBtn.innerText = 'Continue to Tiles Gallery';
            }
          }, 500);
        } else {
          const spinnerEl = document.getElementById('spinner');
          const actionBtn = document.getElementById('action-btn');
          if (spinnerEl) spinnerEl.style.display = 'none';
          if (actionBtn) {
            actionBtn.style.display = 'inline-block';
            actionBtn.innerText = 'Close Window';
          }
        }
      } catch (e) {
        console.error('Error in OAuth callback script:', e);
      }
    </script>
  </body>
</html>`;
}

// OAuth configuration & status check endpoint
app.get('/api/auth/status', (req: Request, res: Response) => {
  const baseUrl = resolveAuthBaseUrl(req);
  const callbackUrl = resolveRedirectUri(req);
  const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const isBetterAuthSecretConfigured = !!process.env.BETTER_AUTH_SECRET;

  res.json({
    googleConfigured: isGoogleConfigured,
    betterAuthSecretConfigured: isBetterAuthSecretConfigured,
    callbackUrl,
    baseUrl,
    currentHost: req.headers['x-forwarded-host'] || req.headers.host || null,
  });
});

// Endpoint to start Google OAuth directly via redirect (preserves user gesture for popups)
app.get('/api/auth/google/start', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = resolveRedirectUri(req);

  if (!clientId || !clientSecret) {
    return res.status(400).send(renderAuthCallbackHtml({
      success: false,
      error: 'Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) are missing from environment variables.',
    }));
  }

  // Cleanup old state tokens older than 10 minutes
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [s, record] of oauthStates.entries()) {
    if (record.createdAt < tenMinutesAgo) oauthStates.delete(s);
  }

  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), redirectUri });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
});

// Endpoint to obtain Google OAuth Authorization URL
app.get('/api/auth/google/url', (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = resolveRedirectUri(req);


  if (!clientId || !clientSecret) {
    return res.status(400).json({
      error: 'GOOGLE_CREDENTIALS_MISSING',
      message: 'Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) must be set in environment variables.',
      configured: false,
      callbackUrl: redirectUri,
    });
  }

  // Cleanup old state tokens older than 10 minutes
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [s, record] of oauthStates.entries()) {
    if (record.createdAt < tenMinutesAgo) oauthStates.delete(s);
  }

  const state = crypto.randomBytes(16).toString('hex');
  oauthStates.set(state, { createdAt: Date.now(), redirectUri });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl, configured: true, callbackUrl: redirectUri, baseUrl });
});

// Google OAuth callback endpoint (handles both with and without trailing slash)
app.get(['/api/auth/callback/google', '/api/auth/callback/google/'], async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    console.error('[Google OAuth] Callback received error:', error);
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: String(error) === 'access_denied' ? 'Access was denied by the user.' : String(error),
    }));
  }

  if (!code || typeof code !== 'string') {
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: 'Missing authorization code from Google callback.',
    }));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required on the server.',
    }));
  }

  const savedState = typeof state === 'string' ? oauthStates.get(state) : undefined;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = savedState?.redirectUri || `${baseUrl}/api/auth/callback/google`;
  if (typeof state === 'string') {
    oauthStates.delete(state);
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('[Google OAuth] Token exchange error:', tokenData);
      const errMsg = tokenData.error_description || tokenData.error || 'Failed to exchange token with Google.';
      return res.send(renderAuthCallbackHtml({
        success: false,
        error: errMsg,
      }));
    }

    // Fetch user profile from OpenID Connect endpoint
    const userinfoResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoResponse.json();

    if (!userinfoResponse.ok || !profile.email) {
      console.error('[Google OAuth] Userinfo error:', profile);
      return res.send(renderAuthCallbackHtml({
        success: false,
        error: 'Failed to retrieve Google user profile information.',
      }));
    }

    // Find or create user
    let user = users.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!user) {
      user = {
        id: 'google_' + (profile.sub || crypto.randomBytes(6).toString('hex')),
        name: profile.name || profile.email.split('@')[0],
        email: profile.email.toLowerCase(),
        image: profile.picture || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        createdAt: new Date().toISOString(),
        role: 'Verified Google Designer',
      };
      users.push(user);
    } else {
      if (profile.picture) user.image = profile.picture;
      if (profile.name && (!user.name || user.name === 'Eleanor Vance')) user.name = profile.name;
    }

    const token = createSignedToken(user.id);
    sessions.set(token, user.id);
    setSessionCookie(res, token);

    const { password: _, ...safeUser } = user;

    return res.send(renderAuthCallbackHtml({
      success: true,
      token,
      user: safeUser,
    }));
  } catch (err: any) {
    console.error('[Google OAuth] Exception in callback:', err);
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: err.message || 'An unexpected error occurred during Google authentication.',
    }));
  }
});

// Better-Auth compatible social sign-in endpoint (supports both GET redirect and POST JSON)
app.all(['/api/auth/sign-in/social', '/api/auth/sign-in/social/'], (req: Request, res: Response) => {
  const provider = (req.body?.provider || req.query?.provider || 'google') as string;
  const redirectUri = resolveRedirectUri(req);

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: 'GOOGLE_CREDENTIALS_MISSING',
        message: 'Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) are missing.',
      });
    }

    const state = crypto.randomBytes(16).toString('hex');
    oauthStates.set(state, { createdAt: Date.now(), redirectUri });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'select_account',
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    if (req.headers.accept?.includes('application/json') || req.method === 'POST') {
      return res.json({ url, redirect: true });
    }
    return res.redirect(url);
  }

  // Demo fallback for test users
  const targetEmail = req.body?.email || 'google.designer@tilesgallery.com';
  let user = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());

  if (!user) {
    user = {
      id: 'google_' + Math.random().toString(36).substring(2, 9),
      name: req.body?.name || 'Google Verified Artisan',
      email: targetEmail,
      image: req.body?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString(),
      role: 'Verified Studio Architect',
    };
    users.push(user);
  }

  const token = createSignedToken(user.id);
  sessions.set(token, user.id);
  setSessionCookie(res, token);

  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser, message: 'Signed in with ' + (provider || 'Google') });
});

app.post('/api/auth/sign-out', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    sessions.delete(token);
  }
  // Clear the session cookie on any sign-out attempt
  res.clearCookie(SESSION_COOKIE, { path: '/' });
  res.json({ success: true, message: 'Signed out successfully' });
});

app.post('/api/auth/update-user', (req: Request, res: Response) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please login again.' });
  }

  const { name, image } = req.body;
  if (name && name.trim()) {
    user.name = name.trim();
  }
  if (image !== undefined) {
    user.image = image.trim();
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, message: 'Profile updated successfully' });
});

// --- Error handler (registered last) ---
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err);
  res.status(err?.status || err?.statusCode || 500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: err?.message || 'An unexpected error occurred.',
  });
});

// Exported for the Vercel serverless entry point (api/index.ts).
// Do NOT call app.listen() here — this module is shared by:
//   - server.ts   (local dev / self-hosted production)
//   - api/index.ts (Vercel serverless function)
export default app;
