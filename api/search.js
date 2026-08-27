import { tmdb, setCors } from "./_tmdb.js";

// Handles: GET /api/search?query=avengers
export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { query, page = 1 } = req.query;
  if (!query?.trim()) return res.status(400).json({ error: "query is required" });
  try {
    const data = await tmdb(
      `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`
    );
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
}
