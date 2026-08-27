import { tmdb, cors } from "./_lib.js";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  try { res.json(await tmdb("/trending/movie/week?language=en-US")); }
  catch (e) { res.status(e.status||500).json({ error: e.message }); }
}
