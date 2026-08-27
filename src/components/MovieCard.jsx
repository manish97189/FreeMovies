import { imgW500 } from "../services/api";

export default function MovieCard({ item, mediaType = "movie", onDetails }) {
  const title  = item.title || item.name || "";
  const year   = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <div className="card fade-in" onClick={() => onDetails(item, mediaType)} title={title}>
      <div className="card-poster">
        {item.poster_path
          ? <img src={imgW500(item.poster_path)} alt={title} loading="lazy"/>
          : <div className="card-no-poster">{mediaType === "tv" ? "📺" : "🎬"}</div>
        }
        {rating && <div className="card-badge-top">★ {rating}</div>}
        <div className="card-type-pill">{mediaType === "tv" ? "Series" : "Movie"}</div>
        <div className="card-hover-overlay">
          <div className="card-play-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div className="card-hover-btns">
            <button className="card-hover-btn watch" onClick={e => { e.stopPropagation(); onDetails(item, mediaType); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch
            </button>
            <button className="card-hover-btn info" onClick={e => { e.stopPropagation(); onDetails(item, mediaType); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              Info
            </button>
          </div>
        </div>
      </div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        {year && <div className="card-year">{year}</div>}
      </div>
    </div>
  );
}
