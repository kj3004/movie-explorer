import React, { useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import { useMovies } from "../context/MovieContext";
import { useTheme as useAppTheme } from "../context/ThemeContext";

const Home = () => {
  const { movies, trendingMovies, loading, error, loadMore, page, totalPages } =
    useMovies();
  const containerRef = useRef(null);
  const muiTheme = useTheme();
  const { darkMode } = useAppTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        window.innerHeight + window.scrollY >=
          containerRef.current.offsetHeight - 500 &&
        !loading &&
        page < totalPages
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, page, totalPages, loadMore]);

  // Determine which movies to display
  const displayMovies = movies.length > 0 ? movies : trendingMovies;

  return (
    <Box sx={{ p: 3 }} ref={containerRef}>
      <SearchBar />
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h4" gutterBottom>
        {movies.length > 0 ? "Search Results" : "Trending Movies"}
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 3,
          padding: 2,
        }}
      >
        {displayMovies.map((movie) => (
          <Grid
            key={movie.id}
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      {loading && page > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Home;
