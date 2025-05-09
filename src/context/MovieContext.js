import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchTrendingMovies,
  searchMovies,
  fetchMovieDetails,
} from "../services/api";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchTrendingMovies();
        setTrendingMovies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTrendingMovies();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const search = async (searchQuery, newPage = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setQuery(searchQuery);
      const data = await searchMovies(searchQuery, newPage);
      setMovies(newPage === 1 ? data.results : [...movies, ...data.results]);
      setTotalPages(data.total_pages);
      setPage(newPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (page < totalPages) {
      await search(query, page + 1);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      setLoading(true);
      const movie = await fetchMovieDetails(id);
      setSelectedMovie(movie);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((movie) => movie.id !== id));
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        trendingMovies,
        selectedMovie,
        loading,
        error,
        query,
        page,
        totalPages,
        favorites,
        search,
        loadMore,
        getMovieDetails,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
