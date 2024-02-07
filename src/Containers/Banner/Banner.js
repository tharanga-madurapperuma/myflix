import React, {useEffect, useState} from 'react';
import './Banner.css';
import requests from '../requests';
import axios from '../axios';

const Banner = () => {

    const [movie, setMovie] = useState('');

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(requests.fetchAdventure);
            setMovie(
                request.data.results[
                    Math.floor(Math.random() * request.data.results.length - 1)
                ]
            );
        };
        fetchData();
    }, []);

    console.log(movie);

  return (
    <>
      <div className='banner__background' 
        style={{
            backgroundSize: "cover",
            backgroundImage: `url(
              "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
            )`,
            backgroundPosition: "center center",
        }}
      />
      
      <div className='banner__leftGradient'/>
      <div className='banner__topGradient' />
      <div className='banner__bottomGradient' />

      <div className='banner__content'>
        <h3>{movie?.vote_average}</h3>
        <h2>{movie?.title}</h2>
        <p>{movie?.overview}</p>
      </div>
    </>
  )
}

export default Banner
