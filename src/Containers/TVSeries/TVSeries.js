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
    const [genreList, setGenreList] = useState([]);
    const [galleryTVSeries, setGalleryTVSeries] = useState([]);
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeGenres, setActiveGenres] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const navigate = useNavigate();

    // Fetch genre list and default category TV series on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                const [genresResponse, defaultCategoryResponse] = await Promise.all([
                    axios.get(allGenreListTV),
                    axios.get(TVCategories[0].request),
                ]);

                setGenreList(genresResponse.data.genres);
                setGalleryTVSeries(defaultCategoryResponse.data.results);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch TV series when the active category changes
    useEffect(() => {
        const fetchTVSeriesByCategory = async () => {
            try {
                setIsLoading(true);
                setLoadedCount(0);

                const response = await axios.get(TVCategories[activeCategory].request);
                setGalleryTVSeries(response.data.results);
            } catch (error) {
                console.error("Error fetching TV series by category:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTVSeriesByCategory();
    }, [activeCategory]);

    // Filter TV series by active genres
    useEffect(() => {
        if (activeGenres.length > 0) {
            const filteredTVSeries = galleryTVSeries.filter((tvSeries) =>
                activeGenres.every((genre) => tvSeries.genre_ids.includes(genre))
            );
            setGalleryTVSeries(filteredTVSeries);
        } else {
            const fetchDefaultCategory = async () => {
                try {
                    const response = await axios.get(TVCategories[activeCategory].request);
                    setGalleryTVSeries(response.data.results);
                } catch (error) {
                    console.error("Error resetting TV series to default category:", error);
                }
            };

            fetchDefaultCategory();
        }
    }, [activeGenres]);

    // Handle search functionality
    const fetchSearchResults = async () => {
        try {
            setIsLoading(true);
            setLoadedCount(0);

            if (searchText.trim()) {
                const response = await axios.get(searchSeries(searchText));
                setGalleryTVSeries(response.data.results);
            } else {
                const defaultCategoryResponse = await axios.get(TVCategories[activeCategory].request);
                setGalleryTVSeries(defaultCategoryResponse.data.results);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Increment loaded images count
    const handleImageLoad = () => {
        setLoadedCount((prevCount) => prevCount + 1);
    };

    // Check if loading is complete
    useEffect(() => {
        if (loadedCount === galleryTVSeries?.length) {
            setIsLoading(false);
        }
    }, [loadedCount, galleryTVSeries]);

    return (
        <div>
            {isLoading && <Loading />}
            <div className="content__tvSeries">
                <Navbar />

                {/* Categories */}
                <div className="tvSeries-categories">
                    {TVCategories.map((category) => (
                        <div
                            key={category.id}
                            className={
                                activeCategory === category.id
                                    ? "tvSeries-categories_category-active"
                                    : "tvSeries-categories_category"
                            }
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <p>{category.name}</p>
                            <div
                                className={
                                    activeCategory === category.id
                                        ? "category-line-active"
                                        : "category-line"
                                }
                            ></div>
                        </div>
                    ))}
                </div>

                <div className="white-line"></div>

                {/* Genres */}
                <div className="tvSeries-genres">
                    <Swiper
                        className="genre-swiper"
                        loop={true}
                        centeredSlides={false}
                        slidesPerView="auto"
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={3000}
                        modules={[Autoplay]}
                    >
                        {genreList.map((genre) => (
                            <SwiperSlide key={genre.id} className="genre-swiper-slide">
                                <div
                                    className={
                                        activeGenres.includes(genre.id)
                                            ? "tvSeries-genres_genre-active"
                                            : "tvSeries-genres_genre"
                                    }
                                    onClick={() =>
                                        activeGenres.includes(genre.id)
                                            ? setActiveGenres(activeGenres.filter((g) => g !== genre.id))
                                            : setActiveGenres([...activeGenres, genre.id])
                                    }
                                >
                                    <p>{genre.name}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Search Bar */}
                <div className="tvSeries-search">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search TV Series"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchSearchResults()}
                    />
                    <input
                        className="search-button"
                        type="submit"
                        value="Search"
                        onClick={fetchSearchResults}
                    />
                </div>

                {/* TV Series List */}
                <div className="tvSeries-list">
                    {galleryTVSeries.map((tvSeries) => (
                        <div
                            key={tvSeries.id}
                            className="tvSeries-list__tvSeries"
                            onClick={() => navigate(`/seriesTrailer/${tvSeries.id}`)}
                        >
                            <img
                                src={`${IMAGE_BASE_URL}${tvSeries.poster_path}`}
                                alt={tvSeries.name}
                                onLoad={handleImageLoad}
                                onError={handleImageLoad}
                            />
                            <div className="tvSeries-title">{tvSeries.name}</div>
                            <div className="tvSeries-info">
                                <p>{tvSeries.first_air_date}</p>
                                <span>{tvSeries.vote_average}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="white-line"></div>
            </div>

            <Footer className="tvSeries-footer" />
        </div>
    );
};

export default TVSeries;
