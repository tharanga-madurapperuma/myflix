import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Movies.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import {
  fetchAllMovieGenres,
  fetchItemsByCategory,
  searchMedia,
} from "../../Api/movieApi";

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

  const movieCategories = [
    "trending",
    "now_playing",
    "top_rated",
    "popular",
    "upcoming",
  ];
  const movieCategoriesName = [
    "Trending",
    "Now Playing",
    "Top Rated",
    "Popular",
    "Upcoming",
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true);
      const request = await fetchAllMovieGenres();
      setGenreList(request.genres);
    };

    const fetchGalleryMovies = async () => {
      const request = await fetchItemsByCategory("trending","movie/week");
      console.log(request);
      setGalleryMovies(request.results);
    };

    fetchGenres();
    fetchGalleryMovies();
  }, []);

  useEffect(() => {
    const fetchMovieCategory = async () => {
      setIsLoading(true);
      setLoadedCount(0);
      try {
        const request = await fetchItemsByCategory(
            activeCategory === 0 ? "trending" : "movie",
            activeCategory === 0 ? "movie/week" : movieCategories[activeCategory]
        );
        setGalleryMovies(request.results);
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
      const filteredMovies = galleryMovies.filter((movie) =>
        activeGenres.every((genre) => movie.genre_ids.includes(genre))
      );
      setGalleryMovies(filteredMovies);
    } else {
      const fetchGalleryMovies = async () => {
        const request = await fetchItemsByCategory(
            activeCategory === 0 ? "trending" : "movie",
            activeCategory === 0 ? "movie/week" : movieCategories[activeCategory]
        );
        setGalleryMovies(request.results);
      };
      fetchGalleryMovies();
    }
  }, [activeGenres]);

  const fetchMovie = async () => {
    setIsLoading(true);
    setLoadedCount(0);
    const request = await searchMedia("movie", searchText);
    if (searchText === "") {
      const getMovies = async () => {
        const request = await fetchItemsByCategory(
            activeCategory === 0 ? "trending" : "movie",
            activeCategory === 0 ? "movie/week" : movieCategories[activeCategory]
        );
        setGalleryMovies(request.results);
      };
      getMovies();
    } else {
      setGalleryMovies(request.results);
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
          {movieCategoriesName.map((category, index) => {
            return (
              <div
                className={
                  activeCategory === index
                    ? "movie-categories_category-active"
                    : "movie-categories_category"
                }
                onClick={() => setActiveCategory(index)}
              >
                <p>{category}</p>
                <div
                  className={
                    activeCategory === index
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
                                (activeGenre) => activeGenre !== genre.id
                              )
                            )
                          : setActiveGenres([...activeGenres, genre.id]);
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
                    onLoad={increaseCount}
                    onError={increaseCount}
                  />
                  <div className="movie-title">{movie.title}</div>
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
