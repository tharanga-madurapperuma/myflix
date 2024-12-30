import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import AuthContext from "../../Context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref to track the menu
    const { logout,user } = useContext(AuthContext);
    const [loggedUser, setLoggedUser] = useState("User");
    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle the menu open/close
    };


    const handleLogout = () => {
        logout();
        // Add logout logic here
    };

    const handleEditProfile = () => {
        console.log("Edit Profile clicked");
        navigate("/edit-profile");
        // Add navigation or logic for editing profile
    };

    useEffect(() => {
        if (user) {
            setLoggedUser(user.first_name);
        } else {
            console.log("User is not available");
        }
        
        
        // setLoggedUser(user.id);
    }, [user]);
    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false); // Close the menu
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="navBar">
            <div className="navBar-container">
                <div className="navBar__logo">
                    <h1>MYFLIX</h1>
                </div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/movies">Movies</Link>
                    </li>
                    <li>
                        <Link to="/series">Series</Link>
                    </li>
                </ul>
                <div
                    className="navBar__user"
                    onClick={toggleMenu}
                    ref={menuRef}
                >
                    <FaUserCircle className="user-icon" />
                    {<p>{loggedUser} </p>}
            
                </div>
                {menuOpen && (
                    <div className="user-menu" ref={menuRef}>
                        <div className="menu-item" onClick={handleEditProfile}>
                            Edit Profile
                        </div>
                        <div className="menu-item" onClick={handleLogout}>
                            Logout
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
