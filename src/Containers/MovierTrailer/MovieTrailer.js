import React from "react";
import "./MovieTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";

const MovieTrailer = ({ name }) => {
    return (
        <div>
            <Navbar name={name} />
        </div>
    );
};

export default MovieTrailer;
