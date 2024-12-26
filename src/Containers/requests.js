const api_key = "402ab982f69b1e475e37d7f951d28493";
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
    Adventure: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=12`,

    NowPlaying: `${BASE_URL}/movie/now_playing?api_key=${api_key}&language=en-US`,
    TopRated: `${BASE_URL}/movie/top_rated?api_key=${api_key}&language=en-US`,
    Popular: `${BASE_URL}/movie/popular?api_key=${api_key}&language=en-US`,
    UpComing: `${BASE_URL}/movie/upcoming?api_key=${api_key}&language=en-US`,

    // fetchAdventure: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=12`,
    // fetchAnimation: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=16`,
    // fetchComedy: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=35`,
    // fetchCrime: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=80`,
    // fetchDocumentary: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=99`,
    // fetchDrama: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=18`,
    // fetchFamily: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10751`,
    // fetchHorror: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=27`,
    // fetchRomance: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10749`,
    // fetchScienceFiction: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=878`,
};

const requestUniqueMovie = (id) => {
    return `${BASE_URL}/movie/${id}?api_key=${api_key}&append_to_response=videos`;
};

export { requests, requestUniqueMovie };
