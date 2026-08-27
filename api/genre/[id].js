import { tmdb, setCors } from "../_tmdb.js";

// Handles: GET /api/genre/[id]?page=1
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id, page = 1 } = req.query;
  try {
    const data = await tmdb(
      `/discover/movie?with_genres=${id}&sort_by=popularity.desc&language=en-US&page=${page}`
    );
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}
