import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Rating,
  IconButton,
  Skeleton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import YouTubeIcon from "@mui/icons-material/YouTube";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedMovie,
    getMovieDetails,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    favorites,
  } = useMovies();
  const [localLoading, setLocalLoading] = useState(true);
  const isFavorite = favorites.some((fav) => fav.id === parseInt(id));

  // Memoize fetchData to prevent it from recreating on every render
  const fetchMovieData = useCallback(async () => {
    if (!id) return;
    try {
      setLocalLoading(true);
      await getMovieDetails(id);
    } finally {
      setLocalLoading(false);
    }
  }, [id, getMovieDetails]);

  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(parseInt(id));
    } else if (selectedMovie) {
      addToFavorites(selectedMovie);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!selectedMovie && !localLoading)
    return <Alert severity="info">Movie not found</Alert>;

  const trailer = selectedMovie?.videos?.results?.find(
    (video) => video.type === "Trailer"
  );

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {localLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <CircularProgress size={80} />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Removed 'item' prop and kept xs and md for now */}
            <Grid xs={12} md={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {selectedMovie?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                ) : (
                  <Skeleton variant="rectangular" width={300} height={450} />
                )}
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={handleFavoriteClick} size="large">
                  {isFavorite ? (
                    <FavoriteIcon color="error" fontSize="large" />
                  ) : (
                    <FavoriteBorderIcon fontSize="large" />
                  )}
                </IconButton>
              </Box>
            </Grid>

            <Grid xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                {selectedMovie?.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating
                  value={
                    selectedMovie?.vote_average
                      ? selectedMovie.vote_average / 2
                      : 0
                  }
                  precision={0.1}
                  readOnly
                  sx={{ mr: 1 }}
                />
                <Typography variant="body1">
                  {selectedMovie?.vote_average?.toFixed(1)}/10 (
                  {selectedMovie?.vote_count} votes)
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedMovie?.overview}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {selectedMovie?.genres?.map((genre) => (
                  <Chip key={genre.id} label={genre.name} />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                <strong>Release Date:</strong> {selectedMovie?.release_date}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Runtime:</strong> {selectedMovie?.runtime} minutes
              </Typography>
              {selectedMovie?.homepage && (
                <Button
                  variant="contained"
                  href={selectedMovie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mr: 2, mb: 2 }}
                >
                  Official Website
                </Button>
              )}
              {trailer && (
                <Button
                  variant="contained"
                  color="secondary"
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<YouTubeIcon />}
                  sx={{ mb: 2 }}
                >
                  Watch Trailer
                </Button>
              )}
            </Grid>
          </Grid>

          {selectedMovie?.credits?.cast?.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Cast
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
                {selectedMovie.credits.cast.slice(0, 10).map((person) => (
                  <ListItem
                    key={person.id}
                    sx={{
                      flexDirection: "column",
                      minWidth: 120,
                      padding: 0,
                      marginRight: 2,
                    }}
                  >
                    <Avatar
                      alt={person.name}
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                          : "/no-avatar.svg"
                      }
                      sx={{ width: 80, height: 80, mb: 1 }}
                    />
                    <ListItemText
                      primary={person.name}
                      secondary={person.character}
                      primaryTypographyProps={{ align: "center" }}
                      secondaryTypographyProps={{ align: "center" }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default MovieDetails;
