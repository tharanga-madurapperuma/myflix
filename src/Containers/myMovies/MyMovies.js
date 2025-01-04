import React from "react";
import MyMedia from "../MyMedia/MyMedia";
import Navbar from "../../Components/Navbar/Navbar";

const MyMovies = () => {
  return (
    <>
      <Navbar />
      <MyMedia
        mediaType="movie"
        statsKey="movieStat"
        detailPath="/movieTrailer"
      />
    </>
  );
};

export default MyMovies;
