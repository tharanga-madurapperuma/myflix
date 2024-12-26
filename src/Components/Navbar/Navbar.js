import React from "react";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ name }) => {
    console.log(name);
    return (
        <div className="navBar">
            <div className="navBar-container">
                <div className="navBar__logo">
                    <h1>MYFLIX</h1>
                </div>
                <ul>
                    <li href="#">Home</li>
                    <li href="#">Movies</li>
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
