import { useState, useEffect } from "react";
import { getTV, getTVSeason, imgOrig, imgW500, imgW185 } from "../services/api";

export default function TVDetails({ item, onClose, onWatch }) {
  const [detail, setDetail]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState(null);
  const [activeSeason, setSeason] = useState(1);
  const [episodes, setEpisodes]   = useState([]);
  const [epLoading, setEpLoading] = useState(false);
  const [epErr, setEpErr]         = useState(null);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  useEffect(() => {
    setLoading(true); setErr(null);
    getTV(item.id)
      .then(data => {
        setDetail(data);
        const first = data.seasons?.find(s => s.season_number > 0);
        if (first) setSeason(first.season_number);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [item.id]);

  useEffect(() => {
    if (!detail) return;
    setEpLoading(true); setEpErr(null);
    getTVSeason(item.id, activeSeason)
      .then(data => setEpisodes(data.episodes || []))
      .catch(e => setEpErr(e.message))
      .finally(() => setEpLoading(false));
  }, [item.id, activeSeason, detail]);

  const d = detail || item;
  const title   = d.name || d.title || "";
  const year    = (d.first_air_date || "").slice(0, 4);
  const rating  = d.vote_average ? d.vote_average.toFixed(1) : null;
  const genres  = d.genres?.map(g => g.name) || [];
  const cast    = d.credits?.cast?.slice(0, 8) || [];
  const seasons = d.seasons?.filter(s => s.season_number > 0) || [];

  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box scale-in">
        <div className="modal-close-btn">
          <button onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="details-hero" style={{marginTop:"-48px"}}>
          {d.backdrop_path ? <img src={imgOrig(d.backdrop_path)} alt={title}/> : <div className="details-no-backdrop">📺</div>}
          <div className="details-hero-grad"/>
          <div className="details-type-pill">📺 Series</div>
        </div>

        <div className="details-body">
          <div className="details-poster">
            {d.poster_path ? <img src={imgW500(d.poster_path)} alt={title}/> : <div className="details-poster-placeholder">📺</div>}
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
                  {d.number_of_seasons && <span className="meta-chip">{d.number_of_seasons} Season{d.number_of_seasons>1?"s":""}</span>}
                  {d.number_of_episodes && <span className="meta-chip">{d.number_of_episodes} Episodes</span>}
                  {d.status && <span className="meta-chip">{d.status}</span>}
                </div>
                {genres.length > 0 && (
                  <div className="details-genres">{genres.map(g => <span key={g} className="genre-pill">{g}</span>)}</div>
                )}
                {d.overview && <p className="details-overview">{d.overview}</p>}

                {/* Cast */}
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

                {/* Season Selector */}
                {seasons.length > 0 && (
                  <div style={{marginBottom:"20px"}}>
                    <div className="details-section-lbl">Seasons</div>
                    <div className="season-selector">
                      {seasons.map(s => (
                        <button key={s.season_number} className={`season-btn${activeSeason===s.season_number?" active":""}`} onClick={() => setSeason(s.season_number)}>
                          Season {s.season_number}
                          <span style={{fontSize:"11px",opacity:0.65,marginLeft:4}}>({s.episode_count})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Episode List */}
                <div>
                  <div className="details-section-lbl">Season {activeSeason} — Episodes</div>
                  {epLoading ? (
                    <div className="spinner" style={{width:24,height:24,borderWidth:2,margin:"16px 0"}}/>
                  ) : epErr ? (
                    <p style={{color:"var(--t3)",fontSize:"13px"}}>Failed to load episodes.</p>
                  ) : episodes.length === 0 ? (
                    <p style={{color:"var(--t3)",fontSize:"13px"}}>No episodes available.</p>
                  ) : (
                    <div className="episodes-list">
                      {episodes.map(ep => (
                        <EpisodeCard key={ep.id} ep={ep} onWatch={() => onWatch({
                          item: d, mediaType: "tv",
                          season: activeSeason, episode: ep.episode_number,
                          episodeTitle: ep.name,
                          episodes, allSeasons: seasons,
                        })}/>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EpisodeCard({ ep, onWatch }) {
  const still = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : null;
  const air   = ep.air_date ? new Date(ep.air_date).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}) : null;
  return (
    <div className="episode-card">
      <div className="ep-still">
        {still ? <img src={still} alt={ep.name} loading="lazy"/> : <div className="ep-still-placeholder">▶</div>}
      </div>
      <div className="ep-info">
        <div className="ep-number">Episode {ep.episode_number}</div>
        <div className="ep-title">{ep.name}</div>
        <div className="ep-meta">{[air, ep.runtime?`${ep.runtime}m`:null].filter(Boolean).join(" · ")}</div>
        {ep.overview && <p className="ep-overview">{ep.overview}</p>}
      </div>
      <button className="ep-watch-btn" onClick={onWatch}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Watch
      </button>
    </div>
  );
}
