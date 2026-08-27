import { setCors } from "./_tmdb.js";

// Handles: GET /api/iframe-url
export default function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  res.json({
    movie: "https://www.vidking.net/embed/movie/",
    tv:    "https://www.vidking.net/embed/tv/",
  });
}
