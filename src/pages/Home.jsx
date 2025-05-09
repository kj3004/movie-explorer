import React, { useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import { useMovies } from "../context/MovieContext";

const Home = () => {
  const { movies, trendingMovies, loading, error, loadMore, page, totalPages } =
    useMovies();
  const containerRef = useRef(null);

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

  return (
    <Box sx={{ p: 3 }} ref={containerRef}>
      <SearchBar />

      {error && <Alert severity="error">{error}</Alert>}

      {movies.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
          {loading && page > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Trending Movies
          </Typography>
          <Grid container spacing={3}>
            {trendingMovies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Home;
