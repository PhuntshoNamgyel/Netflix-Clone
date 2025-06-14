import React from "react";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

const movies = [
  {
    id: 1,
    title: "Squid game season 1",
    poster_path: "https://wallpapers.com/images/hd/squid-game-netflix-poster-k7snd3fl0h18f69w.jpg",
  },
  {
    id: 2,
    title: "The Bet",
    poster_path: "https://resizing.flixster.com/fT45XgGbgfflfbrVzGwoj0V6otA=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvZWRkYmNjN2MtOWU4Ny00OGY4LWFhYTctOTE5MTVkMzU1ZjE5LmpwZw==",
  },
  {
    id: 4,
    title: "One Piece",
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuOCUZ1H1jw-eQVtd06T9fmE8C236IrR-J3qluaGw7rMB5pxBhsJmnVGjsfTFBb73XBEc&usqp=CAU",
  },  
  {
    id: 5,
    title: "CyberPunk",
    poster_path: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/06/ENUS_CyberpunkE_S1_Main_Horizontal_16x9_RGB_PRE.jpg?q=70&fit=contain&w=1200&h=628&dpr=1",
  },    
  {
    id: 7,
    title: "Mismatched",
    poster_path: "https://c.saavncdn.com/839/Mismatched-Season-3-Soundtrack-from-the-Netflix-Series-Hindi-2024-20241217204803-500x500.jpg",
  },  
  {
    id: 8,
    title: "Barbie",
    poster_path: "https://deadline.com/wp-content/uploads/2023/04/barbie-BARBIE_Character_MARGOT_InstaVert_1638x2048_DOM_rgb.jpg?w=800",
  },  
  {
    id: 11,
    title: "Bubble",
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBccwxL-QMn8rorS72ORi6uFeg534K1tmZOJWkoCYC2ju8fckuJPzK8FtIUU1FZA9VVJ4&usqp=CAU",
  },
];

export default function MoviesListPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Mylist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </div>
  );
}