import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import { getTrending } from "../services/api";

export default function MoviesPage({ onDetails }) {
  const [movies, setMovies]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then(d => setMovies(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...movies].sort((a,b) => b.vote_average - a.vote_average);
  const newest = [...movies].sort((a,b) => new Date(b.release_date) - new Date(a.release_date));

  return (
    <div className="app-main" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <div className="page-header-eyebrow">
          <div className="page-header-line" />
          <span className="page-header-label">Browse</span>
        </div>
        <h1>MOVIES</h1>
        <p>Stream the latest and greatest films</p>
      </div>

      <MovieRow title="TRENDING NOW"     items={movies}  mediaType="movie" loading={loading} onDetails={onDetails} />
      <MovieRow title="HIGHEST RATED"    items={sorted}  mediaType="movie" loading={loading} onDetails={onDetails} />
      <MovieRow title="RECENTLY RELEASED" items={newest} mediaType="movie" loading={loading} onDetails={onDetails} />
    </div>
  );
}
