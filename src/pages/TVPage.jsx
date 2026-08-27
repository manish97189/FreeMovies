import { useState, useEffect } from "react";
import MovieRow from "../components/MovieRow";
import { getTrendingTV } from "../services/api";

export default function TVPage({ onDetails }) {
  const [shows, setShows]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrendingTV()
      .then(d => setShows(d.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...shows].sort((a,b) => b.vote_average - a.vote_average);
  const newest = [...shows].sort((a,b) => new Date(b.first_air_date) - new Date(a.first_air_date));

  return (
    <div className="app-main" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <div className="page-header-eyebrow">
          <div className="page-header-line" />
          <span className="page-header-label">Browse</span>
        </div>
        <h1>TV <span>SHOWS</span></h1>
        <p>Binge the best series across all genres</p>
      </div>

      <MovieRow title="TRENDING SERIES"  items={shows}  mediaType="tv" loading={loading} onDetails={onDetails} />
      <MovieRow title="HIGHEST RATED"    items={sorted} mediaType="tv" loading={loading} onDetails={onDetails} />
      <MovieRow title="RECENTLY AIRED"   items={newest} mediaType="tv" loading={loading} onDetails={onDetails} />
    </div>
  );
}
