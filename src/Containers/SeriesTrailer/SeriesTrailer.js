import React, { useEffect, useState } from "react";
import "../MovierTrailer/MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import { seriesReviews, requestMoreSeriesDetails } from "../requests";
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";

const SeriesTrailer = () => {
    const id = window.location.pathname.split("/")[2];
    const [series, setSeries] = useState();
    const [reviews, setReviews] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        setLoadedCount(0);
        try {
        } catch (error) {
            console.error("Error fetching series data:", error);
        } finally {
            setIsLoading(false);
        }
        const fetchSeries = async () => {
            const response = await axios.get(requestMoreSeriesDetails(id));
            setSeries(response.data);
        };

        const getReviews = async () => {
            const response = await axios.get(seriesReviews(id));
            setReviews(response.data.results);
        };

        fetchSeries();
        getReviews();
    }, []);

    const inceaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedCount === series?.videos.results.length) {
            setIsLoading(false);
        }
    }, [loadedCount]);

    return (
        <div>
            {isLoading && <Loading />}
            <Navbar />
            <div className="trailer-container">
                <div
                    className="trailer-details"
                    onLoad={() => {
                        if (series?.videos.results.length >= 0) {
                            setIsLoading(true);
                        }
                    }}
                >
                    <div className="trailer-details__image">
                        <img
                            src={`https://image.tmdb.org/t/p/original/${series?.poster_path}`}
                            alt=""
                        />
                    </div>
                    <div className="trailer-details__info">
                        <div className="trailer-details__title">
                            <h1>{series?.title}</h1>
                        </div>
                        <div className="trailer-details__overview">
                            <p>{series?.overview}</p>
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
                            series?.videos.results.length == 0
                                ? "trailer-empty"
                                : series?.videos.results.length > 2
                                ? "container-video"
                                : "container-video-less-two"
                        }
                        onLoad={() => {
                            if (series?.videos.results.length >= 0) {
                                setIsLoading(true);
                            }
                        }}
                    >
                        {series?.videos.results.map((video) => (
                            <div className="trailer">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${video?.key}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onLoad={inceaseCount}
                                    onError={inceaseCount}
                                ></iframe>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container-reviews">
                    {reviews?.length == 0 ? <h1>No reviews</h1> : null}
                    {reviews?.map((review) => (
                        <div className="review">
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

export default SeriesTrailer;
