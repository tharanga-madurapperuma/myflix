const express = require("express");
const {authenticateToken} = require("../middleware/authMiddleware");
const { getMedia ,getMoviesByStatus,upsertMovieStatus} = require("../controllers/movieController");

const router = express.Router();

// Base route for Media
router.get("/", (req, res) => {
    res.send("Media Route");
});

// Route for fetching media data
router.get("/fetch", getMedia);

// Route to fetch movies by status by user ID
router.get("/moviestatus", getMoviesByStatus);

// Route to insert/update a movie status
router.post("/moviestatus", upsertMovieStatus);

module.exports = router;
