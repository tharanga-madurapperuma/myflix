import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

// Utility function to get Authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Centralized API request function
const apiRequest = async (method, endpoint, payload = {}) => {
  const headers = getAuthHeaders();

  try {
    const response = await axios({
      method, // HTTP method (GET, POST, PUT, etc.)
      url: `${API_BASE_URL}${endpoint}`,
      headers,
      data: payload, // For PUT, POST requests
    });
    return response.data;
  } catch (error) {
    console.error('API request error:', error.response?.data || error.message);
    throw error; // Propagate the error to be handled in the calling function
  }
};

// Derived function for editing user profile
export const editUser = async (email, firstName, lastName, password) => {
  const payload = {
    email,
    firstName,
    lastName,
    password, // Include password only if provided
  };
  return await apiRequest('PUT', '/auth/edit', payload);
};

// Derived function for getting user details
export const getUserDetails = async () => {
  return await apiRequest('GET', '/auth/user');
};

export const authenticateUser = async (mode, email, password, firstName, lastName) => {
  const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
  const payload = {
    email,
    password,
    ...(mode === "signup" && { firstName, lastName }), // Include name fields for signup
  };
  
  return await apiRequest('POST', endpoint, payload);
};


