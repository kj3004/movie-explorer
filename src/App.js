import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { MovieProvider } from "./context/MovieContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MovieDetails from "./components/MovieDetails";
import FavoritesPage from "./pages/FavoritesPage";
import { CssBaseline } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <MovieProvider>
        <Router>
          <CssBaseline />
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <PrivateRoute>
                  <MovieDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoritesPage />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </MovieProvider>
    </ThemeProvider>
  );
};

export default App;
