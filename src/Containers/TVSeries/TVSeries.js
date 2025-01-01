import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./TVSeries.css";
import { allGenreListTV, searchSeries, TVCategories } from "../requests";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";

const TVSeries = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [genreList, setGenreList] = useState();
    const [galleryTVSeries, setGalleryTVSeries] = useState();
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeGenres, setActiveGenres] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setLoadedCount(0);
        const fetchGenres = async () => {
            const request = await axios.get(allGenreListTV);
            setGenreList(request.data.genres);
        };

        const fetchGalleryTVSeries = async () => {
            const request = await axios.get(TVCategories[0].request);
            setGalleryTVSeries(request.data.results);
        };

        fetchGenres();
        fetchGalleryTVSeries();
    }, []);

    useEffect(() => {
        const fetchTVSeriesCategory = async (category) => {
            setIsLoading(true);
            setLoadedCount(0);
            try {
                const request = await axios.get(
                    TVCategories[activeCategory].request
                );
                setGalleryTVSeries(request.data.results);
            } catch (error) {
                console.error("Error fetching TV series:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTVSeriesCategory();
    }, [activeCategory]);

    useEffect(() => {
        if (activeGenres.length > 0) {
            const filteredTVSeries = galleryTVSeries.filter((tvSeries) =>
                activeGenres.every((genre) =>
                    tvSeries.genre_ids.includes(genre)
                )
            );
            setGalleryTVSeries(filteredTVSeries);
        } else {
            const fetchGalleryTVSeries = async () => {
                const request = await axios.get(
                    TVCategories[activeCategory].request
                );
                setGalleryTVSeries(request.data.results);
            };
            fetchGalleryTVSeries();
        }
    }, [activeGenres]);

    const fetchSeries = async () => {
        setIsLoading(true);
        setLoadedCount(0);
        const request = await axios.get(searchSeries(searchText));
        if (searchText === "") {
            const getSeries = async () => {
                const request = await axios.get(
                    TVCategories[activeCategory].request
                );
                setGalleryTVSeries(request.data.results);
            };
            getSeries();
        } else {
            setGalleryTVSeries(request.data.results);
        }
    };

    const increaseCount = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    useEffect(() => {
        if (loadedCount === galleryTVSeries?.length) {
            setIsLoading(false);
        }
    }, [loadedCount]);

    return (
        <div>
            {isLoading && <Loading />}
            <div className="content__tvSeries">
                <Navbar />
                <div className="tvSeries-categories">
                    {TVCategories.map((category) => {
                        return (
                            <div
                                className={
                                    activeCategory === category?.id
                                        ? "tvSeries-categories_category-active"
                                        : "tvSeries-categories_category"
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
                <div className="tvSeries-genres">
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
                                                    ? "tvSeries-genres_genre-active"
                                                    : "tvSeries-genres_genre"
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
                <div className="tvSeries-search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search TV Series"
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchSeries();
                            }
                        }}
                    />
                    <input
                        className="search-button"
                        type="submit"
                        value="Search"
                        onClick={fetchSeries}
                    />
                </div>
                <div className="tvSeries-list">
                    {galleryTVSeries &&
                        galleryTVSeries.map((tvSeries) => {
                            return (
                                <div
                                    className="tvSeries-list__tvSeries"
                                    onClick={() => {
                                        navigate(
                                            `/seriesTrailer/${tvSeries.id}`
                                        );
                                    }}
                                >
                                    <img
                                        src={`${IMAGE_BASE_URL}${tvSeries.poster_path}`}
                                        alt={tvSeries.name}
                                        onLoad={increaseCount}
                                        onError={increaseCount}
                                    />
                                    <div className="tvSeries-title">
                                        {tvSeries.name}
                                    </div>
                                    <div className="tvSeries-info">
                                        <p>{tvSeries.first_air_date}</p>
                                        <span>{tvSeries.vote_average}</span>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="white-line"></div>
            </div>
            <div className="tvSeries-footer">
                <Footer />
            </div>
        </div>
    );
};

export default TVSeries;
