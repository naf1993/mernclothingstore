import React from "react";

const RadioButton = ({
  id,
  name,
  checkedRadio,
  setCheckedRadio,
  onChange,
  value,
  text,
}) => {
  const { isChecked } = checkedRadio;
  return (
    <div className="radio">
      <input
        type="radio"
        id={id}
        className="inputR"
        checked={isChecked === value}
        onChange={onChange}
        onClick={() => setCheckedRadio({ isChecked: value })}
        value={value}
        name={name}
      />
      <label htmlFor={id} className="labelR">
        <span className="rButton"></span>
        {text}
      </label>
      {/* <input
        type="radio"
        className="inputR"
        id={id} checked={checked}
       
       
        onChange={onChange}
        value={value}
       
        name={name}
      />
      <label htmlFor={id} className="labelR">
        <span className="rButton"></span>
        {text}
      </label> */}
    </div>
  );
};

export default RadioButton;
