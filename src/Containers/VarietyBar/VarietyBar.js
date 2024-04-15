import React from 'react'
import './VarietyBar.css';

const clickChange = document.querySelectorAll('.click-change');

clickChange.forEach((colorChange) => {
  colorChange.addEventListener('click', () => {
    document.querySelector('.after-clicked')?.classList.remove('after-clicked');
    colorChange.classList.add('after-clicked');
  })
})

const VarietyBar = () => {
  return (
    <div className='varietyBar'>
      <div className='varietyBar__outer'>
        <div className='varietyBar__varations'>
          <div>
            <h6 className='click-change'>Movies</h6>
            <div className='div-redBar varietyBar__redBar'></div>
          </div>
          <div>
            <h6 className='click-change' >TV Shows</h6>
            <div className='div-redBar'></div>
          </div>
          <div>
            <h6 className='click-change' >Top Rated</h6>
            <div className='div-redBar'></div>
          </div>
          <div>
            <h6 className='click-change'>Popular</h6>
            <div className='div-redBar'></div>
          </div>
          <div>
            <h6 className='click-change'>Upcoming</h6>
            <div className='div-redBar'></div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default VarietyBar
