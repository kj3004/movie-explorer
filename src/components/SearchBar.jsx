import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  useTheme as useMuiTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMovies } from "../context/MovieContext";
import { useTheme } from "../context/ThemeContext";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { search } = useMovies();
  const { darkMode } = useTheme(); 
  const muiTheme = useMuiTheme(); 

  const handleSearch = (e) => {
    e.preventDefault();
    search(searchQuery);
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for movies..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
