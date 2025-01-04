import React, { useEffect, useState, useContext } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { fetchDetails } from "../../Api/movieApi";
import AuthContext from "../../Context/AuthContext";
import "./myMedia.css"; // Rename CSS file to handle common styles for both TV and Movies

const MyMedia = ({ mediaType, statsKey, detailPath }) => {
    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original/";
    const [galleryItems, setGalleryItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("To Watch");
    const [watchedItems, setWatchedItems] = useState([]);
    const [watchingItems, setWatchingItems] = useState([]);
    const [toWatchItems, setToWatchItems] = useState([]);
    const { [statsKey]: mediaStat } = useContext(AuthContext); // Dynamically access mediaStat
    const navigate = useNavigate();

    // Fetch media items based on IDs in mediaStat
    const fetchItemsByCategory = async (ids) => {
        try {
            const mediaDetails = await Promise.all(
                ids.map((id) => fetchDetails(mediaType, id))
            );
            return mediaDetails;
        } catch (error) {
            console.error(`Error fetching ${mediaType} details:`, error);
            return [];
        }
    };

    // Fetch all media items when mediaStat changes
    useEffect(() => {
        if (mediaStat) {
            const fetchAllItems = async () => {
                const [watched, watching, toWatch] = await Promise.all([
                    fetchItemsByCategory(mediaStat.watched),
                    fetchItemsByCategory(mediaStat.watching),
                    fetchItemsByCategory(mediaStat.toWatch),
                ]);
                setWatchedItems(watched);
                setWatchingItems(watching);
                setToWatchItems(toWatch);
                setGalleryItems(toWatch); // Default to "To Watch"
            };

            fetchAllItems();
        }
    }, [mediaStat]);

    // Handle category change
    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        if (category === "To Watch") setGalleryItems(toWatchItems);
        if (category === "Watching") setGalleryItems(watchingItems);
        if (category === "Watched") setGalleryItems(watchedItems);
    };

    return (
        <div>
            <div className="content__media">
                
                <div className="media-categories">
                    {["To Watch", "Watching", "Watched"].map((category) => (
                        <div
                            key={category}
                            className={
                                activeCategory === category
                                    ? "media-categories_category-active"
                                    : "media-categories_category"
                            }
                            onClick={() => handleCategoryChange(category)}
                        >
                            <p>{category}</p>
                            <div
                                className={
                                    activeCategory === category
                                        ? "category-line-active"
                                        : "category-line"
                                }
                            ></div>
                        </div>
                    ))}
                </div>
                <div className="white-line"></div>

                <div className="media-list">
                    {galleryItems.length > 0 ? (
                        galleryItems.map((item) => (
                            <div
                                key={item.id}
                                className="media-list__item"
                                onClick={() => navigate(`${detailPath}/${item.id}`)}
                            >
                                <img
                                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                                    alt={item.title || item.name}
                                />
                                <div className="media-title">{item.title || item.name}</div>
                                <div className="media-info">
                                    <p>{item.release_date || item.first_air_date}</p>
                                    <span>{item.vote_average}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items in this category</p>
                    )}
                </div>
                <div className="white-line"></div>
            </div>
            <div className="media-footer">
                <Footer />
            </div>
        </div>
    );
};

export default MyMedia;
