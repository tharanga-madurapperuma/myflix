process.env.NODE_OPTIONS = "--dns-result-order=ipv4first";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

//Test For Api
app.route("/").get((req, res) => {
    res.send("Movie App API");
});

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/movie",movieRoutes);

const PORT = process.env.PORT || 5000;

//Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Database Connection Check

const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Database connected at:", res.rows[0].now);
    }
});
