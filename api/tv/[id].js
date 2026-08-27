import { tmdb, setCors } from "../_tmdb.js";

// Handles: GET /api/tv/[id]
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id } = req.query;
  try {
    const data = await tmdb(
      `/tv/${id}?language=en-US&append_to_response=credits,videos,similar`
    );
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}
