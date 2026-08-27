import { useState, useEffect } from "react";
import { getMovie, imgOrig, imgW500, imgW185 } from "../services/api";

export default function MovieDetails({ item, onClose, onWatch }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  useEffect(() => {
    setLoading(true); setErr(null);
    getMovie(item.id).then(setDetail).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [item.id]);

  const d = detail || item;
  const title   = d.title || "";
  const year    = (d.release_date || "").slice(0, 4);
  const rating  = d.vote_average ? d.vote_average.toFixed(1) : null;
  const runtime = d.runtime ? `${Math.floor(d.runtime/60)}h ${d.runtime%60}m` : null;
  const genres  = d.genres?.map(g => g.name) || [];
  const cast    = d.credits?.cast?.slice(0, 8) || [];
  const director = d.credits?.crew?.find(c => c.job === "Director");

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box scale-in">
        <div className="modal-close-btn">
          <button onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="details-hero" style={{marginTop:"-48px"}}>
          {d.backdrop_path ? <img src={imgOrig(d.backdrop_path)} alt={title}/> : <div className="details-no-backdrop">🎬</div>}
          <div className="details-hero-grad"/>
          <div className="details-type-pill">🎬 Movie</div>
        </div>

        <div className="details-body">
          <div className="details-poster">
            {d.poster_path ? <img src={imgW500(d.poster_path)} alt={title}/> : <div className="details-poster-placeholder">🎬</div>}
          </div>
          <div className="details-info">
            {loading && !detail ? (
              <div className="spinner" style={{margin:"40px 0"}}/>
            ) : err ? (
              <div className="empty" style={{padding:"40px 0",textAlign:"left"}}><div className="empty-icon">⚠️</div><p>{err}</p></div>
            ) : (
              <>
                <h2 className="details-title">{title}</h2>
                {d.tagline && <p className="details-tagline">"{d.tagline}"</p>}
                <div className="details-meta">
                  {rating && <span className="details-rating">★ {rating}</span>}
                  {year   && <span className="meta-chip">{year}</span>}
                  {runtime && <span className="meta-chip">{runtime}</span>}
                  {d.status && <span className="meta-chip">{d.status}</span>}
                </div>
                {genres.length > 0 && (
                  <div className="details-genres">{genres.map(g => <span key={g} className="genre-pill">{g}</span>)}</div>
                )}
                {d.overview && <p className="details-overview">{d.overview}</p>}
                {director && (
                  <p style={{fontSize:"13px",color:"var(--t3)",marginBottom:"16px"}}>
                    <strong style={{color:"var(--t2)"}}>Director:</strong> {director.name}
                  </p>
                )}
                {cast.length > 0 && (
                  <div style={{marginBottom:"24px"}}>
                    <div className="details-section-lbl">Cast</div>
                    <div className="cast-row">
                      {cast.map(c => (
                        <div key={c.id} className="cast-item">
                          {c.profile_path ? <img src={imgW185(c.profile_path)} alt={c.name} className="cast-avatar"/> : <div className="cast-no-avatar">👤</div>}
                          <span className="cast-name">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="details-actions">
                  <button className="btn btn-red" style={{fontSize:"16px",padding:"14px 36px"}} onClick={() => onWatch({item:d, mediaType:"movie"})}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Watch Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
