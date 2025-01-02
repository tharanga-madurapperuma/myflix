import React, { useEffect, useState } from "react";
import "./MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import { fetchDetails, fetchReviews } from '../../Api/movieApi';
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";

const MovieTrailer = () => {
    const id = window.location.pathname.split("/")[2];
    const [movie, setMovie] = useState();
    const [reviews, setReviews] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        setLoadedCount(0);

        const fetchMovie = async () => {
            try {
                const movieDetails = await fetchDetails('movie', id);
                console.log(movieDetails);
                setMovie(movieDetails);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const getReviews = async () => {
            try {
                const reviewsData = await fetchReviews('movie', id);
                setReviews(reviewsData.results);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchMovie();
        getReviews();
    }, [id]);

    useEffect(() => {
        if (loadedCount === movie?.videos?.results?.length) {
            setIsLoading(false);
        }
    }, [loadedCount, movie]);

    const increaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    return (
        <div>
            {isLoading && <Loading />}
            <Navbar />
            <div className="trailer-container">
                <div
                    className="trailer-details"
                    onLoad={() => {
                        if (movie?.videos?.results?.length > 0) {
                            setIsLoading(true);
                        }
                    }}
                >
                    <div className="trailer-details__image">
                        <img
                            src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
                            alt=""
                        />
                    </div>
                    <div className="trailer-details__info">
                        <div className="trailer-details__title">
                            <h1>{movie?.title}</h1>
                        </div>
                        <div className="trailer-details__overview">
                            <p>{movie?.overview}</p>
                        </div>
                    </div>
                </div>
                <div className="trailer-add-my-movies">
                    <button>Add to Watch</button>
                    <button>Add to Watching</button>
                    <button>Add to Watched</button>
                </div>
                <div className="container-outer">
                    <div
                        className={
                            movie?.videos?.results?.length === 0
                                ? "trailer-empty"
                                : movie?.videos?.results?.length > 2
                                ? "container-video"
                                : "container-video-less-two"
                        }
                    >
                        {movie?.videos?.results.map((video) => (
                            <div className="trailer" key={video?.key}>
                                <iframe
                                    width="700px"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video?.key}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={increaseCount}
                                    onError={increaseCount}
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container-reviews">
                    {reviews?.length === 0 ? <h1>No reviews</h1> : null}
                    {reviews?.map((review) => (
                        <div className="review" key={review?.id}>
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
