import React,{useRef,useEffect,useCallback}from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import './model.css'
import { useSelector, useDispatch } from "react-redux";
import { hideModal } from '../actions/productModalActions';
const ProductModel = (props) => {
 

  const dispatch = useDispatch();
 
 
const toggleProductModal = ()=>{
  dispatch(hideModal())
  props.setName('')
  props.setPrice('')
  props.setImage('')
  props.setDescription('')
 }
 

  return (
   
    <div className="modalContainer">
      <div className="titleCloseBtn">
        <button
          onClick={toggleProductModal}
        >
          X
        </button>
      </div>
      <div className="title">
        <h1>Are You Sure You Want to Continue?</h1>
      </div>
      <div className="body">
        <p>{props.name}</p>
        <p>{props.price}</p>
        <p>{props.image}</p>
        <p>{props.description}</p>
      </div>
      <div className="footer">
        <button
          onClick={toggleProductModal}
          id="cancelBtn"
        >
          Cancel
        </button>
        <button>Continue</button>
      </div>
    </div>
  
  )
}

export default ProductModel 