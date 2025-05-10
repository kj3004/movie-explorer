# Movie Explorer App

![Movie Explorer Screenshot](./public/screenshot.png)

A React-based web application for discovering movies, viewing details, and saving favorites using the TMDb API.

## Features

### Core Features
- 🎬 **Movie Search**: Search for any movie by title
- 🔥 **Trending Section**: Discover currently popular movies
- 📺 **Movie Details**: View comprehensive information including:
  - Synopsis
  - Ratings
  - Cast
  - Trailers
  - Genres
- 🌓 **Dark/Light Mode**: Toggle between themes
- ❤️ **Favorites**: Save movies to local storage

### Bonus Features
- 🎥 **YouTube Trailers**: Direct links to movie trailers
- 🗂 **Responsive Design**: Works on all device sizes
- 📱 **Mobile-First UI**: Optimized for mobile experience

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm (v8+ recommended)
- TMDb API key (free from [TMDB](https://www.themoviedb.org/settings/api))

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kj3004/movie-explorer
   cd movie-explorer

### API Usage
This project uses The Movie Database (TMDb) API:

Endpoints Used
- GET /trending/movie/week - Get trending movies
- GET /search/movie - Search movies by title
- GET /movie/{movie_id} - Get movie details
- GET /movie/{movie_id}/videos - Get movie trailers
- GET /movie/{movie_id}/credits - Get cast information   

### Project Structure
src/
├── components/       # Reusable components
├── context/          # Global state management
├── pages/            # Page components
├── services/         # API service layer
├── App.js            # Main app component
└── index.js          # Entry point

### Deployment
The app is deployed on Vercel:
🔗 Live Demo - https://movie-explorer-mauve-phi.vercel.app/

### credentials 
Username - admin
Password - password