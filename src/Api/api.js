// src/api.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

//For authentication Login or Register
export const authenticateUser = async (mode, email, password, firstName, lastName) => {
  
  const endpoint = mode === "login" ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;

  const payload = {
    email,
    password,
    ...(mode === "signup" && { firstName, lastName }) // Include name fields only for signup
  };

  try {
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error) {
    throw error; // Propagate the error to be handled in AuthForm
  }
};

// Function to set token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Function to handle the navigation and token after authentication
export const handleAuthenticationSuccess = (mode, token, navigate) => {
  setAuthToken(token);
  if (mode === "signup") {
    navigate("/auth/login"); // Redirect to login after successful signup
  } else {
    navigate("/"); // Redirect to home after login
  }
};
