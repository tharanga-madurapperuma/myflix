import Home from "./Containers/Home/Home.js";
import Movies from "./Containers/Movies/Movies.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import TVSeries from "./Containers/TVSeries/TVSeries.js";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="tvShows" element={<TVSeries />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
