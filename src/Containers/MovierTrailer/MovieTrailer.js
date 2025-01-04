import React from "react";
import TrailerDetails from "../TrailerDetails/TrailerDetails";
import { upsertMovieStatus } from "../../Api/movieApi";

const MovieTrailer = () => {
  return <TrailerDetails type="movie" upsertFunction={upsertMovieStatus} />;
};

export default MovieTrailer;
