import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./TVSeries.css";
import { allGenreListTV, TVCategories } from "../requests";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const TVSeries = ({ name }) => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [genreList, setGenreList] = useState();
    const [galleryTVSeries, setGalleryTVSeries] = useState();
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeGenres, setActiveGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
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
    console.log(galleryTVSeries);
    useEffect(() => {
        const fetchTVSeriesCategory = async (category) => {
            const request = await axios.get(TVCategories[category].request);
            setGalleryTVSeries(request.data.results);
        };

        for (let i = 0; i < 5; i++) {
            if (activeCategory === i) {
                fetchTVSeriesCategory(i);
            }
        }
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

    return (
        <div>
            <div className="content__tvSeries">
                <Navbar name={name} />
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
                    />
                    <input
                        className="search-button"
                        type="submit"
                        value="Search"
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
