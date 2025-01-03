import React, { useContext, useEffect, useState } from "react";
import "../../Containers/MovierTrailer/MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import { fetchDetails, fetchReviews, upsertTVStatus } from "../../Api/movieApi";
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";
import AuthContext from "../../Context/AuthContext";

const SeriesTrailer = () => {
    const id = window.location.pathname.split("/")[2]; // Extract series ID from the URL
    const { tvStat, user, refreshTvStat } = useContext(AuthContext);

    const [series, setSeries] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedCount, setLoadedCount] = useState(0);
    const [buttonState, setButtonState] = useState({
        toWatch: false,
        watching: false,
        watched: false,
    });
    const [loadingState, setLoadingState] = useState({
        toWatchLoading: false,
        watchingLoading: false,
        watchedLoading: false,
    });

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

    useEffect(() => {
        if (tvStat) {
            setButtonState({
                toWatch: tvStat.toWatch?.includes(parseInt(id)) || false,
                watching: tvStat.watching?.includes(parseInt(id)) || false,
                watched: tvStat.watched?.includes(parseInt(id)) || false,
            });
        }
    }, [tvStat, id]);

    const handleWatchStatus = async (status) => {
        if (!user) {
            alert("Please log in to update your watch status.");
            return;
        }
        try {
            // Set loading state
            setLoadingState((prev) => ({ ...prev, [`${status}Loading`]: true }));

            await upsertTVStatus(user.id, id, status);
            await refreshTvStat();

            // Update button state after successful update
            setButtonState((prev) => ({
                ...prev,
                toWatch: status === "toWatch" ? true : prev.toWatch,
                watching: status === "watching" ? true : prev.watching,
                watched: status === "watched" ? true : prev.watched,
            }));
        } catch (error) {
            console.error("Failed to update watch status:", error);
        } finally {
            // Reset loading state
            setLoadingState((prev) => ({ ...prev, [`${status}Loading`]: false }));
        }
    };

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
                    <button
                        onClick={() => handleWatchStatus("toWatch")}
                        style={buttonState.toWatch ? { backgroundColor: "green",color:"white" } : null}
                        disabled={buttonState.toWatch || loadingState.toWatchLoading}
                    >
                        {loadingState.toWatchLoading ? "Loading..." : "Add to Watch"}
                    </button>
                    <button
                        onClick={() => handleWatchStatus("watching")}
                        style={buttonState.watching ? { backgroundColor: "green",color:"white" } : null}
                        disabled={buttonState.watching || loadingState.watchingLoading}
                    >
                        {loadingState.watchingLoading ? "Loading..." : "Add to Watching"}
                    </button>
                    <button
                        onClick={() => handleWatchStatus("watched")}
                        style={buttonState.watched ? { backgroundColor: "green",color:"white" } : null}
                        disabled={buttonState.watched || loadingState.watchedLoading}
                    >
                        {loadingState.watchedLoading ? "Loading..." : "Add to Watched"}
                    </button>
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
