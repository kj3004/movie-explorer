import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Rating,
  Box,
  useTheme
} from "@mui/material";
import { Link } from "react-router-dom";
import { useMovies } from "../context/MovieContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useTheme as useAppTheme } from "../context/ThemeContext";

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, favorites } = useMovies();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);
  const muiTheme = useTheme();
  const { darkMode } = useAppTheme();


  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        height="400"
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/no-poster.jpg"
        }
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {movie.title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </Typography>
          <Rating
            name="read-only"
            value={movie.vote_average / 2}
            precision={0.5}
            readOnly
          />
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          size="small"
          onClick={handleFavoriteClick}
          startIcon={
            isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />
          }
        >
          {isFavorite ? "Remove" : "Add"}
        </Button>
        <Button size="small" component={Link} to={`/movie/${movie.id}`}>
          Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieCard;
