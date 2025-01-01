const pool = require("../../src/config/db");
const MovieStatus = require("../../src/Model/movieModel");

jest.mock("../../src/config/db"); // Mock the database module

beforeAll(async () => {
  
    try {
      await pool.query("SELECT NOW()");
      console.log("Database connected successfully");
    } catch (err) {
      console.error("Error connecting to the database:", err.message);
      throw new Error("Failed to connect to the database");
    }
  });
  
  afterAll(async () => {
    try {
      await pool.end();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing the database connection:", err.message);
    }
  });

describe("MovieStatus Model", () => {
  describe("getMoviesByStatus", () => {
    it("should return a list of movie IDs for a given user and status", async () => {
      // Arrange
      const userId = 1;
      const status = "watched";
      const mockRows = [{ movie_id: 101 }, { movie_id: 102 }];
      pool.query.mockResolvedValueOnce({ rows: mockRows });

      // Act
      const result = await MovieStatus.getMoviesByStatus(userId, status);

      // Assert
      expect(result).toEqual([101, 102]);
      expect(pool.query).toHaveBeenCalledWith(
        `
        SELECT movie_id 
        FROM moviestatus 
        WHERE user_id = $1 AND status = $2;
      `,
        [userId, status]
      );
    });

    it("should throw an error if the query fails", async () => {
      // Arrange
      const userId = 1;
      const status = "watched";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act & Assert
      await expect(MovieStatus.getMoviesByStatus(userId, status)).rejects.toThrow(
        "Failed to fetch movies from the database. Please try again later."
      );
    });
  });

  describe("upsdateInsertStatus", () => {
    it("should insert or update a movie's status for a user", async () => {
      // Arrange
      const userId = 1;
      const movieId = 101;
      const status = "watched";

      pool.query.mockResolvedValueOnce({});

      // Act
      const result = await MovieStatus.upsdateInsertStatus(userId, movieId, status);

      // Assert
      expect(result).toEqual({ success: true, message: "Movie status updated successfully" });
      expect(pool.query).toHaveBeenCalledWith(
        `
        INSERT INTO moviestatus (user_id, movie_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, movie_id) 
        DO UPDATE SET status = $3;
      `,
        [userId, movieId, status]
      );
    });

    it("should throw an error if the query fails", async () => {
      // Arrange
      const userId = 1;
      const movieId = 101;
      const status = "watched";
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Act & Assert
      await expect(MovieStatus.upsdateInsertStatus(userId, movieId, status)).rejects.toThrow(
        "Failed to update movie status. Please try again later."
      );
    });
  });
});
