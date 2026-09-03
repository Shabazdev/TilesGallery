# Tiles Gallery — Architectural Surface Exhibition & Catalog

A modern, production-ready web application designed for showcasing, searching, filtering, and exploring premium handcrafted ceramic tiles, Italian marbles, mosaics, and large-format architectural surfaces.

---

## 1. Project Overview

* **Project Name**: Tiles Gallery
* **Purpose**: Provide interior architects, specifiers, and design enthusiasts with an immersive digital showroom to inspect high-resolution tile specimens, filter by material and style, request physical material sample kits, and manage account credentials.
* **Live URLs**:
  * **Interactive App**: [https://ais-dev-6wplbzmfk7c4fxlmej7o6s-735676568012.asia-east1.run.app](https://ais-dev-6wplbzmfk7c4fxlmej7o6s-735676568012.asia-east1.run.app)
  * **Production Showcase**: [https://ais-pre-6wplbzmfk7c4fxlmej7o6s-735676568012.asia-east1.run.app](https://ais-pre-6wplbzmfk7c4fxlmej7o6s-735676568012.asia-east1.run.app)

---

## 2. Technologies & Tech Stack

* **Framework**: React 19 + TypeScript with full-stack Express API integration
* **Build System**: Vite 6 + ESBuild for sub-second builds
* **Styling**: Tailwind CSS v4 with custom luxury serif display typography (`Cinzel`) and sans body (`Plus Jakarta Sans`)
* **Carousel Engine**: SwiperJS React (with Autoplay, Navigation, and Pagination modules)
* **Authentication**: Better Auth architecture + MongoDB Adapter schema with JWT sessions & Google OAuth
* **Data Layer**: JSON Server compatible repository (`data/tiles.json`) with multi-tier fallback resilience
* **Icons**: `lucide-react`
* **Notifications**: `sonner` rich toast system
* **Routing**: React Router with protected route gateways and redirection memory

---

## 3. Key Features

1. **Authentication & Session Handling**:
   * Email and password registration with client/server validation
   * Email/password sign-in with session token generation
   * One-click Google Social authentication
   * Persistent session storage in `localStorage`
   * Seamless logout

2. **Route Protection**:
   * **Public Routes**: `/`, `/all-tiles`, `/login`, `/register`
   * **Private Routes**: `/tile/:id`, `/my-profile`, `/my-profile/update`
   * Automatic redirection to `/login` with stored return path when accessing protected routes while unauthenticated.

3. **Tile Gallery & Instant Dynamic Search**:
   * Instant case-insensitive filtering by title, material, and tags without page reload
   * Category filtering chips: *All, Ceramic, Porcelain, Marble, Mosaic, Stone, Wood Finish, Geometric, Luxury*
   * In-Stock availability toggle
   * Responsive adaptive grid: 4 columns on desktop, 2–3 on tablet, 1 on mobile
   * Intuitive empty state with "Clear Search" trigger

4. **SwiperJS Featured Collection**:
   * Smooth, responsive touch-enabled carousel highlighting premier surfaces
   * Autoplay with hover pause, pagination pills, and navigation arrows

5. **Top 4 Featured Tiles**:
   * Dedicated top-tier showcase on the homepage
   * Skeleton loading cards during fetch
   * Error resilience with retry mechanism
   * Empty state handling

6. **High-Resolution Tile Details**:
   * Private specification page displaying dimensions, material, style, creator, and tags
   * High-resolution visual inspection view
   * One-click "Request Material Sample" trigger with toast feedback
   * Shareable link copying

7. **User Profile & Profile Update**:
   * Visual designer credentials card with membership duration and specifier tier
   * Dedicated `/my-profile/update` route to update name and portrait URL
   * Real-time avatar image preview

8. **Error & 404 Handling**:
   * Custom 404 page for missing tiles or invalid URLs with quick return to gallery
   * Zero "fetch failed" crash guarantee via automatic fallback dataset

---

## 4. npm Packages Used

```json
{
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-router-dom": "^7.18.3",
    "express": "^4.21.2",
    "swiper": "^14.2.0",
    "sonner": "^2.0.8",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "json-server": "^1.0.0-beta.15",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.3",
    "tailwindcss": "^4.1.14",
    "@tailwindcss/vite": "^4.1.14"
  }
}
```

---

## 5. Environment Variables

Create `.env.local` based on `.env.example`:

```env
# Better Auth & Database configuration
BETTER_AUTH_SECRET="your_strong_secret_key"
BETTER_AUTH_URL="http://localhost:3000"

# API base URL — leave EMPTY for same-origin (recommended).
# Only set this if the backend runs on a separate domain.
VITE_API_URL=""
NEXT_PUBLIC_API_URL=""
```

> **Security Note**: Never commit `.env.local` to public version control. It is protected in `.gitignore`.

---

## 6. Local Installation & Development

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/your-username/tiles-gallery.git
cd tiles-gallery
npm install
```

### 2. Run the Full-Stack Application

Start the Express API server and Vite frontend together:

```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### 3. Optional: Run Standalone JSON Server

To run the standalone JSON Server on port 5000:

```bash
npm run server
```

The tile endpoint will be accessible at `http://localhost:5000/tiles`.

---

## 7. Deployment Instructions

### Vercel Deployment (recommended)

The project deploys to Vercel as a **single project**: the Vite SPA is served
from the CDN and the Express backend (`server/app.ts`) runs as a serverless
function via `api/index.ts`. Routing is configured in `vercel.json`
(`/api/*` and `/tiles*` → function, everything else → SPA fallback).

1. Import the repository into Vercel (framework preset: **Vite**).
2. Set Environment Variables in **Settings → Environment Variables** (Production + Preview):
   * `BETTER_AUTH_SECRET`: Generate a secure random 32+ character string
     (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
   * `BETTER_AUTH_URL`: Your live Vercel URL, e.g. `https://tiles-gallery.vercel.app`.
   * `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: From Google Cloud Console.
   * `VITE_API_URL` / `NEXT_PUBLIC_API_URL`: **Leave unset** — same-origin by default.
   * `CORS_ORIGINS`: Optional; leave unset for same-origin operation.
3. Build Command (`vite build`, configured in `vercel.json`) — no extra settings needed.
4. Deploy. The API is live at `https://<your-domain>/api/health`.

### Google Cloud Console — OAuth redirect URI (required for "Continue with Google")

In **APIs & Services → Credentials → OAuth 2.0 Client ID**, add the **exact**
Authorized redirect URI:

```
https://<your-vercel-domain>/api/auth/callback/google
```

* The value must match character-for-character (scheme, host, path — no
  trailing slash), otherwise Google returns `redirect_uri_mismatch`.
* Add one entry per deployment domain you sign in from (production domain and
  any preview domains used for testing).
* Optionally pin the URI server-side with the `GOOGLE_REDIRECT_URI` env var.

### Other platforms (Render / Railway / Cloud Run)

1. Set the same environment variables as above.
2. Build Command:
   ```bash
   npm run build
   ```
3. Start Command:
   ```bash
   npm start
   ```

---

## 8. Verification & Quality Checklist

* [x] TypeScript build: 0 errors
* [x] Linting: 0 syntax or import errors
* [x] SwiperJS React carousel fully functional across mobile, tablet, and desktop
* [x] Public and private route access control verified
* [x] Protected route redirection to login and return to target route
* [x] Dynamic case-insensitive search by title and tags
* [x] Custom 404 not-found page
* [x] Network failure resilience and graceful loading skeletons
