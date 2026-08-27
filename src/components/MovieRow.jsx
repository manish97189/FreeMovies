import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, items, mediaType = "movie", loading, onDetails }) {
  const ref = useRef(null);
  const scroll = dir => ref.current?.scrollBy({ left: dir==="left"?-440:440, behavior:"smooth" });

  if (!loading && (!items || items.length === 0)) return null;

  return (
    <section className="section">
      <div className="section-hd">
        <h2 className="section-title">
          {title}
          {!loading && items && <span className="section-count">({items.length})</span>}
        </h2>
      </div>
      <div className="row-wrap">
        <button className="row-arrow left" onClick={() => scroll("left")} aria-label="Scroll left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="row-scroll" ref={ref}>
          {loading
            ? Array.from({length:8},(_,i)=><div key={i} className="skeleton-base skeleton-card"/>)
            : items.map(item => <MovieCard key={item.id} item={item} mediaType={mediaType} onDetails={onDetails}/>)
          }
        </div>
        <button className="row-arrow right" onClick={() => scroll("right")} aria-label="Scroll right">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}
