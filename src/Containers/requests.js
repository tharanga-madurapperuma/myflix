const api_key = "402ab982f69b1e475e37d7f951d28493";
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
    Adventure: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=12`,

    NowPlaying: `${BASE_URL}/movie/now_playing?api_key=${api_key}&language=en-US&page=1`,
    TopRated: `${BASE_URL}/movie/top_rated?api_key=${api_key}&language=en-US&page=1`,
    Popular: `${BASE_URL}/movie/popular?api_key=${api_key}&language=en-US&page=1`,
    UpComing: `${BASE_URL}/movie/upcoming?api_key=${api_key}&language=en-US&page=1`,

    Movies: `${BASE_URL}/trending/movie/week?api_key=${api_key}&language=en-US`,

    GenreList: `${BASE_URL}/genre/movie/list?api_key=${api_key}&language=en-US`,
};

const requestUniqueMovie = (id) => {
    return `${BASE_URL}/movie/${id}?api_key=${api_key}&language=en`;
};

export { requests, requestUniqueMovie };
