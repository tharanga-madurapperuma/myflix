const axios = require("axios");
const MovieStatus = require("../Model/movieModel");
const BASE_URL = process.env.BASE_URL; // Replace with actual base URL
const API_KEY = process.env.API_KEY; // Replace with actual API key

// Movie Controller Get movies
const getMedia = async (req, res) => {
    const { type, category, id, action, query, append } = req.query;

    // Build URL based on query parameters
    let url;
    if (action === "details") {
        url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en${append ? `&append_to_response=${append}` : ""}`;
    } else if (action === "reviews") {
        url = `${BASE_URL}/${type}/${id}/reviews?api_key=${API_KEY}&language=en-US&page=1`;
    } else if (action === "search") {
        url = `${BASE_URL}/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}`;
    } else {
        url = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&language=en-US`;
    }

    console.log(url);``
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
  const userId = parseInt(req.body.userId, 10);

  try {
    const watching = await MovieStatus.getMoviesByStatus(userId, 'watching');
    const watched = await MovieStatus.getMoviesByStatus(userId, 'watched');
    const toWatch = await MovieStatus.getMoviesByStatus(userId, 'to watch');

    res.json({
      watching,
      watched,
      toWatch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Insert or update a movie status
const upsertMovieStatus = async (req, res) => {
    const { userId, movieId, status } = req.body;
  
    try {
      if (!userId || !movieId || !status) {
        return res.status(400).json({ error: "userId, movieId, and status are required" });
      }
      console.log(userId, movieId, status+"controller");
      const result = await MovieStatus.upsdateInsertStatus(userId, movieId, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { getMedia, getMoviesByStatus,upsertMovieStatus };
