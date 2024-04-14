import React, {useEffect, useState} from 'react';
import './Banner.css';
import requests from '../requests';
import axios from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';



const Banner = () => {

    const [movie, setMovie] = useState('');
    const [uniqueMovie, setUniqueMovie] = useState('');

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(requests.fetchAdventure);
            const fetchedMovie = request.data.results[
              Math.floor(Math.random() * request.data.results.length - 1)
            ]
            setMovie(fetchedMovie);
            const uniqueRequest = await axios.get(`/movie/${fetchedMovie.id}?api_key=402ab982f69b1e475e37d7f951d28493&append_to_response=videos`);
            setUniqueMovie(uniqueRequest.data);
        };
        fetchData();
    }, []);

    //console.log(movie);
    console.log(uniqueMovie);
    console.log(uniqueMovie.genres);
    

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
        <h4>Duration: {uniqueMovie.runtime} min</h4>
        <h3>{movie?.vote_average}</h3>
        {/* <h5>{uniqueMovie.genres[0].name} | {uniqueMovie.genres[1].name}</h5> */}
        <h2>{movie?.title}</h2>
        <p>{movie?.overview}</p>
        
        <div className='banner__content-buttons'>
          <button className='banner__content-buttons_watchButton buttons'><FontAwesomeIcon className="icon" icon={faPlay}/>WATCH</button>
          <button className='banner__content-buttons_addListButton buttons'><FontAwesomeIcon className="icon" icon={faPlus}/>ADD LIST</button>
        </div>
      </div>
    </>
  )
}

export default Banner