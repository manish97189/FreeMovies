import { tmdb, setCors } from "../../_tmdb.js";

// Handles: GET /api/tv/[id]/season/[seasonNumber]
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id, seasonNumber } = req.query;
  try {
    const data = await tmdb(`/tv/${id}/season/${seasonNumber}?language=en-US`);
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}
