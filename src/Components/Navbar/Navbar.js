import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";
import AuthContext from "../../Context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null); // Ref to track the menu
    const { logout, user } = useContext(AuthContext);
    const [loggedUser, setLoggedUser] = useState("User");
    const [opacity, setOpacity] = useState(0.2);
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

    // This useEffect is for change the opacity of the Navbar
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxOpacity = 0.8; // Maximum opacity value
            const minOpacity = 0.2; // Minimum opacity value
            const scrollThreshold = 500; // Scroll threshold to reach full opacity

            // Calculate opacity based on scroll position
            const newOpacity = Math.min(
                maxOpacity,
                Math.max(minOpacity, scrollY / scrollThreshold)
            );
            setOpacity(newOpacity);
        };

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            className="navBar"
            style={{
                backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                transition: "background-color 0.5s ease",
            }}
        >
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
                    <li>
                        <Link to="/myMovies">My Movies</Link>
                    </li>
                    <li>
                        <Link to="/mySeries">My TV Series</Link>
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
