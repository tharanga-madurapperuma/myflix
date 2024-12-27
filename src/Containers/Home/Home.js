import React, { useEffect, useState } from "react";
import "./Home.css";
import Banner from "../Banner/Banner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import NowPlaying from "../NowPlaying/NowPlaying";
import { requests } from "../requests";
import axios from "axios";

const Home = () => {
    const [loggedUser, setLoggedUser] = useState(null);

    useEffect(() => {
        setLoggedUser(() => {
            const user = {
                name: "Tharanga Sandun",
                email: "admin@gmail.com",
            };
            return user;
        });
    }, []);

    return (
        <div className="home">
            <div className="home__firstSection">
                <Navbar name={loggedUser?.name} />
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
