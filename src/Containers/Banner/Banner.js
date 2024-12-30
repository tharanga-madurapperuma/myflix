import React, { useEffect, useState } from "react";
import "./Banner.css";
import { adventure, requestUniqueMovie } from "../requests";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Banner = () => {
    const [movie, setMovie] = useState("");
    const [uniqueMovie, setUniqueMovie] = useState("");

    useEffect(() => {
        async function fetchData() {
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
            }
        }
        fetchData();
    }, []);
    

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
                    {uniqueMovie.genres?.map((genre,index) => (
                        <span key={index}> | {genre.name}</span>
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
