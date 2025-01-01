const pool = require("../config/db");

const MovieStatus = {
  // Fetch movies by user ID and status
  getMoviesByStatus: async (userId, status) => {
    console.log(userId, status);
    try {
      const query = `
        SELECT movie_id 
        FROM moviestatus 
        WHERE user_id = $1 AND status = $2;
      `;
      const { rows } = await pool.query(query, [userId, status]);
      return rows.map(row => row.movie_id);
    } catch (error) {
      console.error(`Error fetching movies for userId: ${userId} and status: ${status}`, error);
      throw new Error("Failed to fetch movies from the database. Please try again later.");
    }
  },

  // Insert or update movie status
  upsdateInsertStatus: async (userId, movieId, status) => {
    console.log(userId, movieId, status);
    try {
      const query = `
        INSERT INTO moviestatus (user_id, movie_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, movie_id) 
        DO UPDATE SET status = $3;
      `;
      await pool.query(query, [userId, movieId, status]);
      return { success: true, message: "Movie status updated successfully" };
    } catch (error) {
      console.error(`Error updating movie status for userId: ${userId}, movieId: ${movieId}`, error);
      throw new Error("Failed to update movie status. Please try again later.");
    }
  },
};

module.exports = MovieStatus;
