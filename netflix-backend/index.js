require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js"); // Import Supabase

const app = express();
app.use(cors());
app.use(express.json());

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
