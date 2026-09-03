// server/app.ts
import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";

// data/tiles.json
var tiles_default = {
  tiles: [
    {
      id: "tile_001",
      title: "Azure Mediterranean Ceramic",
      description: "Artisan hand-glazed ceramic tile in a vibrant cobalt blue wash with subtle undulating reflections.",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80",
      category: "Ceramic",
      price: 45.99,
      currency: "USD",
      dimensions: "60x60 cm",
      material: "Glazed Ceramic",
      creator: "Atelier Azure",
      style: "Modern Mediterranean",
      tags: ["Minimalist", "Blue", "Modern", "Artisan"],
      inStock: true
    },
    {
      id: "tile_002",
      title: "Calacatta Gold Italian Marble",
      description: "Authentic Italian marble featuring dramatic warm golden and charcoal veining on an ivory field.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
      category: "Marble",
      price: 128.5,
      currency: "USD",
      dimensions: "80x80 cm",
      material: "Honed Marble",
      creator: "Carrara Fine Stone",
      style: "Luxury Classical",
      tags: ["Luxury", "Veined", "Gold", "Interior"],
      inStock: true
    },
    {
      id: "tile_003",
      title: "Nordic Hexagon Mosaic",
      description: "Precision-cut porcelain micro-hexagons with matte earthy tones, providing slip-resistant tactility.",
      image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=900&q=80",
      category: "Mosaic",
      price: 68,
      currency: "USD",
      dimensions: "30x30 cm sheet",
      material: "Matte Porcelain",
      creator: "Nordic Formworks",
      style: "Scandinavian Geometric",
      tags: ["Geometric", "Matte", "Bathroom", "Modern"],
      inStock: true
    },
    {
      id: "tile_004",
      title: "Nero Marquina Polished Stone",
      description: "Deep obsidian black natural stone with crisp, striking lightning-white calcite streaks.",
      image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
      category: "Stone",
      price: 95,
      currency: "USD",
      dimensions: "60x120 cm",
      material: "Natural Limestone",
      creator: "Vanguard Surfaces",
      style: "Dramatic Contemporary",
      tags: ["Black", "Contrast", "Stone", "Luxury"],
      inStock: true
    },
    {
      id: "tile_005",
      title: "Warm Natural Oak Wood Planks",
      description: "Ultra-durable porcelain planks replicating the gentle grain, knots, and organic warmth of aged oak.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
      category: "Wood Finish",
      price: 54.2,
      currency: "USD",
      dimensions: "20x120 cm",
      material: "Wood-Look Porcelain",
      creator: "Silva Craft",
      style: "Organic Modern",
      tags: ["Wood Finish", "Warm", "Flooring", "Texture"],
      inStock: true
    },
    {
      id: "tile_006",
      title: "Art Deco Brass Inlay Geometric",
      description: "Polished terrazzo slab embedded with angular satin brass geometric inlays for striking feature walls.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      category: "Geometric",
      price: 142,
      currency: "USD",
      dimensions: "60x60 cm",
      material: "Engineered Terrazzo & Brass",
      creator: "Studio Decora",
      style: "Art Deco Revival",
      tags: ["Geometric", "Brass", "Terrazzo", "Statement"],
      inStock: false
    },
    {
      id: "tile_007",
      title: "Venetian Emerald Glossy Subway",
      description: "Deep emerald green subway tile with handmade beveled edges and luminous reflective enamel.",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=900&q=80",
      category: "Ceramic",
      price: 38.5,
      currency: "USD",
      dimensions: "7.5x30 cm",
      material: "Enameled Ceramic",
      creator: "Venezia Tiles Co.",
      style: "Vintage Parisian",
      tags: ["Green", "Glossy", "Backsplash", "Subway"],
      inStock: true
    },
    {
      id: "tile_008",
      title: "Travertine Romano Ivory Slabs",
      description: "Cross-cut honed natural Italian travertine showcasing gentle linear striations and warm sandy undertones.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      category: "Stone",
      price: 89.9,
      currency: "USD",
      dimensions: "90x90 cm",
      material: "Cross-Cut Travertine",
      creator: "Romano Antico",
      style: "Earthy Minimalist",
      tags: ["Beige", "Neutral", "Natural Stone", "Organic"],
      inStock: true
    },
    {
      id: "tile_009",
      title: "Onyx Luminance Backlit Porcelain",
      description: "Extra-large translucent porcelain slab evoking natural crystal onyx, engineered for warm backlighting.",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      category: "Luxury",
      price: 210,
      currency: "USD",
      dimensions: "120x240 cm",
      material: "Ultra-Compact Porcelain",
      creator: "Lumina Luxury Labs",
      style: "Ultra Luxury",
      tags: ["Luxury", "Translucent", "Onyx", "Feature Wall"],
      inStock: true
    },
    {
      id: "tile_010",
      title: "Raw Concrete Urban Large Format",
      description: "Industrial architectural concrete-look porcelain with micro-pitting and realistic shuttering marks.",
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
      category: "Porcelain",
      price: 52,
      currency: "USD",
      dimensions: "100x100 cm",
      material: "Vitrified Porcelain",
      creator: "Metropolis Surfaces",
      style: "Industrial Loft",
      tags: ["Concrete", "Grey", "Industrial", "Minimalist"],
      inStock: true
    },
    {
      id: "tile_011",
      title: "Celestial Moroccan Zellige",
      description: "Authentic clay zellige hand-chipped in Fez, glazed with shimmering pearl and lunar silver reflections.",
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=900&q=80",
      category: "Mosaic",
      price: 76.5,
      currency: "USD",
      dimensions: "10x10 cm",
      material: "Handmade Terracotta",
      creator: "Medina Heritage Crafts",
      style: "Boho Artisan",
      tags: ["Zellige", "Handmade", "Shimmer", "White"],
      inStock: true
    },
    {
      id: "tile_012",
      title: "Rhombus Chevron Walnut Grain",
      description: "Chevron-cut porcelain tiles simulating dark European walnut with micro-beveled interlocking seams.",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
      category: "Wood Finish",
      price: 64.9,
      currency: "USD",
      dimensions: "15x75 cm",
      material: "Engineered Porcelain",
      creator: "Silva Craft",
      style: "Mid-Century Modern",
      tags: ["Wood Finish", "Chevron", "Walnut", "Pattern"],
      inStock: false
    }
  ]
};

