import "./app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import TvShows from "./pages/MovieDetails"; // Renamed to follow naming conventions
import MyList from "./pages/Seris"; // Renamed to follow naming conventions
import WatchList from "./pages/WatchList";
import SearchResults from "./pages/SearchResults";
import MovieDetails from "./pages/MovieDetails"; // Import for dynamic movie details

function App() { // Renamed to follow React conventions
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/tvshows" element={<TvShows />} />
                    <Route path="/mylist" element={<MyList />} />
                    <Route path="/watchlist" element={<WatchList />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/movies/:id" element={<MovieDetails />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;