// Shared TMDB helper used by all Vercel serverless functions
const BASE = "https://api.themoviedb.org/3";

export async function tmdb(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_TOKEN}` },
  });
  if (!res.ok) {
    const err = new Error(`TMDB ${res.status}: ${path}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
