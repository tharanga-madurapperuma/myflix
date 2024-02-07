import React from 'react'
import { myflix, search } from '../../assets/images'
import './Navbar.css';

const Navbar = () => {
  return (
    <div className='navBar'>
        <div className='navBar__image'>
            <img src={myflix} alt='Myflix Logo'/>
        </div>
            <ul>
                <li href='#'>Home</li>
                <li href='#'>Movies</li>
                <li href='#'>TV Shows</li>
            </ul>
        <div className='navBar__search'>
            <img src={search} alt='Search Icon'/>
        </div>
    </div>
  )
}

export default Navbar
