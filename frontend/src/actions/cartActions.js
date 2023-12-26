import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_ITEM_RESET,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_FAILURE,
} from "../constants/cartConstants";
import axios from "axios";
import { attachTokenToHeaders } from "./authActions";

export const createCart = (id, color, size) => async (dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM_REQUEST,
  });
  try {
    let postData = {
       cart : [{
        productId: id,
        color: color,
        size: size,
        count: 1,
      }]
    }
   
    //const options = attachTokenToHeaders(getState);
    const token = getState().auth.token;
    const {data} = await axios({
      method:'POST',
      url:'/api/cart',
      data:postData,
      headers:{'Authorization':`Bearer ${token}`}
    })
    
    console.log(data.data.newCart.products)
    let payloadData = []
    data.data.newCart.products.map((item)=>{
      payloadData.push(item)
    })
    console.log('this is paylaod ',payloadData)
   
  
    dispatch({
      type: CART_ADD_ITEM_SUCCESS,
      payload: payloadData,
    });
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
