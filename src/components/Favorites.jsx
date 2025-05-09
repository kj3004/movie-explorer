import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import MovieCard from "./MovieCard";
import { useMovies } from "../context/MovieContext";

const Favorites = () => {
  const { favorites } = useMovies();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Favorite Movies
      </Typography>
      {favorites.length === 0 ? (
        <Typography variant="body1">
          You haven't added any favorites yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;
