import { tmdb, setCors } from "./_tmdb.js";

// Handles: GET /api/trending/tv  (Vercel path: /api/trending/tv.js)
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const data = await tmdb("/trending/tv/week?language=en-US");
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}
