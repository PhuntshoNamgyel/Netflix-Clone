import React from "react";

export default function HeroBanner({ title, description, imageUrl }) {
  console.log("ImageUrl received:", imageUrl); // Debug log
  
  return (
    <div
      className="w-full h-64 md:h-96 flex items-end bg-cover bg-center rounded-lg mb-8"
      style={{
        backgroundImage: `url('${imageUrl || '/money-heist-banner.jpg'}')`,
      }}
    >
      <div className="bg-gradient-to-t from-black/80 to-transparent w-full p-8 rounded-b-lg">
        <h2 className="text-4xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white">{}</p>
      </div>
    </div>
  );
}