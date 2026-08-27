import { imgOrig } from "../services/api";

const GENRE_MAP = { 28:"Action",35:"Comedy",27:"Horror",878:"Sci-Fi",53:"Thriller",10749:"Romance",16:"Animation",18:"Drama",80:"Crime",12:"Adventure",10765:"Sci-Fi & Fantasy",10759:"Action & Adventure",10751:"Family",14:"Fantasy",9648:"Mystery" };

export default function Hero({ item, mediaType = "movie", onDetails }) {
  if (!item) return null;
  const title  = item.title || item.name || "";
  const year   = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const genres = item.genre_ids?.slice(0, 3) || [];

  return (
    <div className="hero">
      {item.backdrop_path
        ? <img src={imgOrig(item.backdrop_path)} alt={title} className="hero-bg fade-in" />
        : <div className="hero-bg" style={{background:"linear-gradient(135deg,#1a0000,#060606)"}}/>
      }
      <div className="hero-noise" />
      <div className="hero-grad" />
      <div className="hero-vignette" />

      <div className="hero-content">
        <div className="hero-eyebrow">
          <div className="hero-eyebrow-line" />
          <span className="hero-eyebrow-text">
            {mediaType === "tv" ? "Trending Series" : "Featured Today"}
          </span>
        </div>

        <h1 className="hero-title">{title}</h1>

        <div className="hero-meta">
          {rating && <span className="hero-rating">★ {rating}</span>}
          {year && <><span className="hero-sep">·</span><span className="hero-year">{year}</span></>}
          {item.runtime && <><span className="hero-sep">·</span><span className="hero-dur">{Math.floor(item.runtime/60)}h {item.runtime%60}m</span></>}
        </div>

        {genres.length > 0 && (
          <div className="hero-genres">
            {genres.map(id => GENRE_MAP[id] && <span key={id} className="hero-genre-chip">{GENRE_MAP[id]}</span>)}
          </div>
        )}

        {item.overview && <p className="hero-overview">{item.overview}</p>}

        <div className="hero-actions">
          <button className="btn btn-red" style={{fontSize:"13px",padding:"14px 32px"}} onClick={() => onDetails(item, mediaType)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            {mediaType === "tv" ? "Watch Series" : "Watch Movie"}
          </button>
          <button className="btn btn-outline" style={{fontSize:"13px"}} onClick={() => onDetails(item, mediaType)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
