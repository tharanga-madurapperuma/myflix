import "./App.css";
import Home from "./Containers/Home/Home.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NowPlaying from "./Containers/NowPlaying/NowPlaying.js";
import Movies from "./Containers/Movies/Movies.js";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/nowPlaying" element={<NowPlaying />} />
                    <Route path="/movies" element={<Movies />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
