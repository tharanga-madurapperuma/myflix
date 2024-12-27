import React, { useEffect, useState } from "react";
import "./Home.css";
import Banner from "../Banner/Banner";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import NowPlaying from "../NowPlaying/NowPlaying";
import { getUserDetails } from "../../Api/api";

const Home = () => {
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
    console.log(loggedUser);
    return (
        <div className="home">
            <div className="home__firstSection">
                <Navbar name={loggedUser?.first_name} />
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
