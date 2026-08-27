import { tmdb, cors } from "../_lib.js";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id, page = 1 } = req.query;
  try { res.json(await tmdb(`/discover/movie?with_genres=${id}&sort_by=popularity.desc&language=en-US&page=${page}`)); }
  catch (e) { res.status(e.status||500).json({ error: e.message }); }
}
