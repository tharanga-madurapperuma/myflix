import React from 'react'
import './myButton.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPlay } from '@fortawesome/free-solid-svg-icons';

function MyButton(props) {
  console.log(props);
  const icon = props.icon;
  const btnText = props.btnText;
  const backgroundColor = props.backgroundColor;
  const foregroundColor = props.foregroundColor;

  return (
    <div>
      <button className="btn" style={{
        backgroundColor: backgroundColor,
        color: foregroundColor,
      }}>
        {/* <FontAwesomeIcon icon={icon} /> */}
        {btnText}
      </button>
    </div>
  )
}

export default MyButton