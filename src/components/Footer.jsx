import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-logo">ANNU<span className="red">MOVIES</span></div>
          <p className="footer-tagline">
            Your premium destination for movies and TV shows. Stream anything, anytime.
          </p>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.25)",marginTop:"8px",fontWeight:500}}>
            Made with ❤️ by <span style={{color:"var(--red)",fontWeight:700}}>Manish</span>
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Browse</h4>
            <Link to="/">Home</Link>
            <Link to="/movies">Movies</Link>
            <Link to="/tv">TV Shows</Link>
            <Link to="/genre/28">Action</Link>
            <Link to="/genre/27">Horror</Link>
          </div>
          <div className="footer-col">
            <h4>Genres</h4>
            <Link to="/genre/35">Comedy</Link>
            <Link to="/genre/18">Drama</Link>
            <Link to="/genre/878">Sci-Fi</Link>
            <Link to="/genre/53">Thriller</Link>
            <Link to="/genre/16">Animation</Link>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <a href="#">About</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          © 2026 Annumovies. Powered by TMDB. Not affiliated with any studio.
        </span>
        <div style={{display:"flex",alignItems:"center",gap:"18px"}}>
          {/* @Manish watermark */}
          <span style={{
            fontSize:"13px",
            fontWeight:700,
            color:"var(--red)",
            letterSpacing:"0.5px",
            fontFamily:"Inter, sans-serif"
          }}>@Manish</span>
          <div className="footer-social">
            <button className="footer-social-btn">𝕏</button>
            <button className="footer-social-btn">📘</button>
            <button className="footer-social-btn">📸</button>
            <button className="footer-social-btn">▶</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
