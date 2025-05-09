import React, { useEffect } from "react";
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
  YouTubeIcon,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const isFavorite = favorites.some((fav) => fav.id === parseInt(id));

  useEffect(() => {
    getMovieDetails(id);
  }, [id, getMovieDetails]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(parseInt(id));
    } else {
      addToFavorites(selectedMovie);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!selectedMovie) return null;

  const trailer = selectedMovie.videos?.results.find(
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

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <img
                src={
                  selectedMovie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={selectedMovie.title}
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
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
          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom>
              {selectedMovie.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Rating
                value={selectedMovie.vote_average / 2}
                precision={0.1}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body1">
                {selectedMovie.vote_average.toFixed(1)}/10 (
                {selectedMovie.vote_count} votes)
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {selectedMovie.overview}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {selectedMovie.genres?.map((genre) => (
                <Chip key={genre.id} label={genre.name} />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              <strong>Release Date:</strong> {selectedMovie.release_date}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Runtime:</strong> {selectedMovie.runtime} minutes
            </Typography>
            {selectedMovie.homepage && (
              <Button
                variant="contained"
                href={selectedMovie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mr: 2 }}
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
              >
                Watch Trailer
              </Button>
            )}
          </Grid>
        </Grid>

        {selectedMovie.credits?.cast?.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Cast
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
              {selectedMovie.credits.cast.slice(0, 10).map((person) => (
                <ListItem
                  key={person.id}
                  sx={{ flexDirection: "column", minWidth: 120 }}
                >
                  <Avatar
                    alt={person.name}
                    src={
                      person.profile_path
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : "/no-avatar.jpg"
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
    </Box>
  );
};

export default MovieDetails;
