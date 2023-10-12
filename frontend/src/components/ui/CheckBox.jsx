import React,{useState} from 'react'

const CheckBox = ({label,checked,name,onChange,value}) => {
   
  return (
    <div className='checkbox-wrapper-1'>
        <label>
            <input type='checkbox' name={name} checked={checked} onChange={onChange} value={value}/>
            <span>{label}</span>
        </label>
    </div>
  )
}

export default CheckBox