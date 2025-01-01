import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { movieCategories, searchMovie } from "../requests";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import "./myMovies.css";

const MyMovies = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [galleryMovies, setGalleryMovies] = useState();
    const [activeCategory, setActiveCategory] = useState("Watch");
    const [searchText, setSearchText] = useState("");
    const myCategories = ["Watch", "Watching", "Watched"];
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGalleryMovies = async () => {
            const request = await axios.get(movieCategories[0].request);
            setGalleryMovies(request.data.results);
        };

        fetchGalleryMovies();
    }, []);

    useEffect(() => {
        const fetchMovieCategory = async (category) => {
            const request = await axios.get(movieCategories[category].request);
            setGalleryMovies(request.data.results);
        };

        for (let i = 0; i < 5; i++) {
            if (activeCategory === i) {
                fetchMovieCategory(i);
            }
        }
    }, [activeCategory]);

    const fetchMovie = async () => {
        const request = await axios.get(searchMovie(searchText));
        if (searchText === "") {
            const getMovies = async () => {
                const request = await axios.get(
                    movieCategories[activeCategory].request
                );
                setGalleryMovies(request.data.results);
            };
            getMovies();
        } else {
            setGalleryMovies(request.data.results);
        }
    };

    return (
        <div>
            <div className="content__movie">
                <Navbar />
                <div className="movie-categories">
                    {myCategories.map((category) => {
                        return (
                            <div
                                className={
                                    activeCategory === category
                                        ? "movie-categories_category-active"
                                        : "movie-categories_category"
                                }
                                onClick={() => setActiveCategory(category)}
                            >
                                <p>{category}</p>
                                <div
                                    className={
                                        activeCategory === category
                                            ? "category-line-active"
                                            : "category-line"
                                    }
                                ></div>
                            </div>
                        );
                    })}
                </div>
                <div className="white-line"></div>
                <div className="movie-search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Movie"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <input
                        className="search-button"
                        type="submit"
                        value="Search"
                        onClick={fetchMovie}
                    />
                </div>
                <div className="movie-list">
                    {galleryMovies &&
                        galleryMovies.map((movie) => {
                            return (
                                <div
                                    className="movie-list__movie"
                                    onClick={() => {
                                        navigate(`/movieTrailer/${movie.id}`);
                                    }}
                                >
                                    <img
                                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <div className="movie-title">
                                        {movie.title}
                                    </div>
                                    <div className="movie-info">
                                        <p>{movie.release_date}</p>
                                        <span>{movie.vote_average}</span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="white-line"></div>
            </div>
            <div className="movie-footer">
                <Footer />
            </div>
        </div>
    );
};

export default MyMovies;
