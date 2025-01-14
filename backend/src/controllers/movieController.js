const axios = require("axios");
const MovieStatus = require("../Model/movieModel");
const BASE_URL = process.env.BASE_URL; 
const API_KEY = process.env.API_KEY; 

// Movie Controller Get movies
const getMedia = async (req, res) => {
  const { type, category, id, action, query, append } = req.query;

  // Initialize a variable to store the API endpoint URL
  let url;

  // Use a switch statement to determine the URL based on the action
  switch (action) {
    case "adventure":
      // Fetch a list of adventure movies (genre ID 12 corresponds to "Adventure")
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=12`;
      break;

    case "allGenreList":
      // Fetch a list of all movie genres
      url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
      break;

    case "allGenreListTV":
      // Fetch a list of all TV genres
      url = `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`;
      break;

    case "details":
      // Fetch detailed information for a specific item
      url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en${
        append ? `&append_to_response=videos,images` : ""
      }`;
      break;

    case "reviews":
      // Fetch user reviews for a specific item
      url = `${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`;
      break;

    case "search":
      // Perform a search query for the specified type
      url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}`;
      break;

    default:
      // Default case: Fetch a list of items for the specified type and category
      url = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&language=en-US`;
      break;
  }
  console.log(url);
  // Fetch data from external API
  try {
    const response = await axios.get(url);
    res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.status_message || error.message;
    res.status(statusCode).json({ error: errorMessage });
  }
};

// Get movies by status

const getMoviesByStatus = async (req, res) => {
  const userId = parseInt(req.query.id, 10); // Get userId from query parameters
  // Validate userId
  if (!userId) {
    return res
      .status(400)
      .json({ error: "userId is required and must be a valid number." });
  }

  try {
    // Fetch movie statuses
    const watching =
      (await MovieStatus.getMoviesByStatus(userId, "watching")) || [];
    const watched =
      (await MovieStatus.getMoviesByStatus(userId, "watched")) || [];
    const toWatch =
      (await MovieStatus.getMoviesByStatus(userId, "toWatch")) || [];

    // Send response
    res.json({
      watching,
      watched,
      toWatch,
    });
  } catch (error) {
    console.error(
      `Error while fetching movie statuses for userId: ${userId}`,
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

// Insert or update a movie status
const upsertMovieStatus = async (req, res) => {
  const { userId, movieId, status } = req.body;

  try {
    if (!userId || !movieId || !status) {
      return res
        .status(400)
        .json({ error: "userId, movieId, and status are required" });
    }

    const result = await MovieStatus.upsdateInsertStatus(
      userId,
      movieId,
      status
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMedia, getMoviesByStatus, upsertMovieStatus };