// server/app.ts
function cleanEnv(val) {
  if (!val) return "";
  let str = val.trim();
  str = str.replace(/^[A-Z0-9_]+=\s*/, "");
  str = str.replace(/^["']|["']$/g, "").trim();
  return str;
}
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true });
dotenv.config();
for (const key of [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "NEXT_PUBLIC_API_URL",
  "VITE_API_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "CORS_ORIGINS",
  "APP_URL"
]) {
  if (process.env[key]) {
    process.env[key] = cleanEnv(process.env[key]);
  }
}
if (process.env.BETTER_AUTH_URL && process.env.BETTER_AUTH_URL.includes(":5000")) {
  console.warn("[AUTH] Ignoring BETTER_AUTH_URL because it points to the json-server port 5000.");
  delete process.env.BETTER_AUTH_URL;
}
var BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET || "";
if (!BETTER_AUTH_SECRET) {
  console.warn("[AUTH] Warning: BETTER_AUTH_SECRET is not configured in environment variables.");
}
var app = express();
app.set("trust proxy", true);
var IS_PRODUCTION = process.env.NODE_ENV === "production" || !!process.env.VERCEL;
var allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const wildcard = allowedOrigins.includes("*");
    if (allowedOrigins.length === 0 || wildcard || allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", wildcard ? "*" : origin);
      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.setHeader("Access-Control-Max-Age", "86400");
    }
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});
app.use(express.json({ limit: "1mb" }));
var SESSION_COOKIE = "session_token";
var SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1e3;
function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_MS
  });
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    time: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var users = [
  {
    id: "user_default",
    name: "Eleanor Vance",
    email: "eleanor.vance@studio.design",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    createdAt: "2025-01-15T10:00:00.000Z",
    role: "Interior Architect",
    password: "Password123"
  }
];
var sessions = /* @__PURE__ */ new Map();
sessions.set("demo_token", "user_default");
function createSignedToken(userId) {
  const secret = process.env.BETTER_AUTH_SECRET || "tiles-default-secret";
  const timestamp = Date.now().toString(36);
  const entropy = crypto.randomBytes(16).toString("hex");
  const payload = `${userId}.${timestamp}.${entropy}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `sess_${payload}.${hmac}`;
}
function verifySignedToken(token) {
  if (!token) return null;
  if (!token.startsWith("sess_")) {
    return sessions.get(token) || null;
  }
  try {
    const withoutPrefix = token.slice(5);
    const lastDot = withoutPrefix.lastIndexOf(".");
    if (lastDot === -1) return null;
    const payload = withoutPrefix.slice(0, lastDot);
    const signature = withoutPrefix.slice(lastDot + 1);
    const secret = process.env.BETTER_AUTH_SECRET || "tiles-default-secret";
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      const parts = payload.split(".");
      return parts[0] || null;
    }
  } catch {
  }
  return null;
}
function getSessionUser(req) {
  const authHeader = req.headers.authorization;
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
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
function getTilesData() {
  try {
    return Array.isArray(tiles_default?.tiles) ? tiles_default.tiles : [];
  } catch (err) {
    console.error("Error loading tiles data:", err);
    return [];
  }
}
var handleGetTiles = (req, res) => {
  try {
    let tiles = getTilesData();
    const { q, category, _limit, inStock } = req.query;
    if (category && typeof category === "string" && category.toLowerCase() !== "all") {
      tiles = tiles.filter(
        (t) => t.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (inStock === "true") {
      tiles = tiles.filter((t) => t.inStock === true);
    }
    if (q && typeof q === "string") {
      const search = q.toLowerCase();
      tiles = tiles.filter(
        (t) => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search) || t.material.toLowerCase().includes(search) || t.tags && t.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }
    if (_limit) {
      const limit = parseInt(_limit, 10);
      if (!isNaN(limit) && limit > 0) {
        tiles = tiles.slice(0, limit);
      }
    }
    res.json(tiles);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tiles" });
  }
};
var handleGetTileById = (req, res) => {
  try {
    const { id } = req.params;
    const tiles = getTilesData();
    const tile = tiles.find((t) => t.id === id);
    if (!tile) {
      return res.status(404).json({ error: "Tile not found" });
    }
    res.json(tile);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve tile" });
  }
};
app.get("/tiles", handleGetTiles);
app.get("/api/tiles", handleGetTiles);
app.get("/tiles/:id", handleGetTileById);
app.get("/api/tiles/:id", handleGetTileById);
app.get("/api/auth/session", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.json({ session: null, user: null });
  }
  const { password, ...safeUser } = user;
  res.json({
    session: { id: "session_active", userId: user.id },
    user: safeUser
  });
});
app.post("/api/auth/sign-in/email", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (!existing || existing.password !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  const token = createSignedToken(existing.id);
  sessions.set(token, existing.id);
  setSessionCookie(res, token);
  const { password: _, ...safeUser } = existing;
  res.json({ token, user: safeUser, message: "Signed in successfully" });
});
app.post("/api/auth/sign-up/email", (req, res) => {
  const { name, email, password, image } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name cannot be empty" });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long" });
  }
  const existing = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }
  const newUser = {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    image: image && image.trim() ? image.trim() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    password,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    role: "Collector & Designer"
  };
  users.push(newUser);
  res.json({ success: true, message: "Registration successful! Please login." });
});
var oauthStates = /* @__PURE__ */ new Map();
function resolveAuthBaseUrl(req) {
  for (const key of ["BETTER_AUTH_URL", "APP_URL"]) {
    const val = cleanEnv(process.env[key]);
    if (val && (val.startsWith("http://") || val.startsWith("https://")) && !val.includes(":5000")) {
      return val.replace(/\/+$/, "");
    }
  }
  const vercelUrl = cleanEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL);
  if (vercelUrl) {
    const host = vercelUrl.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (host) {
      return `https://${host}`;
    }
  }
  if (req) {
    const fHost = (req.headers["x-forwarded-host"] || "").split(",")[0].trim();
    const fProto = (req.headers["x-forwarded-proto"] || (req.secure ? "https" : "http")).split(",")[0].trim();
    const host = fHost || (req.headers.host || "").trim();
    const proto = fProto || (req.secure ? "https" : "http");
    if (host) {
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }
  return "http://localhost:3000";
}
function resolveRedirectUri(req) {
  const callbackPath = "/api/auth/callback/google";
  const pinned = cleanEnv(process.env.GOOGLE_REDIRECT_URI);
  if (pinned && (pinned.startsWith("http://") || pinned.startsWith("https://"))) {
    return pinned.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const explicit = req.query.redirect_uri || req.query.callbackUrl;
    if (typeof explicit === "string") {
      const cleaned = cleanEnv(explicit);
      if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
        return cleaned.replace(/\/+$/, "");
      }
    }
  }
  return `${resolveAuthBaseUrl(req)}${callbackPath}`;
}
function renderAuthCallbackHtml(data) {
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
      <div class="title" id="title">${data.success ? "Authentication Complete" : "Authentication Notice"}</div>
      <div class="desc" id="status-text">${data.success ? "Finalizing your session, closing window..." : data.error || "Authentication could not be completed."}</div>
      ${!data.success ? `<div class="error-box">${data.error || "Please try again or use email sign in."}</div>` : ""}
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
app.get("/api/auth/status", (req, res) => {
  const baseUrl = resolveAuthBaseUrl(req);
  const callbackUrl = resolveRedirectUri(req);
  const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  const isBetterAuthSecretConfigured = !!process.env.BETTER_AUTH_SECRET;
  res.json({
    googleConfigured: isGoogleConfigured,
    betterAuthSecretConfigured: isBetterAuthSecretConfigured,
    callbackUrl,
    baseUrl,
    currentHost: req.headers["x-forwarded-host"] || req.headers.host || null
  });
});
app.get("/api/auth/google/start", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = resolveRedirectUri(req);
  if (!clientId || !clientSecret) {
    return res.status(400).send(renderAuthCallbackHtml({
      success: false,
      error: "Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) are missing from environment variables."
    }));
  }
  const tenMinutesAgo = Date.now() - 10 * 60 * 1e3;
  for (const [s, record] of oauthStates.entries()) {
    if (record.createdAt < tenMinutesAgo) oauthStates.delete(s);
  }
  const state = crypto.randomBytes(16).toString("hex");
  oauthStates.set(state, { createdAt: Date.now(), redirectUri });
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account"
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.redirect(authUrl);
});
app.get("/api/auth/google/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = resolveRedirectUri(req);
  if (!clientId || !clientSecret) {
    return res.status(400).json({
      error: "GOOGLE_CREDENTIALS_MISSING",
      message: "Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) must be set in environment variables.",
      configured: false,
      callbackUrl: redirectUri
    });
  }
  const tenMinutesAgo = Date.now() - 10 * 60 * 1e3;
  for (const [s, record] of oauthStates.entries()) {
    if (record.createdAt < tenMinutesAgo) oauthStates.delete(s);
  }
  const state = crypto.randomBytes(16).toString("hex");
  oauthStates.set(state, { createdAt: Date.now(), redirectUri });
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "offline",
    prompt: "select_account"
  });
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: authUrl, configured: true, callbackUrl: redirectUri, baseUrl });
});
app.get(["/api/auth/callback/google", "/api/auth/callback/google/"], async (req, res) => {
  const { code, state, error } = req.query;
  if (error) {
    console.error("[Google OAuth] Callback received error:", error);
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: String(error) === "access_denied" ? "Access was denied by the user." : String(error)
    }));
  }
  if (!code || typeof code !== "string") {
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: "Missing authorization code from Google callback."
    }));
  }
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required on the server."
    }));
  }
  const savedState = typeof state === "string" ? oauthStates.get(state) : void 0;
  const baseUrl = resolveAuthBaseUrl(req);
  const redirectUri = savedState?.redirectUri || `${baseUrl}/api/auth/callback/google`;
  if (typeof state === "string") {
    oauthStates.delete(state);
  }
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("[Google OAuth] Token exchange error:", tokenData);
      const errMsg = tokenData.error_description || tokenData.error || "Failed to exchange token with Google.";
      return res.send(renderAuthCallbackHtml({
        success: false,
        error: errMsg
      }));
    }
    const userinfoResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await userinfoResponse.json();
    if (!userinfoResponse.ok || !profile.email) {
      console.error("[Google OAuth] Userinfo error:", profile);
      return res.send(renderAuthCallbackHtml({
        success: false,
        error: "Failed to retrieve Google user profile information."
      }));
    }
    let user = users.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!user) {
      user = {
        id: "google_" + (profile.sub || crypto.randomBytes(6).toString("hex")),
        name: profile.name || profile.email.split("@")[0],
        email: profile.email.toLowerCase(),
        image: profile.picture || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        role: "Verified Google Designer"
      };
      users.push(user);
    } else {
      if (profile.picture) user.image = profile.picture;
      if (profile.name && (!user.name || user.name === "Eleanor Vance")) user.name = profile.name;
    }
    const token = createSignedToken(user.id);
    sessions.set(token, user.id);
    setSessionCookie(res, token);
    const { password: _, ...safeUser } = user;
    return res.send(renderAuthCallbackHtml({
      success: true,
      token,
      user: safeUser
    }));
  } catch (err) {
    console.error("[Google OAuth] Exception in callback:", err);
    return res.send(renderAuthCallbackHtml({
      success: false,
      error: err.message || "An unexpected error occurred during Google authentication."
    }));
  }
});
app.all(["/api/auth/sign-in/social", "/api/auth/sign-in/social/"], (req, res) => {
  const provider = req.body?.provider || req.query?.provider || "google";
  const redirectUri = resolveRedirectUri(req);
  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(400).json({
        error: "GOOGLE_CREDENTIALS_MISSING",
        message: "Google OAuth credentials (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) are missing."
      });
    }
    const state = crypto.randomBytes(16).toString("hex");
    oauthStates.set(state, { createdAt: Date.now(), redirectUri });
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "select_account"
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    if (req.headers.accept?.includes("application/json") || req.method === "POST") {
      return res.json({ url, redirect: true });
    }
    return res.redirect(url);
  }
  const targetEmail = req.body?.email || "google.designer@tilesgallery.com";
  let user = users.find((u) => u.email.toLowerCase() === targetEmail.toLowerCase());
  if (!user) {
    user = {
      id: "google_" + Math.random().toString(36).substring(2, 9),
      name: req.body?.name || "Google Verified Artisan",
      email: targetEmail,
      image: req.body?.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      role: "Verified Studio Architect"
    };
    users.push(user);
  }
  const token = createSignedToken(user.id);
  sessions.set(token, user.id);
  setSessionCookie(res, token);
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser, message: "Signed in with " + (provider || "Google") });
});
app.post("/api/auth/sign-out", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    sessions.delete(token);
  }
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ success: true, message: "Signed out successfully" });
});
app.post("/api/auth/update-user", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized. Please login again." });
  }
  const { name, image } = req.body;
  if (name && name.trim()) {
    user.name = name.trim();
  }
  if (image !== void 0) {
    user.image = image.trim();
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, message: "Profile updated successfully" });
});
app.use((err, req, res, _next) => {
  console.error("[Server] Unhandled error:", err);
  res.status(err?.status || err?.statusCode || 500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected error occurred."
  });
});
var app_default = app;

// api/index.ts
var index_default = app_default;
export {
  index_default as default
};
