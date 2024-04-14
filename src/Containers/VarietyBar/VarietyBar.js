import React from 'react'
import './VarietyBar.css';

const VarietyBar = () => {
  return (
    <div className='varietyBar'>
      <div>
        <ul className='varietyBar__varations'>
          <li>Movies</li>
          <li>TV Shows</li>
          <li>Top Rated</li>
          <li>Popular</li>
          <li>Upcoming</li>
        </ul>
      </div>
    </div>
  )
}

export default VarietyBar
