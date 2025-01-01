import React, { useEffect, useState } from "react";
import "./Home.css";
import Banner from "../Banner/Banner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import NowPlaying from "../NowPlaying/NowPlaying";

const Home = () => {
    return (
        <div className="home">
            <div className="home__firstSection">
                <Navbar />
                <Banner />
            </div>
            <div className="home__secondSection">
                <NowPlaying />
                <Footer />
            </div>
        </div>
    );
};

export default Home;
