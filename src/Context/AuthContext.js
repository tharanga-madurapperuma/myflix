import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../Api/api';
import { getMoviesByStatus,getTvSeriesByStatus } from '../Api/movieApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null);
  const [movieStat, setMovieStat] = useState(null);
  const [tvStat, settvStat] = useState(null);
  const navigate = useNavigate();

  //Save the Token to Local Storage
  const saveAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  // Remove token from localStorage and reset state
  const clearAuthToken = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    setMovieStat(null);
    settvStat(null);
  };
//Login Function
  const login = (token) => {
    saveAuthToken(token);
    navigate('/');
  };

   // Signup function
   const signup = () => {
    navigate('/auth/login'); // Redirect to login after successful signup
  };

//Logout Function
  const logout = () => {
    clearAuthToken();
    navigate('/auth/login');
  };

  //Fetch User Data when token is available
  const fetchUserData = async () => {
    if (!authToken) return;
    try {
      const data = await getUserDetails(authToken);
      const movies = await getMoviesByStatus(data.user?.id);
      const tvseries = await getTvSeriesByStatus(data.user?.id);

      setUser(data.user);
      settvStat(tvseries);
      setMovieStat(movies);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      clearAuthToken();
      navigate('/auth/login');
    }
  };

  const refreshMovieStat = async () => {
    try {
      if (user?.id) {
        const movies = await getMoviesByStatus(user.id);
        setMovieStat(movies);
      }
    } catch (error) {
      console.error('Failed to refresh movie statuses:', error);
    }
  };

  const refreshTvStat = async () => {
    try {
      if (user?.id) {
        const tvseries = await getTvSeriesByStatus(user.id);
        settvStat(tvseries);
      }
    } catch (error) {
      console.error('Failed to refresh movie statuses:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authToken]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        movieStat,
        tvStat,
        login,
        logout,
        signup,
        setUser,
        refreshMovieStat,
        refreshTvStat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
