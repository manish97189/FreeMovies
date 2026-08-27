import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import TVDetails from "./components/TVDetails";
import VideoPlayer from "./components/VideoPlayer";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import TVPage from "./pages/TVPage";
import SearchPage from "./pages/SearchPage";
import GenrePage from "./pages/GenrePage";
import "./index.css";

export default function App() {
  // Shared hero state (set on home page)
  const [heroItem, setHeroItem] = useState(null);

  // Iframe URLs
  const iframeUrls = {
    movie: "https://www.vidking.net/embed/movie/",
    tv:    "https://www.vidking.net/embed/tv/",
  };

  // Modal state
  const [detailsItem, setDetailsItem]   = useState(null); // { item, mediaType }
  const [playerSession, setPlayerSession] = useState(null);

  function openDetails(item, mediaType) {
    setDetailsItem({ item, mediaType });
  }
  function openPlayer(session) {
    setDetailsItem(null);
    setPlayerSession(session);
  }

  return (
    <BrowserRouter>
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={
            <HomePage onDetails={openDetails} heroItem={heroItem} setHeroItem={setHeroItem} />
          }/>
          <Route path="/movies"    element={<MoviesPage onDetails={openDetails} />} />
          <Route path="/tv"        element={<TVPage     onDetails={openDetails} />} />
          <Route path="/search"    element={<SearchPage onDetails={openDetails} />} />
          <Route path="/genre/:id" element={<GenrePage  onDetails={openDetails} />} />
          {/* 404 */}
          <Route path="*" element={
            <div className="empty" style={{paddingTop:"160px"}}>
              <div className="empty-icon">🎬</div>
              <h3>PAGE NOT FOUND</h3>
              <p>The reel seems to have snapped.</p>
              <a className="btn btn-red" href="/" style={{marginTop:18,display:"inline-flex"}}>Go Home</a>
            </div>
          }/>
        </Routes>
      </main>

      <Footer />

      {/* Movie Details Modal */}
      {detailsItem?.mediaType === "movie" && (
        <MovieDetails item={detailsItem.item} onClose={() => setDetailsItem(null)} onWatch={openPlayer} />
      )}
      {/* TV Details Modal */}
      {detailsItem?.mediaType === "tv" && (
        <TVDetails item={detailsItem.item} onClose={() => setDetailsItem(null)} onWatch={openPlayer} />
      )}
      {/* Video Player */}
      {playerSession && (
        <VideoPlayer session={playerSession} iframeUrls={iframeUrls} onClose={() => setPlayerSession(null)} />
      )}
    </BrowserRouter>
  );
}