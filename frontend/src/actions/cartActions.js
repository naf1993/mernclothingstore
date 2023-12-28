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

export const createCart = (id, color, size,count=1) => async (dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM_REQUEST,
  });
  try {
    let postData = {
      productId: id,
      color: color,
      size: size,
      count: count,
    };

    //const options = attachTokenToHeaders(getState);
    const token = getState().auth.token;
    const { data } = await axios({
      method: "POST",
      url: "/api/cart",
      data: postData,
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(data.data.cart.product);
   

    dispatch({
      type: CART_ADD_ITEM_SUCCESS,
      payload: {
        product:data.data.cart.product._id,
        name:data.data.cart.product.name,
        price:data.data.cart.product.price,
        image:data.data.cart.product.imageCover.url,
        stock:data.data.cart.product.countInStock,
        count
      },
    });
    
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    console.log(error)
  }
};
