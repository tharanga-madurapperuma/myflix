import React, { useEffect, useState } from "react";
import "./Banner.css";
import { requests, requestUniqueMovie } from "../requests";
import axios from "../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";

const Banner = () => {
    const [movie, setMovie] = useState("");
    const [uniqueMovie, setUniqueMovie] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchAdventure);
            const fetchedMovie =
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ];
            setMovie(fetchedMovie);
            const uniqueRequest = await axios.get(
                requestUniqueMovie(fetchedMovie.id)
            );
            setUniqueMovie(uniqueRequest.data);
        }
        fetchData();
    }, []);

    //console.log(movie);
    console.log(uniqueMovie);

    return (
        <div className="banner__wrapper">
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
                    {uniqueMovie.genres?.map((genre) => (
                        <span> | {genre.name}</span>
                    ))}
                </h5>
                <h2>{movie?.title}</h2>
                <p>{movie?.overview}</p>

                <div className="banner__content-buttons">
                    <button className="banner__content-buttons_watchButton buttons">
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
