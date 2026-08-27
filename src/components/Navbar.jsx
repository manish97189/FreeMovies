import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const GENRES = [
  { label: "Action",    id: 28 },
  { label: "Comedy",    id: 35 },
  { label: "Horror",    id: 27 },
  { label: "Sci-Fi",    id: 878 },
  { label: "Thriller",  id: 53 },
  { label: "Romance",   id: 10749 },
  { label: "Animation", id: 16 },
  { label: "Drama",     id: 18 },
  { label: "Crime",     id: 80 },
  { label: "Adventure", id: 12 },
];

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [query,      setQuery]      = useState("");
  const [genreOpen,  setGenreOpen]  = useState(false);
  const genreRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => { if (genreRef.current && !genreRef.current.contains(e.target)) setGenreOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleGenre(id) {
    setGenreOpen(false);
    navigate(`/genre/${id}`);
  }

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      {/* Left */}
      <div className="nav-left">
        <NavLink to="/" className="nav-logo">
          <span className="logo-cine">CINE</span>
          <div className="logo-dot" />
          <span className="logo-stream">STREAM</span>
        </NavLink>

        <div className="nav-links">
          <NavLink to="/" end className={({isActive}) => `nav-link${isActive?" active":""}`}>Home</NavLink>
          <NavLink to="/movies"  className={({isActive}) => `nav-link${isActive?" active":""}`}>Movies</NavLink>
          <NavLink to="/tv"      className={({isActive}) => `nav-link${isActive?" active":""}`}>TV Shows</NavLink>

          {/* Genre dropdown */}
          <div className="nav-dropdown" ref={genreRef}>
            <button className="nav-link" onClick={() => setGenreOpen(p => !p)}>
              Genres
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{marginLeft:4, transform:genreOpen?"rotate(180deg)":"", transition:"transform 0.2s"}}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {genreOpen && (
              <div className="nav-dropdown-menu">
                {GENRES.map(g => (
                  <button key={g.id} className="nav-dropdown-item" onClick={() => handleGenre(g.id)}>
                    {g.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right — Search */}
      <div className="nav-right">
        <form onSubmit={handleSearch} style={{display:"flex"}}>
          <div className="nav-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Search movies, shows..."
              value={query} onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" className="nav-search-clear" onClick={() => { setQuery(""); }}>✕</button>
            )}
          </div>
        </form>
      </div>
    </nav>
  );
}
