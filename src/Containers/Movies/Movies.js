import React from 'react'
import './Movies.css';
import VarietyBar from '../VarietyBar/VarietyBar';
import WhiteLine from '../../Components/WhiteLine/WhiteLine';
import Genres from '../Genres/Genres';
import Posters from '../Posters/Posters';
import Scroll from '../Scroll/Scroll';
import Suggestions from '../Suggestions/Suggestions';
import Footer from '../Footer/Footer';

const Movies = () => {
  return (
    <div className='movie'>
        <div className='secondSection'>
            <VarietyBar />
            <WhiteLine />
            <Genres />
            <Posters />
            <Scroll />
            <WhiteLine />
            <Suggestions />
            <WhiteLine />
            <Footer />  
        </div>
    </div>
  )
}

export default Movies