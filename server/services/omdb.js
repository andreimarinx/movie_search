// server/services/omdb.js

const axios = require("axios");

const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = "http://www.omdbapi.com/";

if (!API_KEY) throw new Error("OMDB_API_KEY must be set in .env");

//Search movies by title + page
async function searchMovies(query, page = 1) {
  // Search list with page
  const { data: list } = await axios.get(BASE_URL, {
    params: {
      apikey: API_KEY,
      s: query,
      type: "movie",
      page,
    },
    timeout: 5000,
  });

  //If no results
  if (list.Response === "False" || !list.Search) return { movies: [], totalResults: 0 };

  //Fetch details for each ID
  const movies = await Promise.all(
    list.Search.map(async ({ imdbID, Poster }) => {
      const { data: detail } = await axios.get(BASE_URL, {
        params: { apikey: API_KEY, i: imdbID, plot: "short" },
        timeout: 5000,
      });

      return {
        id: imdbID,
        title: detail.Title,
        releaseDate: detail.Released !== "N/A" ? detail.Released : detail.Year,
        overview: detail.Plot !== "N/A" ? detail.Plot : "",
        posterPath: Poster !== "N/A" ? Poster : "",
      };
    })
  );

  return {
    movies,
    totalResults: parseInt(list.totalResults, 10),
  };
}

module.exports = { searchMovies };
