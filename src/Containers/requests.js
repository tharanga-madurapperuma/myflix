const api_key = "402ab982f69b1e475e37d7f951d28493";
const BASE_URL = "https://api.themoviedb.org/3";

const adventure = `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=12`;
const allGenreList = `${BASE_URL}/genre/movie/list?api_key=${api_key}&language=en-US`;

const requestUniqueMovie = (id) => {
    return `${BASE_URL}/movie/${id}?api_key=${api_key}&language=en`;
};

const categories = [
    {
        id: 0,
        name: "Trending",
        request: `${BASE_URL}/trending/movie/week?api_key=${api_key}&language=en-US`,
    },
    {
        id: 1,
        name: "Now Playing",
        request: `${BASE_URL}/movie/now_playing?api_key=${api_key}&language=en-US&page=1`,
    },
    {
        id: 2,
        name: "Top Rated",
        request: `${BASE_URL}/movie/top_rated?api_key=${api_key}&language=en-US&page=1`,
    },
    {
        id: 3,
        name: "Popular",
        request: `${BASE_URL}/movie/popular?api_key=${api_key}&language=en-US&page=1`,
    },
    {
        id: 4,
        name: "Upcoming",
        request: `${BASE_URL}/movie/upcoming?api_key=${api_key}&language=en-US&page=1`,
    },
];

export { adventure, allGenreList, categories, requestUniqueMovie };
