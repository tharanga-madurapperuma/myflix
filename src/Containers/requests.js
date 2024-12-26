const api_key = "402ab982f69b1e475e37d7f951d28493";
const BASE_URL = "https://api.themoviedb.org/3";

const requests = {
    fetchAction: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchTrending: `${BASE_URL}/movie/now_playing?api_key=${api_key}&language=en-US`,
    fetchAdventure: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=12`,
    fetchAnimation: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=16`,
    fetchComedy: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=35`,
    fetchCrime: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=80`,
    fetchDocimentary: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=99`,
    fetchDrama: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=18`,
    fetchFamily: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10751`,
    fetchFantasy: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=14`,
    fetchHistory: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=36`,
    fetchHorror: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchMusic: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10402`,
    fetchRomance: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10749`,
    fetchScienceFiction: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=878`,
    fetchTVMovie: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10770`,
    fetchWar: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=10752`,
    fetchWestern: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=37`,
};

const action = {
    url: `${BASE_URL}/discover/movie?api_key=${api_key}&with_genres=27`,
    genreID: 27,
    name: "Action",
};

const requestUniqueMovie = (id) => {
    return `${BASE_URL}/movie/${id}?api_key=${api_key}&append_to_response=videos`;
};

export { requests, requestUniqueMovie };
