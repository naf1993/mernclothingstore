import React from "react";

const ColorButton = ({ value, onClick, color }) => {
  return (
    <>
      <button
        value={value}
        type="submit"
        onClick={onClick}
        style={{
        
          backgroundColor: `${color}`,
        }}
      />
    </>
  );
};

export default ColorButton;
