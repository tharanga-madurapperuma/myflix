import React from "react";
import TrailerDetails from "../TrailerDetails/TrailerDetails";
import { upsertTVStatus } from "../../Api/movieApi";

const SeriesTrailer = () => {
  return <TrailerDetails type="tv" upsertFunction={upsertTVStatus} />;
};

export default SeriesTrailer;
