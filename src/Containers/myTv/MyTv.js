import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { fetchDetails } from "../../Api/movieApi";
import AuthContext from "../../Context/AuthContext";
import "./myTv.css";

const MyTv = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [gallerySeries, setGallerySeries] = useState([]);
    const [activeCategory, setActiveCategory] = useState("To Watch");
    const [watchedSeries, setWatchedSeries] = useState([]);
    const [watchingSeries, setWatchingSeries] = useState([]);
    const [toWatchSeries, setToWatchSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { tvStat } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch movies based on IDs in tvStat
    const fetchSeriesByCategory = async (ids) => {
        try {
            const tvDetails = await Promise.all(
                ids.map((id) => fetchDetails("tv", id))
            );
            return tvDetails;
        } catch (error) {
            console.error("Error fetching movie details:", error);
            return [];
        }
    };

    // Fetch all movies when tvStat changes
    useEffect(() => {
        if (tvStat) {
            const fetchAllSeries = async () => {
                setLoading(true);
                const [watched, watching, toWatch] = await Promise.all([
                    fetchSeriesByCategory(tvStat.watched),
                    fetchSeriesByCategory(tvStat.watching),
                    fetchSeriesByCategory(tvStat.toWatch),
                ]);
                setWatchedSeries(watched);
                setWatchingSeries(watching);
                setToWatchSeries(toWatch);
                setGallerySeries(toWatch); // Default to "To Watch"
                setLoading(false);
            };

            fetchAllSeries();
        }
    }, [tvStat]);

    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        if (category === "To Watch") setGallerySeries(toWatchSeries);
        if (category === "Watching") setGallerySeries(watchingSeries);
        if (category === "Watched") setGallerySeries(watchedSeries);
    };

    return (
        <div>
            <div className="content__movie">
                <Navbar />
                <div className="movie-categories">
                    {["To Watch", "Watching", "Watched"].map((category) => (
                        <div
                            key={category}
                            className={
                                activeCategory === category
                                    ? "movie-categories_category-active"
                                    : "movie-categories_category"
                            }
                            onClick={() => handleCategoryChange(category)}
                        >
                            <p>{category}</p>
                            <div
                                className={
                                    activeCategory === category
                                        ? "category-line-active"
                                        : "category-line"
                                }
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="white-line"></div>

                <div className="movie-list">
                    {loading ? (
                        <p>Loading TV Series...</p>
                    ) : gallerySeries.length > 0 ? (
                        gallerySeries.map((movie) => (
                            <div
                                key={movie.id}
                                className="movie-list__movie"
                                onClick={() =>
                                    navigate(`/movieTrailer/${movie.id}`)
                                }
                            >
                                <img
                                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                    alt={movie.name}
                                />
                                <div className="movie-title">{movie.name}</div>
                                <div className="movie-info">
                                    <p>{movie.first_air_date}</p>
                                    <span>{movie.vote_average}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No movies in this category</p>
                    )}
                </div>
                <div className="white-line"></div>
            </div>
            <div className="movie-footer">
                <Footer />
            </div>
        </div>
    );
};

export default MyTv;
