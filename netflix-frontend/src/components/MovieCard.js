import React from "react";

export default function MovieCard({ movie }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img
        src={movie.poster_path}
        alt={movie.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-bold">{movie.title}</h2>
      </div>
    </div>
  );
}