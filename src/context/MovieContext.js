import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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

  // Load trending movies only once when component mounts
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

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Memoize search function to prevent recreating on each render
  const search = useCallback(async (searchQuery, newPage = 1) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setQuery(searchQuery);
      const data = await searchMovies(searchQuery, newPage);

      setMovies((prevMovies) => {
        if (newPage === 1) {
          return data.results;
        } else {
          // Avoid duplicate movies when loading more
          const existingIds = new Set(prevMovies.map((m) => m.id));
          const newMovies = data.results.filter(
            (movie) => !existingIds.has(movie.id)
          );
          return [...prevMovies, ...newMovies];
        }
      });

      setTotalPages(data.total_pages);
      setPage(newPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize loadMore function
  const loadMore = useCallback(async () => {
    if (page < totalPages && query.trim()) {
      await search(query, page + 1);
    }
  }, [page, totalPages, query, search]);

  // Memoize getMovieDetails function to prevent recreating on each render
  const getMovieDetails = useCallback(
    async (id) => {
      if (!id) return;

      try {
        setLoading(true);
        const movie = await fetchMovieDetails(id);

        // Only update if the movie is different from current selectedMovie
        if (!selectedMovie || selectedMovie.id !== movie.id) {
          setSelectedMovie(movie);
        }
        return movie;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [selectedMovie]
  );

  // Memoize favorites management functions
  const addToFavorites = useCallback((movie) => {
    if (!movie) return;

    setFavorites((prevFavorites) => {
      if (!prevFavorites.some((fav) => fav.id === movie.id)) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((id) => {
    if (!id) return;

    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== id)
    );
  }, []);

  // Memoize context value to prevent unnecessary re-renders of consuming components
  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};
