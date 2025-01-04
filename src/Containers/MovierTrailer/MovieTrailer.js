import React, { useContext, useEffect, useState } from "react";
import "./MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import { fetchDetails, fetchReviews } from "../../Api/movieApi";
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";
import AuthContext from "../../Context/AuthContext";
import { upsertMovieStatus } from "../../Api/movieApi";

const MovieTrailer = () => {
    const id = window.location.pathname.split("/")[2];
    const { movieStat, user, refreshMovieStat } = useContext(AuthContext);

    const [movie, setMovie] = useState();
    const [loadedCount, setLoadedCount] = useState(0);
    const [reviews, setReviews] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonState, setButtonState] = useState({
        toWatch: false,
        watching: false,
        watched: false,
    });

    const [loadingButtons, setLoadingButtons] = useState({
        toWatch: false,
        watching: false,
        watched: false,
    });

    useEffect(() => {
        setIsLoading(true);

        const fetchMovie = async () => {
            try {
                const movieDetails = await fetchDetails("movie", id, true);
                setMovie(movieDetails);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        const fetchMovieReviews = async () => {
            try {
                const reviewsData = await fetchReviews("movie", id);
                setReviews(reviewsData.results);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchMovie();
        fetchMovieReviews();
    }, [id]);

    useEffect(() => {
        if (movieStat) {
            setButtonState({
                toWatch: movieStat.toWatch?.includes(parseInt(id)) || false,
                watching: movieStat.watching?.includes(parseInt(id)) || false,
                watched: movieStat.watched?.includes(parseInt(id)) || false,
            });
        }
    }, [movieStat, id]);

    const handleWatchStatus = async (status) => {
        if (!user) {
            alert("Please log in to update your watch status.");
            return;
        }
        try {
            setLoadingButtons((prev) => ({ ...prev, [status]: true }));
            await upsertMovieStatus(user.id, id, status);
            await refreshMovieStat();
        } catch (error) {
            console.error("Failed to update watch status:", error);
        } finally {
            setLoadingButtons((prev) => ({ ...prev, [status]: false }));
        }
    };

    useEffect(() => {
        if (loadedCount === movie?.videos.results.length) {
            setIsLoading(false);
        } else if (loadedCount === 5) {
            setIsLoading(false);
        }
    }, [loadedCount]);

    const increaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    return (
        <div>
            {isLoading && <Loading />}
            <Navbar />
            <div className="trailer-container">
                <div className="trailer-details">
                    <div className="trailer-details__image">
                        <img
                            src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
                            alt={movie?.title}
                        />
                    </div>
                    <div className="trailer-details__info">
                        <h1>{movie?.title}</h1>
                        <p>{movie?.overview}</p>
                    </div>
                </div>
                <div className="trailer-add-my-movies">
                    <button
                        onClick={() => handleWatchStatus("toWatch")}
                        style={
                            buttonState.toWatch
                                ? { backgroundColor: "green", color: "white" }
                                : null
                        }
                        disabled={buttonState.toWatch || loadingButtons.toWatch}
                    >
                        {loadingButtons.toWatch ? "Adding..." : "Add to Watch"}
                    </button>
                    <button
                        onClick={() => handleWatchStatus("watching")}
                        style={
                            buttonState.watching
                                ? { backgroundColor: "green", color: "white" }
                                : null
                        }
                        disabled={
                            buttonState.watching || loadingButtons.watching
                        }
                    >
                        {loadingButtons.watching
                            ? "Adding..."
                            : "Add to Watching"}
                    </button>
                    <button
                        onClick={() => handleWatchStatus("watched")}
                        style={
                            buttonState.watched
                                ? { backgroundColor: "green", color: "white" }
                                : null
                        }
                        disabled={buttonState.watched || loadingButtons.watched}
                    >
                        {loadingButtons.watched
                            ? "Adding..."
                            : "Add to Watched"}
                    </button>
                </div>
                <div className="container-outer">
                    <div
                        className={
                            movie?.videos.results.length == 0
                                ? "trailer-empty"
                                : movie?.videos.results.length > 2
                                ? "container-video"
                                : "container-video-less-two"
                        }
                    >
                        {movie?.videos.results.map((video, index) =>
                            index < 5 ? (
                                <div className="trailer" key={video.key}>
                                    <iframe
                                        width="700px"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video?.key}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onLoad={increaseCount}
                                        onError={increaseCount}
                                    ></iframe>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
                <div className="container-reviews">
                    {reviews?.length === 0 ? <h1>No reviews</h1> : null}
                    {reviews?.map((review) => (
                        <div className="review" key={review.id}>
                            <h3>{review.author}</h3>
                            <p>{review.content}</p>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MovieTrailer;
