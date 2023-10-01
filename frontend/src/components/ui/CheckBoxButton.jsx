import React from "react";

const CheckBoxButton = ({ id, onChange, value, text }) => {
  return (
   <>
      <input
        type="checkbox"
        className="input-checkbox"
        id={id}
        value={value}
        onChange={onChange}
      />
      <label className="input-label" htmlFor={id}>{text}</label>
    </>
  );
};

export default CheckBoxButton;
