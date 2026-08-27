// ─── Centralized API service — all calls go through the backend ───────────────
const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Movies ───────────────────────────────────────────────────────────────────
export const getTrending        = ()      => get("/api/trending");
export const getMovie           = (id)    => get(`/api/movie/${id}`);
export const getGenreMovies     = (id, page = 1) => get(`/api/genre/${id}?page=${page}`);

// ─── TV Shows ─────────────────────────────────────────────────────────────────
export const getTrendingTV      = ()      => get("/api/trending/tv");
export const getTV              = (id)    => get(`/api/tv/${id}`);
export const getTVSeason        = (id, n) => get(`/api/tv/${id}/season/${n}`);

// ─── Search ───────────────────────────────────────────────────────────────────
export const searchMovies       = (q)     => get(`/api/search?query=${encodeURIComponent(q)}`);
export const searchTV           = (q)     => get(`/api/search/tv?query=${encodeURIComponent(q)}`);

// ─── Config ───────────────────────────────────────────────────────────────────
export const getIframeUrls      = ()      => get("/api/iframe-url");

// ─── Image helpers ────────────────────────────────────────────────────────────
export const imgW500  = (p) => p ? `https://image.tmdb.org/t/p/w500${p}`    : null;
export const imgOrig  = (p) => p ? `https://image.tmdb.org/t/p/original${p}` : null;
export const imgW185  = (p) => p ? `https://image.tmdb.org/t/p/w185${p}`    : null;
