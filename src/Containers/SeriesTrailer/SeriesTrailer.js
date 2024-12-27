import React from "react";
import "./SeriesTrailer.css";
import Navbar from "../../Components/Navbar/Navbar";

const SeriesTrailer = ({ name }) => {
    return (
        <div>
            <Navbar name={name} />
        </div>
    );
};

export default SeriesTrailer;
