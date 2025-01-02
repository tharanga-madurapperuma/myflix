import React, { useEffect, useState } from "react";
import "./Movies.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import { allGenreList, movieCategories, searchMovie } from "../requests";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";

const Movies = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [genreList, setGenreList] = useState();
    const [galleryMovies, setGalleryMovies] = useState();
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeGenres, setActiveGenres] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loadedCount, setLoadedCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoading(true);
            try {
                const request = await axios.get(allGenreList);
                setGenreList(request.data.genres);
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };

        const fetchGalleryMovies = async () => {
            try {
                const request = await axios.get(movieCategories[0].request);
                setGalleryMovies(request.data.results);
            } catch (error) {
                console.error("Error fetching initial movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenres();
        fetchGalleryMovies();
    }, []);

    useEffect(() => {
        const fetchMovieCategory = async () => {
            setIsLoading(true);
            setLoadedCount(0);
            try {
                const request = await axios.get(
                    movieCategories[activeCategory].request
                );
                setGalleryMovies(request.data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieCategory();
    }, [activeCategory]);

    useEffect(() => {
        if (activeGenres.length > 0) {
            const filteredMovies = galleryMovies?.filter((movie) =>
                activeGenres.every((genre) => movie.genre_ids.includes(genre))
            );
            setGalleryMovies(filteredMovies);
        } else {
            const fetchGalleryMovies = async () => {
                try {
                    const request = await axios.get(
                        movieCategories[activeCategory].request
                    );
                    setGalleryMovies(request.data.results);
                } catch (error) {
                    console.error("Error refetching movies:", error);
                }
            };
            fetchGalleryMovies();
        }
    }, [activeGenres]);

    const fetchMovie = async () => {
        setIsLoading(true);
        setLoadedCount(0);
        try {
            if (searchText.trim() === "") {
                const request = await axios.get(
                    movieCategories[activeCategory].request
                );
                setGalleryMovies(request.data.results);
            } else {
                const request = await axios.get(searchMovie(searchText));
                setGalleryMovies(request.data.results);
            }
        } catch (error) {
            console.error("Error searching for movies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const increaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedCount === galleryMovies?.length) {
            setIsLoading(false);
        }
    }, [loadedCount]);

    return (
        <div>
            {isLoading && <Loading />}
            <div className="content__movie">
                <Navbar />
                <div className="movie-categories">
                    {movieCategories.map((category) => (
                        <div
                            key={category.id}
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
                    ))}
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
                        {genreList?.map((genre) => (
                            <SwiperSlide className="genre-swiper-slide" key={genre.id}>
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
                        ))}
                    </Swiper>
                </div>
                <div className="movie-search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Movie"
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchMovie();
                            }
                        }}
                    />
                    <input
                        className="search-button"
                        type="submit"
                        value="Search"
                        onClick={fetchMovie}
                    />
                </div>
                <div className="movie-list">
                    {galleryMovies?.map((movie) => (
                        <div
                            className="movie-list__movie"
                            key={movie.id}
                            onClick={() => navigate(`/movieTrailer/${movie.id}`)}
                        >
                            <img
                                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                                alt={movie.title}
                                onLoad={increaseCount}
                                onError={increaseCount}
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

export default Movies;
