// App.jsx
import React, { useEffect, useState } from "react";
import Home from "./Containers/Home/Home.js";
import Movies from "./Containers/Movies/Movies.js";
import AuthForm from "./Containers/Auth/AuthForm.js";
import EditProfile from "./Containers/Auth/EditProfile/EditProfile.js";
import NotFound from "./Components/NotFound/NotFound.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.js";
import ProtectedLayout from "./ProtectedLayout.js";

import "./App.css";
import TVSeries from "./Containers/TVSeries/TVSeries.js";
import { getUserDetails } from "./Api/api.js";
import MovieTrailer from "./Containers/MovierTrailer/MovieTrailer.js";
import SeriesTrailer from "./Containers/SeriesTrailer/SeriesTrailer.js";

function App() {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await getUserDetails(); // Fetch user details from the API
                const userData = response.user;
                setLoggedUser(userData);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        getUser();
    }, []);

    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="auth/:mode" element={<AuthForm />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedLayout />}>
                            <Route
                                path="/"
                                element={<Home name={loggedUser?.first_name} />}
                            />
                            <Route
                                path="/movies"
                                element={
                                    <Movies name={loggedUser?.first_name} />
                                }
                            />
                            <Route
                                path="/series"
                                element={
                                    <TVSeries name={loggedUser?.first_name} />
                                }
                            />
                            <Route
                                path="/movieTrailer/:id"
                                element={
                                    <MovieTrailer
                                        name={loggedUser?.first_name}
                                    />
                                }
                            />
                            <Route
                                path="/seriesTrailer/:id"
                                element={
                                    <SeriesTrailer
                                        name={loggedUser?.first_name}
                                    />
                                }
                            />
                            <Route
                                path="/edit-profile"
                                element={<EditProfile />}
                            />
                        </Route>

                        {/* Catch all route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
