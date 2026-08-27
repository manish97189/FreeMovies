import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieRow from "../components/MovieRow";
import { getGenreMovies } from "../services/api";

const GENRE_NAMES = {
  28:"Action", 35:"Comedy", 27:"Horror", 878:"Sci-Fi", 53:"Thriller",
  10749:"Romance", 16:"Animation", 18:"Drama", 80:"Crime", 12:"Adventure",
};

export default function GenrePage({ onDetails }) {
  const { id } = useParams();
  const genreId = parseInt(id, 10);
  const name = GENRE_NAMES[genreId] || "Genre";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true); setErr(null);
    getGenreMovies(genreId)
      .then(d => setMovies(d.results || []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [genreId]);

  return (
    <div className="app-main" style={{ paddingBottom: 60 }}>
      <div className="page-header">
        <div className="page-header-eyebrow">
          <div className="page-header-line" />
          <span className="page-header-label">Genre</span>
        </div>
        <h1><span>{name}</span></h1>
        <p>Handpicked {name.toLowerCase()} movies for you</p>
      </div>

      {err ? (
        <div className="empty">
          <div className="empty-icon">⚠️</div>
          <h3>FAILED TO LOAD</h3>
          <p>{err}</p>
        </div>
      ) : (
        <MovieRow
          title={`${name.toUpperCase()} MOVIES`}
          items={movies} mediaType="movie" loading={loading} onDetails={onDetails}
        />
      )}
    </div>
  );
}
