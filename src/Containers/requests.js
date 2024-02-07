const api_key = '402ab982f69b1e475e37d7f951d28493';

// Get genres, returns ID of genre
//https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}

//Popular
// https://api.themoviedb.org/3/movie/popular?api_key=${api_key}

//Now Playing
//https://api.themoviedb.org/3/movie/now_playing?api_key=${api_key}

// Top Rated
//https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}

//Upcoming
//https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}



const requests = {
    fetchAction: `/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchAdventure: `/discover/movie?api_key=${api_key}&with_genres=12`,
    fetchAnimation: `/discover/movie?api_key=${api_key}&with_genres=16`,
    fetchComedy: `/discover/movie?api_key=${api_key}&with_genres=35`,
    fetchCrime: `/discover/movie?api_key=${api_key}&with_genres=80`,
    fetchDocimentary: `/discover/movie?api_key=${api_key}&with_genres=99`,
    fetchDrama: `/discover/movie?api_key=${api_key}&with_genres=18`,
    fetchFamily: `/discover/movie?api_key=${api_key}&with_genres=10751`,
    fetchFantasy: `/discover/movie?api_key=${api_key}&with_genres=14`,
    fetchHistory: `/discover/movie?api_key=${api_key}&with_genres=36`,
    fetchHorror: `/discover/movie?api_key=${api_key}&with_genres=27`,
    fetchMusic: `/discover/movie?api_key=${api_key}&with_genres=10402`,
    fetchMystery: `/discover/movie?api_key=${api_key}&with_genres=9648`,
    fetchRomance: `/discover/movie?api_key=${api_key}&with_genres=10749`,
    fetchScienceFiction: `/discover/movie?api_key=${api_key}&with_genres=878`,
    fetchTVMovie: `/discover/movie?api_key=${api_key}&with_genres=10770`,
    fetchWar: `/discover/movie?api_key=${api_key}&with_genres=10752`,
    fetchWestern: `/discover/movie?api_key=${api_key}&with_genres=37`,
}

const action = {
    url:`/discover/movie?api_key=${api_key}&with_genres=27`,
    genreID: 27,
    name: "Action"
}

export default requests;