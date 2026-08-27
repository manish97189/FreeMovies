import { tmdb, cors } from "../_lib.js";
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  const { id } = req.query;
  try { res.json(await tmdb(`/movie/${id}?language=en-US&append_to_response=credits,videos,similar`)); }
  catch (e) { res.status(e.status||500).json({ error: e.message }); }
}
