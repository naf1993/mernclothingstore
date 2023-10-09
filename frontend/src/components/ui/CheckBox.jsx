import React,{useState} from 'react'

const CheckBox = ({label,checked}) => {
    const defaultChecked = checked ? checked : false;
    const [isChecked, setIsChecked] = useState(defaultChecked);
  return (
    <div className='checkbox-wrapper-1'>
        <label>
            <input type='checkbox' checked={isChecked} onChange={() => setIsChecked((prev) => !prev)} className={isChecked ? "checked" : ""}/>
            <span>{label}</span>
        </label>
    </div>
  )
}

export default CheckBox