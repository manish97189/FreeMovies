import { useEffect, useRef, useState, useCallback } from "react";

export default function VideoPlayer({ session, iframeUrls, onClose }) {
  const { item, mediaType, episodeTitle, episodes = [] } = session;
  const [season, setSeason]   = useState(session.season  || 1);
  const [episode, setEpisode] = useState(session.episode || 1);
  const [epList]              = useState(episodes);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerRef = useRef(null); // ref on the whole player container

  const MOVIE_BASE = iframeUrls?.movie || "https://www.vidking.net/embed/movie/";
  const TV_BASE    = iframeUrls?.tv    || "https://www.vidking.net/embed/tv/";
  const title = item.title || item.name || "";

  const src = mediaType === "tv"
    ? `${TV_BASE}${item.id}/${season}/${episode}?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
    : `${MOVIE_BASE}${item.id}?color=e50914`;

  // ── Episode nav helpers ──────────────────────────────────────────────────
  const idx     = epList.findIndex(e => e.episode_number === episode);
  const hasPrev = idx > 0;
  const hasNext = idx < epList.length - 1;
  const goPrev  = useCallback(() => { if (hasPrev) setEpisode(epList[idx - 1].episode_number); }, [hasPrev, idx, epList]);
  const goNext  = useCallback(() => { if (hasNext) setEpisode(epList[idx + 1].episode_number); }, [hasNext, idx, epList]);
  const curEp   = epList[idx];

  // ── Native OS Fullscreen toggle ──────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Enter native fullscreen on the player container (whole monitor)
      playerRef.current?.requestFullscreen?.().catch(() => {
        // Safari fallback
        playerRef.current?.webkitRequestFullscreen?.();
      });
    } else {
      // Exit fullscreen
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    }
  }, []);

  // ── Track fullscreen state changes (e.g. user presses Esc natively) ──────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (mediaType === "tv") {
        if (e.key === "ArrowRight") goNext();
        if (e.key === "ArrowLeft")  goPrev();
      }
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev, toggleFullscreen, mediaType]);

  const subtitle = mediaType === "tv"
    ? `S${String(season).padStart(2, "0")}E${String(episode).padStart(2, "0")} — ${curEp?.name || episodeTitle || ""}`
    : null;

  return (
    <div className="player-overlay" ref={playerRef}>

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="player-top-bar">
        <div className="player-title-group">
          <div className="player-title">{title}</div>
          {subtitle && <div className="player-subtitle">{subtitle}</div>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Fullscreen toggle — makes the player fill your entire monitor */}
          <button
            className="close-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}
          >
            {isFullscreen ? (
              // Exit fullscreen icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
              </svg>
            ) : (
              // Enter fullscreen icon
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            )}
          </button>

          {/* Close */}
          <button className="close-btn" onClick={onClose} aria-label="Close player">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Iframe ──────────────────────────────────────────────────────── */}
      <div className="player-iframe-wrap">
        <iframe
          key={`${item.id}-${season}-${episode}`}
          src={src}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; xr-spatial-tracking"
          allowFullScreen
          referrerPolicy="no-referrer"
          title={`Watch ${title}`}
          frameBorder="0"
        />
      </div>

      {/* ── Bottom Bar (TV episode nav) ──────────────────────────────────── */}
      {mediaType === "tv" && epList.length > 0 && (
        <div className="player-bottom-bar">
          <button className="player-ep-nav" onClick={goPrev} disabled={!hasPrev}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            Previous
          </button>
          <span style={{ color: "var(--t2)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px" }}>
            Episode {episode} of {epList.length}
          </span>
          <button className="player-ep-nav" onClick={goNext} disabled={!hasNext}>
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Keyboard hint */}
      <div style={{
        position: "absolute", bottom: mediaType === "tv" && epList.length > 0 ? 60 : 12,
        right: 16, fontSize: "11px", color: "rgba(255,255,255,0.25)",
        fontWeight: 500, letterSpacing: "0.5px", pointerEvents: "none",
      }}>
        F — fullscreen · ESC — close
      </div>
    </div>
  );
}
