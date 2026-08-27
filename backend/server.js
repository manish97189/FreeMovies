import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const TOKEN = process.env.TMDB_TOKEN;
const BASE = "https://api.themoviedb.org/3";
// Allow any origin — covers localhost, Vercel preview URLs, and production
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, server-to-server) or any listed origin
    // Also allow all *.vercel.app domains automatically
    if (!origin) return cb(null, true);
    if (CLIENT_ORIGINS.includes(origin)) return cb(null, true);
    if (origin.endsWith(".vercel.app")) return cb(null, true);
    if (origin === "http://localhost:5173" || origin === "http://127.0.0.1:5173") return cb(null, true);
    cb(null, true); // open CORS for now — restrict after confirming prod URL
  },
  credentials: true,
}));
app.use(express.json());

// ─── TMDB Helper ──────────────────────────────────────────────────────────────
async function tmdb(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) {
    const err = new Error(`TMDB ${res.status}: ${path}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// ─── Error Middleware ─────────────────────────────────────────────────────────
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// ═══════════════════════════════════════════════════════════════════════════════
// MOVIE ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/trending — trending movies this week
app.get("/api/trending", asyncHandler(async (_req, res) => {
  const data = await tmdb("/trending/movie/week?language=en-US");
  res.json(data);
}));

// GET /api/movie/:id — movie details + credits + videos
app.get("/api/movie/:id", asyncHandler(async (req, res) => {
  const data = await tmdb(
    `/movie/${req.params.id}?language=en-US&append_to_response=credits,videos,similar`
  );
  res.json(data);
}));

// GET /api/genre/:id — movies by genre
app.get("/api/genre/:id", asyncHandler(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdb(
    `/discover/movie?with_genres=${req.params.id}&sort_by=popularity.desc&language=en-US&page=${page}`
  );
  res.json(data);
}));

// ═══════════════════════════════════════════════════════════════════════════════
// TV ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/trending/tv — trending TV shows this week
app.get("/api/trending/tv", asyncHandler(async (_req, res) => {
  const data = await tmdb("/trending/tv/week?language=en-US");
  res.json(data);
}));

// GET /api/tv/:id — full TV show details + credits + seasons
app.get("/api/tv/:id", asyncHandler(async (req, res) => {
  const data = await tmdb(
    `/tv/${req.params.id}?language=en-US&append_to_response=credits,videos,similar`
  );
  res.json(data);
}));

// GET /api/tv/:id/season/:seasonNumber — season + episodes
app.get("/api/tv/:id/season/:seasonNumber", asyncHandler(async (req, res) => {
  const { id, seasonNumber } = req.params;
  const data = await tmdb(`/tv/${id}/season/${seasonNumber}?language=en-US`);
  res.json(data);
}));

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/search?query= — search movies
app.get("/api/search", asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query?.trim()) return res.status(400).json({ error: "query is required" });
  const data = await tmdb(
    `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`
  );
  res.json(data);
}));

// GET /api/search/tv?query= — search TV shows
app.get("/api/search/tv", asyncHandler(async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query?.trim()) return res.status(400).json({ error: "query is required" });
  const data = await tmdb(
    `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`
  );
  res.json(data);
}));

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/iframe-url — return video embed base URLs
app.get("/api/iframe-url", (_req, res) => {
  res.json({
    movie: "https://www.vidking.net/embed/movie/",
    tv: "https://www.vidking.net/embed/tv/",
  });
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎬  CineStream API → http://localhost:${PORT}`);
});
