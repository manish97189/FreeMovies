import { tmdb, cors } from "../../_lib.js";
// Vercel route: /api/tv/[id]/season/[seasonNumber]
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id, seasonNumber } = req.query;
  try { res.json(await tmdb(`/tv/${id}/season/${seasonNumber}?language=en-US`)); }
  catch (e) { res.status(e.status||500).json({ error: e.message }); }
}
