import React, { useEffect, useState } from "react";
import "../MovierTrailer/MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";
import axios from "axios";
import { seriesReviews, requestMoreSeriesDetails } from "../requests";
import Footer from "../Footer/Footer";

const SeriesTrailer = () => {
    const id = window.location.pathname.split("/")[2];
    const [series, setSeries] = useState();
    const [reviews, setReviews] = useState();

    useEffect(() => {
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
    console.log(series);
    console.log(reviews);
    return (
        <div>
            <Navbar />
            <div className="trailer-container">
                <div className="trailer-details">
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
                <div
                    className={
                        series?.videos.results.length == 0
                            ? "trailer-empty"
                            : "container-video"
                    }
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
                            ></iframe>
                        </div>
                    ))}
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
