import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import MyMedia from "../MyMedia/MyMedia";

const MyTv = () => {
    return (
        <><Navbar />
        <MyMedia 
            mediaType="tv" 
            statsKey="tvStat" 
            detailPath="/seriesTrailer" 
        />
        
        </>
        
    );
};

export default MyTv;
