import {
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_FAILURE,
  CART_REMOVE_ITEM,
  CART_ITEM_RESET,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";

export const addToCartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CART_ADD_ITEM_SUCCESS: {
      const item = action.payload;
      // let itemExists;
      // if (state.cartItems) {
      //   itemExists = state.cartItems.find((el) => el.product === item.product);
      //   return {
      //     ...state,
      //     cartItems: state.cartItems.map((el) =>
      //       el.product === itemExists.product ? item : el
      //     ),
      //   };
      // } 
      // else {
        return {
          loading: false,
          success: true,
          ...state,
          cartItems:[...state.cartItems,{...action.payload}]
        };
      }
    //}
    case CART_ADD_ITEM_FAILURE: {
      return { loading: false, error: action.payload };
    }
    default:
      return state;
  }
};
