const express = require("express");
const {authenticateToken} = require("../middleware/authMiddleware");
const { getTvSeriesByStatus,upsertTvSeriesStatus} = require("../controllers/tvSeriesController");
const router = express.Router();

// Base route for Media
router.get("/", (req, res) => {
    res.send("Media Route");
});


// Route to fetch movies by status by user ID
router.get("/tvstatus", getTvSeriesByStatus);

// Route to insert/update a movie status
router.post("/tvstatus", upsertTvSeriesStatus);

module.exports = router;