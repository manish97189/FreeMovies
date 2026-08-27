import { tmdb, cors } from "./_lib.js";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { query, page = 1 } = req.query;
  if (!query?.trim()) return res.status(400).json({ error: "query required" });
  try { res.json(await tmdb(`/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`)); }
  catch (e) { res.status(e.status||500).json({ error: e.message }); }
}
