import React, { useEffect, useState } from "react";
import "./NowPlaying.css";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import { adventure } from "../requests";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";

const NowPlaying = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [trendingMovies, setTrendingMovies] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [imageCount, setImageCount] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        setImageCount(0);
        const fetchTrending = async () => {
            setIsLoading(true);
            try {
                const request = await axios.get(adventure);
                setTrendingMovies(request.data.results);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            }
        };

        fetchTrending();
    }, []);

    useEffect(() => {
        if (imageCount === trendingMovies.length) {
            setIsLoading(false);
        }
    }, [imageCount]);

    const increaseCount = () => {
        setImageCount((prevCount) => prevCount + 1);
    };

    return (
        <div className="movie">
            {isLoading && <Loading />}
            <div className="movie-swiper">
                <Swiper
                    effect={"coverflow"}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={"auto"}
                    loop={true}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 200,
                        modifier: 2.5,
                        slideShadows: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    speed={1000}
                    pagination={true}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className="mySwiper"
                >
                    {trendingMovies.map((movie, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={IMAGE_BASE_URL + movie.poster_path}
                                alt={movie.title}
                                className="movie__poster"
                                onClick={() => {
                                    navigate(`/movieTrailer/${movie.id}`);
                                }}
                                onLoad={increaseCount}
                                onError={increaseCount}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default NowPlaying;
