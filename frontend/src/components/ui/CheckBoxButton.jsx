import React from "react";

const CheckBoxButton = ({ id, onChange, value, text,name }) => {
  return (
   <>
      <input
        type="checkbox"
        name={name}
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
