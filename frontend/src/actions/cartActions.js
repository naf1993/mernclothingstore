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

export const createCart = (cart) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CART_ADD_ITEM_REQUEST,
    });
    const token = getState().auth.token;
    console.log(token)
    const config = {
      headers: {
        'authorization': `Bearer ${token}`,
      },
    };

   
    console.log('this is config ',config)
    console.log('this is cart ',cart)
    const { data } = await axios.post("/api/cart", config, cart);
    console.log(data);

    dispatch({
      type: CART_ADD_ITEM_SUCCESS,
      payload: data,
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
