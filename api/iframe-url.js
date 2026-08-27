import { cors } from "./_lib.js";
export default function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  res.json({
    movie: "https://www.vidking.net/embed/movie/",
    tv:    "https://www.vidking.net/embed/tv/",
  });
}
