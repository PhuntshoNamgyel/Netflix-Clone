require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase
const app = express();

// Enable CORS with credentials and set allowed origin
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Middleware for parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Mount authentication routes
app.use("/api/auth", authRoutes);

// Optional: Health check route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.listen(5000, () => console.log("Server running on port 5000"));
// Supabase Connection
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Route to Fetch Movies from Supabase
app.get("/movies", async (req, res) => {
    try {
      const { data, error } = await supabase.from("movies").select("*");
      if (error) throw error;
  
      // Generate trailer URLs for each movie from Supabase storage
      const moviesWithTrailers = await Promise.all(
        data.map(async (movie) => {
          const { data: trailerData, error: trailerError } = await supabase
            .storage
            .from("video") 
            .createSignedUrl(movie.trailer_path, 60); // 60s expiry
  
          if (trailerError) throw trailerError;
          return { ...movie, trailerUrl: trailerData.signedUrl };
        })
      );
  
      res.json(moviesWithTrailers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
