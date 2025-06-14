"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import MovieCard from "@/components/MovieCard";
import Modal from "@/components/Modal";
import VideoPlayer from "@/components/VideoPlayer";
import {
  FaHome,
  FaSearch,
  FaList,
  FaPlay,
  FaPlus,
  FaFilm,
} from "react-icons/fa";

// Use a larger set of unique poster images for more variety
const movieData = [
  { title: "Squid Game", poster: "https://upload.wikimedia.org/wikipedia/en/7/7b/Squid_Game_season_1_poster.png", },
  { title: "Love Death + Robots", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2H2wO2mqTQB_ET6r5ARUXvcb0vrMVJoiWBw&s", },
  { title: "The Bet", poster: "https://resizing.flixster.com/fT45XgGbgfflfbrVzGwoj0V6otA=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvZWRkYmNjN2MtOWU4Ny00OGY4LWFhYTctOTE5MTVkMzU1ZjE5LmpwZw==", },
  { title: "Start-Up", poster: "https://miro.medium.com/v2/resize:fit:1400/1*am-e_KwXVlAdXVrYF81L6g.jpeg", },
  { title: "Friendly Rivalry", poster: "https://upload.wikimedia.org/wikipedia/en/a/a7/Friendly_Rivalry_poster.png", },
  { title: "WonderLand", poster: "https://m.media-amazon.com/images/M/MV5BY2EzN2MwOGUtYzlkNi00MmI0LTlkZmUtOWEzZTEwZTdhMjMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", },
  { title: "CyberPunk: Edgerunners", poster: "https://static0.srcdn.com/wordpress/wp-content/uploads/2023/05/cyberpunk-edgerunners-tv-poster.jpg", },
  { title: "The School Nurse Files", poster: "https://thesmartlocal.kr/wp-content/uploads/2023/04/Short-Korean-dramas-13-691x1024.jpg",},
  { title: "My Happy Marriage", poster: "https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p24927836_b_v13_aa.jpg", },
  { title: "My Demon", poster: "https://artworks.thetvdb.com/banners/v4/series/429870/posters/654500c1c741c.jpg", },
  { title: "Doona", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRlWj8nXbfPacTQWES5GQ_YAJIRjGyApexc2CNWyIODf2u4Z8nMg7lmAsexgrCu9NUiuk&usqp=CAU", },
  { title: "The Mask Girl", poster: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/09/mask-girl-netflix-poster.jpg", },
  { title: "Romantic Killer", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5B2JVi9lGpETHl_OxlgV1n8ucvWJxtT6ATR_P8RRpLAB8AdIuq533GpzLWDKdz-JYSYY&usqp=CAU", },
  { title: "Enola Holmes", poster: "https://image.tmdb.org/t/p/w500/riYInlsq2kf1AWoGm80JQW5dLKp.jpg", },
  { title: "The Alchemy Of Souls", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsKsGqkhteTm0knOAgNIP1cl1grwVC3fvcCA&s", },
];

function Carousel({ title, movies, onSelect }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {movies.map((movie, idx) => (
          <div key={idx} className="flex-shrink-0 w-[160px]">
            <MovieCard movie={movie} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ALL_MOVIES = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  title: movieData[i % movieData.length].title,
  poster_path: movieData[i % movieData.length].poster,
  video_url: "/path_to_video.mp4",
}));

const PAGE_SIZE = 12;

export default function Page() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const movies = ALL_MOVIES.slice(0, visibleCount);

  // Infinite scroll logic
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && visibleCount < ALL_MOVIES.length) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, ALL_MOVIES.length)
          );
          setLoading(false);
        }, 500); // Simulate loading delay
      }
    },
    [visibleCount]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new window.IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    // For routing to details page in the future:
    // router.push(`/movies/${movie.id}`);
  };

  const allMovies = movieData; // Show all movies in a grid below hero

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-8 bg-[#141414] space-y-8">
        <FaPlus 
          className="text-2xl text-gray-400 hover:text-white cursor-pointer"
          onClick={() => window.location.href = "/upload"} 
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-0 md:px-8 pb-8">
        {/* Hero Banner */}
        <section className="relative flex flex-col md:flex-row items-center md:items-end bg-gradient-to-r from-black via-[#181818] to-transparent h-[400px] md:h-[440px] w-full overflow-hidden mb-10">
          <div className="z-10 p-8 md:w-1/2 flex flex-col justify-center h-full">
            <div className="mb-2">
              <span className="text-xs text-red-600 font-bold tracking-widest">
                N SERIES
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2">
              <span className="font-light">MONEY</span>
              <span className="ml-2 px-2 bg-red-600 text-white rounded">
                HEIST
              </span>
            </h1>
            <div className="text-gray-300 text-lg mb-2">PART 4</div>
            <div className="flex items-center gap-4 mb-2">
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                IMDb
              </span>
              <span className="text-white font-semibold">8.8/10</span>
              <span className="text-red-500 font-bold">2B+ Streams</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded flex items-center gap-2">
                <FaPlay /> Play
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded">
                Watch Trailer
              </button>
            </div>
          </div>
          <img
            src="/money-heist-banner.jpg"
            alt="Money Heist Banner"
            className="absolute right-0 top-0 h-full object-cover w-full md:w-2/3 opacity-60 md:opacity-100"
            style={{ objectPosition: "right" }}
          />
        </section>

        {/* All Movies Grid */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-black mb-4">All Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {allMovies.map((movie, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  handleCardClick({
                    ...movie,
                    video_url: movie.video_url || "/path_to_video.mp4",
                  })
                }
                className="flex flex-col items-center group focus:outline-none"
                tabIndex={0}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-[140px] h-[210px] object-cover rounded-lg shadow-md mb-2 transition-transform duration-200 group-hover:scale-105 group-focus:scale-105 group-hover:ring-2 group-hover:ring-red-600"
                  style={{ background: "#222" }}
                />
                <span className="text-white text-sm text-center group-hover:text-red-500 group-focus:text-red-500 transition-colors">
                  {movie.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal for video */}
        <Modal isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
          {selectedMovie && (
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">
                {selectedMovie.title}
              </h2>
              <VideoPlayer
                videoUrl={selectedMovie.video_url || "/path_to_video.mp4"}
              />
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}