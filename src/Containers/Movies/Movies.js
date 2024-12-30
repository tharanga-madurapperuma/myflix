import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Movies.css";
import { allGenreList, movieCategories, searchMovie } from "../requests";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const Movies = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [genreList, setGenreList] = useState();
    const [galleryMovies, setGalleryMovies] = useState();
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeGenres, setActiveGenres] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            const request = await axios.get(allGenreList);
            setGenreList(request.data.genres);
        };

        const fetchGalleryMovies = async () => {
            const request = await axios.get(movieCategories[0].request);
            setGalleryMovies(request.data.results);
        };

        fetchGenres();
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

    useEffect(() => {
        if (activeGenres.length > 0) {
            const filteredMovies = galleryMovies.filter((movie) =>
                activeGenres.every((genre) => movie.genre_ids.includes(genre))
            );
            setGalleryMovies(filteredMovies);
        } else {
            const fetchGalleryMovies = async () => {
                const request = await axios.get(
                    movieCategories[activeCategory].request
                );
                setGalleryMovies(request.data.results);
            };
            fetchGalleryMovies();
        }
    }, [activeGenres]);

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
                    {movieCategories.map((category) => {
                        return (
                            <div
                                className={
                                    activeCategory === category?.id
                                        ? "movie-categories_category-active"
                                        : "movie-categories_category"
                                }
                                onClick={() => setActiveCategory(category.id)}
                            >
                                <p>{category.name}</p>
                                <div
                                    className={
                                        activeCategory === category?.id
                                            ? "category-line-active"
                                            : "category-line"
                                    }
                                ></div>
                            </div>
                        );
                    })}
                </div>
                <div className="white-line"></div>
                <div className="movie-genres">
                    <Swiper
                        className="genre-swiper"
                        loop={true}
                        centeredSlides={false}
                        slidesPerView={"auto"}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={3000}
                        modules={[Autoplay]}
                    >
                        {genreList &&
                            genreList.map((genre) => {
                                return (
                                    <SwiperSlide className="genre-swiper-slide">
                                        <div
                                            className={
                                                activeGenres.includes(genre.id)
                                                    ? "movie-genres_genre-active"
                                                    : "movie-genres_genre"
                                            }
                                            onClick={() => {
                                                activeGenres.includes(genre.id)
                                                    ? setActiveGenres(
                                                          activeGenres.filter(
                                                              (activeGenre) =>
                                                                  activeGenre !==
                                                                  genre.id
                                                          )
                                                      )
                                                    : setActiveGenres([
                                                          ...activeGenres,
                                                          genre.id,
                                                      ]);
                                            }}
                                        >
                                            <p>{genre.name}</p>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
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

export default Movies;
