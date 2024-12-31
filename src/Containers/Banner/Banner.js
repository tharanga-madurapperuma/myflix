import React, { useEffect, useState } from "react";
import "./Banner.css";
import { adventure, requestUniqueMovie } from "../requests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";

const Banner = () => {
    const [movie, setMovie] = useState("");
    const [uniqueMovie, setUniqueMovie] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const request = await axios.get(adventure);
                const fetchedMovie =
                    request.data.results[
                        Math.floor(Math.random() * request.data.results.length)
                    ];

                // Make sure the fetched movie has a valid id before making the second request
                if (fetchedMovie?.id) {
                    setMovie(fetchedMovie);
                    const uniqueRequest = await axios.get(
                        requestUniqueMovie(fetchedMovie.id)
                    );
                    setUniqueMovie(uniqueRequest?.data);
                } else {
                    console.error("Movie ID is undefined or invalid");
                }
            } catch (error) {
                console.error("Error fetching movie data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="banner__wrapper">
            {isLoading && <Loading />}
            <div
                className="banner__background"
                style={{
                    backgroundSize: "cover",
                    backgroundImage: `url(
              "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
            )`,
                    backgroundPosition: "center center",
                }}
            />

            <div className="banner__leftGradient" />
            <div className="banner__topGradient" />
            <div className="banner__bottomGradient" />

            <div className="banner__content">
                <h3>{movie?.vote_average}</h3>
                <h4>Duration: {uniqueMovie.runtime} min</h4>
                <h5>
                    {uniqueMovie.genres?.map((genre, index) => (
                        <span key={index}> | {genre.name}</span>
                    ))}
                </h5>
                <h2>{movie?.title}</h2>
                <p>{movie?.overview}</p>

                <div className="banner__content-buttons">
                    <button
                        className="banner__content-buttons_watchButton buttons"
                        onClick={() => {
                            navigate(`/movieTrailer/${movie.id}`);
                        }}
                    >
                        <FontAwesomeIcon className="icon" icon={faPlay} />
                        WATCH
                    </button>
                    <button className="banner__content-buttons_addListButton buttons">
                        <FontAwesomeIcon className="icon" icon={faPlus} />
                        ADD LIST
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
