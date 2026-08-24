import { useState } from "react";
import.meta.env.VITE_TMDB_TOKEN;
import.meta.env.VITE_IFRAME_URL;

function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  async function getMovies() {
    if (!search.trim()) return;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        search
      )}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    setMovies(data.results);
  }

  function watchMovie(id) {
    console.log("Movie ID:", id);
    setSelectedMovie(id);
  }

  return (
    <div className="min-h-screen bg-black p-10 text-white">

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-lg px-4 py-2 text-black"
        />

        <button
          onClick={getMovies}
          className="rounded-lg bg-blue-500 px-5 py-2"
        >
          Search
        </button>
      </div>

      {/* Movies */}
      <div className="mt-8 grid grid-cols-4 gap-6">

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="overflow-hidden rounded-lg bg-gray-900"
          >

            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="h-80 w-full object-cover"
              />
            )}

            <div className="p-4">

              <h2 className="text-xl font-bold">
                {movie.title}
              </h2>

              <p className="mt-2 text-gray-400">
                TMDB ID: {movie.id}
              </p>

              <button
                onClick={() => watchMovie(movie.id)}
                className="mt-3 rounded-lg bg-red-600 px-5 py-2 hover:bg-red-700"
              >
                Watch Movie
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* Video Player */}
      {selectedMovie && (
        <div className="mt-10">

          <h2 className="mb-4 text-2xl font-bold">
            Watching: {selectedMovie}
          </h2>

          <iframe
            src={`${import.meta.env.VITE_IFRAME_URL}${selectedMovie}`}
            width="100%"
            height="600"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
            title="Movie Player"
            className="rounded-lg"
          />

        </div>
      )}

    </div>
  );
}

export default App;