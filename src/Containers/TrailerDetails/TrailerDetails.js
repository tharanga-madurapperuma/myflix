import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../Footer/Footer";
import Loading from "../../Components/Loading/Loading";
import AuthContext from "../../Context/AuthContext";
import { fetchDetails, fetchReviews, upsertStatus } from "../../Api/movieApi"; // Generic fetch & upsert API
import "./trailerDetails.css";

const TrailerDetails = ({ type, upsertFunction }) => {
  const id = window.location.pathname.split("/")[2];
  const { user, refreshMovieStat, refreshTvStat } = useContext(AuthContext);

  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonState, setButtonState] = useState({
    toWatch: false,
    watching: false,
    watched: false,
  });
  const [loadingButtons, setLoadingButtons] = useState({
    toWatch: false,
    watching: false,
    watched: false,
  });

  const refreshStat = type === "movie" ? refreshMovieStat : refreshTvStat;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const detailsData = await fetchDetails(type, id);
        setDetails(detailsData);

        const reviewsData = await fetchReviews(type, id);
        setReviews(reviewsData.results || []);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  useEffect(() => {
    const stat = type === "movie" ? user?.movieStat : user?.tvStat;
    if (stat) {
      setButtonState({
        toWatch: stat.toWatch?.includes(parseInt(id)) || false,
        watching: stat.watching?.includes(parseInt(id)) || false,
        watched: stat.watched?.includes(parseInt(id)) || false,
      });
    }
  }, [user, type, id]);

  const handleWatchStatus = async (status) => {
    if (!user) {
      alert("Please log in to update your watch status.");
      return;
    }

    try {
      setLoadingButtons((prev) => ({ ...prev, [status]: true }));
      await upsertFunction(user.id, id, status);
      await refreshStat();
    } catch (error) {
      console.error(`Failed to update ${type} watch status:`, error);
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [status]: false }));
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <Navbar />
      <div className="trailer-container">
        {details && (
          <div className="trailer-details">
            <div className="trailer-details__image">
              <img
                src={`https://image.tmdb.org/t/p/original/${details.poster_path}`}
                alt={details.title || details.name}
              />
            </div>
            <div className="trailer-details__info">
              <h1>{details.title || details.name}</h1>
              <p>{details.overview}</p>
            </div>
          </div>
        )}
        <div className="trailer-add-my-movies">
          {["toWatch", "watching", "watched"].map((status) => (
            <button
              key={status}
              onClick={() => handleWatchStatus(status)}
              style={
                buttonState[status] ? { backgroundColor: "green", color: "white" } : null
              }
              disabled={buttonState[status] || loadingButtons[status]}
            >
              {loadingButtons[status] ? "Updating..." : `Add to ${status}`}
            </button>
          ))}
        </div>
        <div className="container-reviews">
          {reviews.length === 0 ? (
            <h2>No reviews available</h2>
          ) : (
            reviews.map((review) => (
              <div className="review" key={review.id}>
                <h3>{review.author}</h3>
                <p>{review.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrailerDetails;
