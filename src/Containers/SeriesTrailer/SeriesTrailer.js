import React, { useEffect, useState } from "react";
import "../MovierTrailer/MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import { fetchDetails, fetchReviews } from "../../Api/movieApi"; // Import functions from movieApi.js
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";

const SeriesTrailer = () => {
    const id = window.location.pathname.split("/")[2]; // Extract series ID from the URL
    const [series, setSeries] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        const fetchSeriesData = async () => {
            setIsLoading(true);
            setLoadedCount(0);
            try {
                // Fetch series details
                const seriesResponse = await fetchDetails("tv", id);
                setSeries(seriesResponse);

                // Fetch reviews
                const reviewsResponse = await fetchReviews("tv", id);
                setReviews(reviewsResponse.results || []);
            } catch (error) {
                console.error("Error fetching series data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSeriesData();
    }, [id]);

    const increaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (series?.videos?.results?.length > 0 && loadedCount === series.videos.results.length) {
            setIsLoading(false);
        }
    }, [loadedCount, series]);

    return (
        <div>
            {isLoading && <Loading />}
            <Navbar />
            <div className="trailer-container">
                {series && (
                    <div className="trailer-details">
                        <div className="trailer-details__image">
                            <img
                                src={`https://image.tmdb.org/t/p/original/${series.poster_path}`}
                                alt={series.name || "Series Poster"}
                            />
                        </div>
                        <div className="trailer-details__info">
                            <h1 className="trailer-details__title">{series.name}</h1>
                            <p className="trailer-details__overview">{series.overview}</p>
                        </div>
                    </div>
                )}

                <div className="trailer-add-my-movies">
                    <button>Add to Watch</button>
                    <button>Add to Watching</button>
                    <button>Add to Watched</button>
                </div>

                <div className="container-outer">
                    {series?.videos?.results?.length > 0 ? (
                        <div
                            className={
                                series.videos.results.length > 2
                                    ? "container-video"
                                    : "container-video-less-two"
                            }
                        >
                            {series.videos.results.map((video) => (
                                <div className="trailer" key={video.id}>
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video.key}`}
                                        title={video.name || "Trailer"}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onLoad={increaseCount}
                                        onError={increaseCount}
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h2 className="trailer-empty">No trailers available</h2>
                    )}
                </div>

                <div className="container-reviews">
                    {reviews.length === 0 ? (
                        <h2>No reviews available</h2>
                    ) : (
                        reviews.map((review) => (
                            <div className="review" key={review.id}>
                                <h3>{review.author}</h3>
                                <p>{review.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SeriesTrailer;
