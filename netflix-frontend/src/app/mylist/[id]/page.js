'use client'
import React from "react";
import { useRouter } from "next/navigation"; // Correct import for App Router

const movies = [
  {
    id: 1,
    title: "Squid game season 1",
    description: "Squid Game Season 1 is a South Korean thriller about 456 desperate contestants who participate in a series of deadly children's games for a massive cash prize.",
    poster_path: "https://wallpapers.com/images/hd/squid-game-netflix-poster-k7snd3fl0h18f69w.jpg",
  },
  {
    id: 2,
    title: "The Bet",
    description: "The Bet is a gripping drama that explores the consequences of a high-stakes wager, testing relationships and moral boundaries.",
    poster_path: "https://resizing.flixster.com/fT45XgGbgfflfbrVzGwoj0V6otA=/ems.cHJkLWVtcy1hc3NldHMvdHZzZXJpZXMvZWRkYmNjN2MtOWU4Ny00OGY4LWFhYTctOTE5MTVkMzU1ZjE5LmpwZw==",
  },
  {
    id: 3,
    title: "One Piece",
    description: "One Piece is an epic adventure series that follows Monkey D. Luffy and his crew as they search for the ultimate treasure, the One Piece, while battling formidable foes and uncovering the mysteries of the Grand Line.", 
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuOCUZ1H1jw-eQVtd06T9fmE8C236IrR-J3qluaGw7rMB5pxBhsJmnVGjsfTFBb73XBEc&usqp=CAU",
  },  
  {
    id: 4,
    title: "CyberPunk",
    description: "CyberPunk is a thrilling sci-fi series set in a dystopian future where technology and humanity collide, following a group of rebels fighting against a corrupt system.",
    poster_path: "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/06/ENUS_CyberpunkE_S1_Main_Horizontal_16x9_RGB_PRE.jpg?q=70&fit=contain&w=1200&h=628&dpr=1",
  },    
  {
    id: 5,
    title: "Mismatched",
    description: "Mismatched is a romantic drama series that explores the complexities of love and relationships, focusing on two individuals who seem incompatible but find common ground in unexpected ways.",
    poster_path: "https://c.saavncdn.com/839/Mismatched-Season-3-Soundtrack-from-the-Netflix-Series-Hindi-2024-20241217204803-500x500.jpg",
  },  
  {
    id: 6,
    title: "Barbie",
    description: "Barbie is a vibrant and imaginative film that brings the iconic doll to life, exploring themes of empowerment, friendship, and self-discovery in a whimsical world.",
    poster_path: "https://deadline.com/wp-content/uploads/2023/04/barbie-BARBIE_Character_MARGOT_InstaVert_1638x2048_DOM_rgb.jpg?w=800",
  },  
  {
    id: 7,
    title: "Bubble",
    description: "Bubble is a visually stunning animated film that tells the story of a group of friends navigating their lives in a world where bubbles float above the city, representing dreams and aspirations.",
    poster_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBccwxL-QMn8rorS72ORi6uFeg534K1tmZOJWkoCYC2ju8fckuJPzK8FtIUU1FZA9VVJ4&usqp=CAU",
  },
];

export default function MovieDetailsPage({ params }) {
  const { id } = params; // Use params instead of router.query in App Router

  const movie = movies.find((movie) => movie.id === parseInt(id));

  if (!movie) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={movie.poster_path}
        alt={movie.title}
        className="w-full max-w-md mb-4"
      />
      <p>{movie.description}</p>
    </div>
  );
}