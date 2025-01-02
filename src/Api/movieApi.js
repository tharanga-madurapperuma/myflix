import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/movie/fetch';

// Centralized API request function
const makeApiRequest = async (params) => {
  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Function to fetch adventure movies
export const fetchAdventureMovies = async () => {
  return await makeApiRequest({ action: 'adventure' });
};

// Function to fetch all movie genres
export const fetchAllMovieGenres = async () => {
  return await makeApiRequest({ action: 'allGenreList' });
};

// Function to fetch all TV genres
export const fetchAllTVGenres = async () => {
  return await makeApiRequest({ action: 'allGenreListTV' });
};

// Function to fetch detailed information for a specific item
export const fetchDetails = async (type, id, append = null) => {
  return await makeApiRequest({
    action: 'details',
    type,
    id,
    append,
  });
};

// Function to fetch user reviews for a specific item
export const fetchReviews = async (type, id) => {
  return await makeApiRequest({
    action: 'reviews',
    type,
    id,
  });
};

// Function to perform a search query for the specified type
export const searchMedia = async (type, query) => {
  return await makeApiRequest({
    action: 'search',
    type,
    query,
  });
};

// Function to fetch a list of items for the specified type and category
export const fetchItemsByCategory = async (type, category) => {
  return await makeApiRequest({
    type,
    category,
  });
};
