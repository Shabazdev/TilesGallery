import { Tile } from '../types';

// Fallback dataset embedded directly to guarantee zero crashes if network or json-server is offline
import fallbackTilesData from '../../data/tiles.json';

// Base API URL configured via VITE_API_URL (legacy: NEXT_PUBLIC_API_URL).
// Empty by default => same-origin relative requests. This is the recommended
// setup on Vercel where the backend runs as a serverless function of the same
// deployment. Never falls back to localhost in production builds.
export function getApiBase(): string {
  let url = (process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (url.startsWith('VITE_API_URL=') || url.startsWith('NEXT_PUBLIC_API_URL=')) {
    url = url.replace(/^(VITE_API_URL|NEXT_PUBLIC_API_URL)=/, '').trim();
  }
  // Guard against localhost leaking into deployed bundles
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return '';
  }
  return url.replace(/\/+$/, '');
}

const API_BASE = getApiBase();

export async function fetchTiles(params?: {
  search?: string;
  category?: string;
  inStock?: boolean;
  limit?: number;
}): Promise<Tile[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('q', params.search);
  if (params?.category && params.category.toLowerCase() !== 'all') {
    query.set('category', params.category);
  }
  if (params?.inStock) query.set('inStock', 'true');
  if (params?.limit) query.set('_limit', String(params.limit));

  const queryString = query.toString() ? `?${query.toString()}` : '';

  // 1. Primary candidate URLs: configured API base, followed by relative fallbacks
  const candidateUrls: string[] = [];
  if (API_BASE) {
    candidateUrls.push(`${API_BASE}/tiles${queryString}`);
  }
  candidateUrls.push(`/tiles${queryString}`);
  candidateUrls.push(`/api/tiles${queryString}`);

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch {
      // Endpoint unreachable or timed out; try next candidate
    }
  }

  // Graceful Fallback using embedded data/tiles.json if network is unavailable
  let tiles: Tile[] = [...(fallbackTilesData.tiles as Tile[])];

  if (params?.category && params.category.toLowerCase() !== 'all') {
    tiles = tiles.filter(
      (t) => t.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  if (params?.inStock) {
    tiles = tiles.filter((t) => t.inStock);
  }

  if (params?.search) {
    const q = params.search.toLowerCase().trim();
    tiles = tiles.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.material.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  if (params?.limit && params.limit > 0) {
    tiles = tiles.slice(0, params.limit);
  }

  return tiles;
}

export async function fetchTileById(id: string): Promise<Tile | null> {
  const candidateUrls: string[] = [];
  if (API_BASE) {
    candidateUrls.push(`${API_BASE}/tiles/${encodeURIComponent(id)}`);
  }
  candidateUrls.push(`/tiles/${encodeURIComponent(id)}`);
  candidateUrls.push(`/api/tiles/${encodeURIComponent(id)}`);

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.id) return data;
      }
    } catch {
      // Continue to next candidate URL
    }
  }

  // Local fallback
  const found = (fallbackTilesData.tiles as Tile[]).find((t) => t.id === id);
  return found || null;
}

export async function fetchFeaturedTiles(): Promise<Tile[]> {
  return fetchTiles({ limit: 4 });
}
