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

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="auth/:mode" element={<AuthForm />} />

            {/* Protected routes */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;