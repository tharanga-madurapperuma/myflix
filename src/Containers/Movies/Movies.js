import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./Movies.css";
import { requests } from "../requests";
import axios from "axios";

const Movies = () => {
    const [genreList, setGenreList] = useState();

    const categories = [
        {
            name: "Trending",
            className: "trending",
        },
        {
            name: "Now Playing",
            className: "nowPlaying",
        },
        {
            name: "Top Rated",
            className: "topRated",
        },
        {
            name: "Popular",
            className: "popular",
        },
        {
            name: "Upcoming",
            className: "upcoming",
        },
    ];

    useEffect(() => {
        const fetchGenres = async () => {
            const request = await axios.get(requests.GenreList);
            setGenreList(request.data.genres);
        };

        fetchGenres();
    }, []);

    return (
        <div>
            <div className="content__movie">
                <Navbar />
                <div className="movie-categories">
                    {categories.map((category) => {
                        return (
                            <div
                                className={`movie-categories_${category.className}`}
                            >
                                <p>{category.name}</p>
                                <div
                                    className={`${category.className}-line`}
                                ></div>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <hr />
                </div>
                <div className="movie-genres">
                    {genreList &&
                        genreList.map((genre) => {
                            return (
                                <div className="movie-genres__genre">
                                    <p>{genre.name}</p>
                                </div>
                            );
                        })}
                </div>
                <div className="movie-search"></div>
                <div className="movie-list"></div>
                <div>
                    <hr />
                </div>
                <div className="movie-footer"></div>
            </div>
        </div>
    );
};

export default Movies;
