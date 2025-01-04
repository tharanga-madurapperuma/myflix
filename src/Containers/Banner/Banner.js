import React, { useContext, useEffect, useState } from "react";
import "./Banner.css";
import {
    fetchAdventureMovies,
    fetchDetails,
    upsertMovieStatus,
} from "./../../Api/movieApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import AuthContext from "../../Context/AuthContext";

const Banner = () => {
    const [movie, setMovie] = useState("");
    const [uniqueMovie, setUniqueMovie] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [buttonState, setButtonState] = useState(false);
    const { movieStat, user, refreshMovieStat } = useContext(AuthContext);
    const [loadingButton, setLoadingButton] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const adventureMovies = await fetchAdventureMovies();
                console.log(adventureMovies);
                const fetchedMovie =
                    adventureMovies.results[
                        Math.floor(
                            Math.random() * adventureMovies.results.length
                        )
                    ];

                // Make sure the fetched movie has a valid id before making the second request
                if (fetchedMovie?.id) {
                    setMovie(fetchedMovie);
                    const uniqueMovieDetails = await fetchDetails(
                        "movie",
                        fetchedMovie.id
                    );
                    setUniqueMovie(uniqueMovieDetails);
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

    const handleWatchStatus = async (status) => {
        if (!user) {
            alert("Please log in to update your watch status.");
            return;
        }
        try {
            setLoadingButton(true);
            await upsertMovieStatus(user.id, movie.id, status);
            await refreshMovieStat();
        } catch (error) {
            console.error("Failed to update watch status:", error);
        } finally {
            setLoadingButton(false);
        }
    };

    useEffect(() => {
        if (movieStat) {
            setButtonState(
                movieStat.toWatch?.includes(parseInt(movie.id)) || false
            );
        }
    }, [movieStat, movie.id]);

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
                    <button
                        style={
                            buttonState
                                ? {
                                      backgroundColor: "#151515",
                                      color: "white",
                                      padding: "20px 50px",
                                  }
                                : null
                        }
                        onClick={() => {
                            handleWatchStatus("toWatch");
                        }}
                        className="banner__content-buttons_addListButton buttons"
                        disabled={buttonState || loadingButton}
                    >
                        {!buttonState && (
                            <FontAwesomeIcon className="icon" icon={faPlus} />
                        )}
                        {loadingButton
                            ? "Adding..."
                            : buttonState
                            ? "ADDED"
                            : "ADD TO WATCH LIST"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;
