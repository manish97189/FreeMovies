import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { getTrending, getTrendingTV } from "../services/api";

export default function HomePage({ onDetails, heroItem, setHeroItem }) {
  const [trending,   setTrending]   = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [loadMov,    setLoadMov]    = useState(true);
  const [loadTv,     setLoadTv]     = useState(true);
  const [err,        setErr]        = useState(null);

  useEffect(() => {
    fetchMovies();
    fetchTV();
  }, []);

  async function fetchMovies() {
    setLoadMov(true); setErr(null);
    try {
      const d = await getTrending();
      const res = d.results || [];
      setTrending(res);
      if (!heroItem) {
        const withBg = res.filter(m => m.backdrop_path);
        if (withBg.length) setHeroItem(withBg[Math.floor(Math.random() * Math.min(6, withBg.length))]);
      }
    } catch (e) { setErr(e.message); }
    finally { setLoadMov(false); }
  }

  async function fetchTV() {
    setLoadTv(true);
    try {
      const d = await getTrendingTV();
      setTrendingTv(d.results || []);
    } catch {}
    finally { setLoadTv(false); }
  }

  return (
    <>
      {/* Hero */}
      {loadMov && <div className="skeleton-base skeleton-hero" />}
      {!loadMov && heroItem && (
        <Hero item={heroItem} mediaType="movie" onDetails={onDetails} />
      )}
      {!loadMov && err && (
        <div className="empty" style={{ paddingTop: "140px" }}>
          <div className="empty-icon">⚠️</div>
          <h3>COULDN'T LOAD</h3>
          <p>{err}</p>
          <button className="btn btn-red" style={{ marginTop: 18 }} onClick={fetchMovies}>Retry</button>
        </div>
      )}

      {/* Rows */}
      <MovieRow title="TRENDING MOVIES"     items={trending}   mediaType="movie" loading={loadMov} onDetails={onDetails} />
      <MovieRow title="TRENDING SERIES"     items={trendingTv} mediaType="tv"    loading={loadTv}  onDetails={onDetails} />
      <MovieRow title="TOP RATED MOVIES"
        items={[...trending].sort((a,b) => b.vote_average - a.vote_average)}
        mediaType="movie" loading={loadMov} onDetails={onDetails}
      />
      <MovieRow title="TOP RATED SERIES"
        items={[...trendingTv].sort((a,b) => b.vote_average - a.vote_average)}
        mediaType="tv" loading={loadTv} onDetails={onDetails}
      />
      <MovieRow title="RECENTLY RELEASED"
        items={[...trending].sort((a,b) => new Date(b.release_date) - new Date(a.release_date))}
        mediaType="movie" loading={loadMov} onDetails={onDetails}
      />
    </>
  );
}
