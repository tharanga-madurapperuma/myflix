import React from "react";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ name }) => {
    const navigate = useNavigate();

    return (
        <div className="navBar">
            <div className="navBar-container">
                <div className="navBar__logo">
                    <h1>MYFLIX</h1>
                </div>
                <ul>
                    <li
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Home
                    </li>
                    <li
                        onClick={() => {
                            navigate("/movies");
                        }}
                    >
                        Movies
                    </li>
                    <li href="#">TV Shows</li>
                </ul>
                <div className="navBar__user">
                    <FaUserCircle className="user-icon" />
                    <p>{name}</p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
