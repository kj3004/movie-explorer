import axios from "axios";

const API_KEY = "a05a26e2cc455ff43e3b34df209a10dc"; 
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const fetchTrendingMovies = async () => {
  try {
    const response = await api.get("/trending/movie/week");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await api.get("/search/movie", {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 0 };
  }
};

export const fetchMovieDetails = async (id) => {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        append_to_response: "videos,credits",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export default api;
