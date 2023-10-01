import React from "react";

const RadioButton = ({ id, name, onChange, value, text }) => {
  return (
    <div className="radio">
      <input
        type="radio"
        className="inputR"
        id={id}
        name={name}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={id} className="labelR">
        <span className="rButton"></span>
        {text}
      </label>
    </div>
  );
};

export default RadioButton;
