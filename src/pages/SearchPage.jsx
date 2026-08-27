import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import { searchMovies, searchTV } from "../services/api";

function useDebounce(val, delay) {
  const [deb, setDeb] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setDeb(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return deb;
}

export default function SearchPage({ onDetails }) {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const debQuery = useDebounce(query, 350);

  const [movs, setMovs]     = useState([]);
  const [tvs, setTvs]       = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debQuery.trim()) { setMovs([]); setTvs([]); return; }
    setLoading(true);
    Promise.all([searchMovies(debQuery), searchTV(debQuery)])
      .then(([m, t]) => { setMovs(m.results || []); setTvs(t.results || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debQuery]);

  const total = movs.length + tvs.length;

  return (
    <div className="app-main" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <div className="page-header-eyebrow">
          <div className="page-header-line" />
          <span className="page-header-label">Search Results</span>
        </div>
        <h1>"{query}"</h1>
        {!loading && query && (
          <p>{total > 0 ? `${total} results found` : "No results"}</p>
        )}
      </div>

      {!query.trim() && (
        <div className="empty" style={{ paddingTop: 40 }}>
          <div className="empty-icon">🔍</div>
          <h3>SEARCH ANYTHING</h3>
          <p>Use the search bar to find movies and TV shows</p>
        </div>
      )}

      {loading && <div className="spinner" />}

      {!loading && query && total === 0 && (
        <div className="empty" style={{ paddingTop: 40 }}>
          <div className="empty-icon">🎬</div>
          <h3>NO RESULTS</h3>
          <p>Try a different title or keyword</p>
        </div>
      )}

      {!loading && movs.length > 0 && (
        <MovieRow
          title={`MOVIES (${movs.length})`}
          items={movs} mediaType="movie" loading={false} onDetails={onDetails}
        />
      )}
      {!loading && tvs.length > 0 && (
        <MovieRow
          title={`TV SERIES (${tvs.length})`}
          items={tvs} mediaType="tv" loading={false} onDetails={onDetails}
        />
      )}
    </div>
  );
}
