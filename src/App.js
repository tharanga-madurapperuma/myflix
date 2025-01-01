// App.jsx
import React from "react";
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
import MovieTrailer from "./Containers/MovierTrailer/MovieTrailer.js";
import SeriesTrailer from "./Containers/SeriesTrailer/SeriesTrailer.js";
import MyMovies from "./Containers/myMovies/MyMovies.js";

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="auth/:mode" element={<AuthForm />} />

                        {/* Protected routes */}
                        {/* <Route element={<ProtectedLayout />}> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/series" element={<TVSeries />} />
                        <Route
                            path="/movieTrailer/:id"
                            element={<MovieTrailer />}
                        />
                        <Route
                            path="/seriesTrailer/:id"
                            element={<SeriesTrailer />}
                        />
                        <Route path="/edit-profile" element={<EditProfile />} />
                        <Route path="/myMovies" element={<MyMovies />} />
                        {/* </Route> */}

                        {/* Catch all route */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;
