import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer__container">
                <div className="container-column">
                    <p>FAQ</p>
                    <p>Help Center</p>
                    <p>Account</p>
                    <p>Media Center</p>
                </div>
                <div className="container-column">
                    <p>Invester Relations</p>
                    <p>Jobs</p>
                    <p>Ways to Watch</p>
                    <p>Terms of Use</p>
                </div>
                <div className="container-column">
                    <p>Privacy</p>
                    <p>Cookie Preferences</p>
                    <p>Corporate Information</p>
                    <p>Contact Us</p>
                </div>
                <div className="container-column">
                    <p>Speed Test</p>
                    <p>Legal Notices</p>
                    <p>Only on Myflix</p>
                    <p>About</p>
                </div>
            </div>
            <p className="footer-copyright">
                Developed by Gianna Franscello | Myflix
            </p>
        </div>
    );
};

export default Footer;
