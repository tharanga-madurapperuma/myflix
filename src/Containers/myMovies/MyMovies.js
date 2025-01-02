import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import { movieCategories, searchMovie } from "../requests";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./myMovies.css";

const MyMovies = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [galleryMovies, setGalleryMovies] = useState([]);
    const [activeCategory, setActiveCategory] = useState("Watch");
    const [searchText, setSearchText] = useState("");
    const myCategories = ["Watch", "Watching", "Watched"];
    const navigate = useNavigate();

    const fetchMovies = async (url) => {
        try {
            const { data } = await axios.get(url);
            setGalleryMovies(data.results);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        const category = movieCategories.find(
            (cat) => cat.name === activeCategory
        );
        if (category) {
            fetchMovies(category.request);
        }
    }, [activeCategory]);

    const handleSearch = async () => {
        if (searchText.trim() === "") {
            const category = movieCategories.find(
                (cat) => cat.name === activeCategory
            );
            if (category) {
                fetchMovies(category.request);
            }
        } else {
            fetchMovies(searchMovie(searchText));
        }
    };

    return (
        <div>
            <div className="content__movie">
                <Navbar />
                <div className="movie-categories">
                    {myCategories.map((category) => (
                        <div
                            key={category}
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
                    ))}
                </div>
                <div className="white-line"></div>
                <div className="movie-search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Movie"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <button
                        className="search-button"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
                <div className="movie-list">
                    {galleryMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-list__movie"
                            onClick={() => navigate(`/movieTrailer/${movie.id}`)}
                        >
                            <img
                                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <div className="movie-title">{movie.title}</div>
                            <div className="movie-info">
                                <p>{movie.release_date}</p>
                                <span>{movie.vote_average}</span>
                            </div>
                        </div>
                    ))}
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
