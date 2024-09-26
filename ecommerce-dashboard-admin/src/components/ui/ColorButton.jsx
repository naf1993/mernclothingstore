import React from "react";

const ColorButton = ({ color, selected, onClick }) => (
  <button
    style={{
      backgroundColor: color,
      borderRadius: '50%',
      border: selected ? `2px solid ${color}` : '2px solid transparent',
     padding:'0.4rem 0.4rem',
      cursor: 'pointer',
      margin: '0.2rem', // Smaller margin to reduce spacing
      transition: 'all 0.3s ease',
    }}
    onClick={onClick}
  ></button>
);

export default ColorButton;
