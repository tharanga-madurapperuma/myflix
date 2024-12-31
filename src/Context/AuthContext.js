import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../Api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Persist token to localStorage and sync state
  const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // Remove token from localStorage and reset state
  const clearAuthToken = () => {
    console.log('Clearing auth token...');
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
  };

  // Login function
  const login = (token) => {
    saveAuthToken(token);
    navigate('/'); // Redirect to home after successful login
  };

  // Signup function
  const signup = () => {
    navigate('/auth/login'); // Redirect to login after successful signup
  };

  // Logout function
  const logout = () => {
    clearAuthToken();
    navigate('/auth/login'); // Redirect to login after logout
  };

  // Fetch user data when token is present
  const fetchUserData = async () => {
    console.log('Fetching user data...');
    if (!authToken) return; // Avoid unnecessary API calls
    try {
      const data = await getUserDetails(authToken); // Pass token to API call
      setUser(data.user); // Set user data in state
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      console.log(authToken);
      clearAuthToken(); // Clear token on error (e.g., token expired)
      navigate('/auth/login'); // Redirect to login
    }
  };

  // Effect to fetch user details on token change or page refresh
  useEffect(() => {
    fetchUserData();
  }, [authToken]); // Run when authToken changes

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
