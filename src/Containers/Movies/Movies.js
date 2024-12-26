import React, { useEffect, useState } from "react";
import "./Movies.css";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import { requests } from "../requests";
import axios from "axios";

const Movies = () => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {
        const fetchTrending = async () => {
            const request = await axios.get(requests.fetchTrending);
            setTrendingMovies(request.data.results);

            return request;
        };

        fetchTrending();
    }, []);

    return (
        <div className="movie">
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
                    pagination={true}
                    modules={[EffectCoverflow, Pagination]}
                    className="mySwiper"
                >
                    {trendingMovies.map((movie) => (
                        <SwiperSlide>
                            <img
                                src={IMAGE_BASE_URL + movie.poster_path}
                                alt={movie.title}
                                className="movie__poster"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Movies;
