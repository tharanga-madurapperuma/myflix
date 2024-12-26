
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


//Function to Edit user

export const editUser = async (email, firstName, lastName, password) => {
  const endpoint = `${API_BASE_URL}/auth/edit`; // Use userId to identify which user to edit


  const payload = {
    email,
    firstName,
    lastName,
    ...(password && { password }) // Include password only if it is provided
  };
  console.log(payload);
  try {
    const response = await axios.post(endpoint, payload); // Use PUT for updates
    return response.data;
  } catch (error) {
    throw error; // Propagate the error to be handled in the calling function
  }
};

