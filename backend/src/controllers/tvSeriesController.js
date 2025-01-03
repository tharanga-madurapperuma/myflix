const MovieStatus = require("../Model/movieModel");

// Get movies by status

const getTvSeriesByStatus = async (req, res) => {
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
        (await MovieStatus.getTvByStatus(userId, "watching")) || [];
      const watched =
        (await MovieStatus.getTvByStatus(userId, "watched")) || [];
      const toWatch =
        (await MovieStatus.getTvByStatus(userId, "toWatch")) || [];
  
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
  const upsertTvSeriesStatus = async (req, res) => {
    const { userId, seriesId, status } = req.body;
  
    try {
      if (!userId || !seriesId || !status) {
        return res
          .status(400)
          .json({ error: "userId, movieId, and status are required" });
      }
  
      const result = await MovieStatus.upsdateInsertTVStatus(
        userId,
        seriesId,
        status
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = { getTvSeriesByStatus, upsertTvSeriesStatus };