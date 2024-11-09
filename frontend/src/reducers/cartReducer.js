import {
  ADD_TO_CART_ERROR,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  REMOVE_FROM_CART_ERROR,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  GET_MY_CART_ERROR,
  GET_MY_CART_REQUEST,
  GET_MY_CART_SUCCESS,
  UPDATE_CART_QTY_REQUEST,
  UPDATE_CART_QTY_SUCCESS,
  UPDATE_CART_QTY_FAIL,
  CLEAR_MY_CART_REQUEST,
  CLEAR_MY_CART_SUCCESS,
  CLEAR_MY_CART_FAIL,
} from "../constants/cartConstants";

const initialState = {
 
  products: [],
  subTotal: 0,
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case GET_MY_CART_REQUEST:
    case REMOVE_FROM_CART_REQUEST:
    case UPDATE_CART_QTY_REQUEST:
    case CLEAR_MY_CART_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_TO_CART_SUCCESS:
    case REMOVE_FROM_CART_SUCCESS:
    case GET_MY_CART_SUCCESS:
    case UPDATE_CART_QTY_SUCCESS:
      return {
        ...state,
        loading: false,
        cartId: action.payload.cartId || "",
        products: action.payload.products || [], // Store flattened product list
        subTotal: action.payload.subTotal || 0, // Store the global subTotal
      };
    case CLEAR_MY_CART_SUCCESS:
      return {
        ...state,
        loading: false,
       
        product: [],
        subTotal: 0,
      };

    case ADD_TO_CART_ERROR:
    case REMOVE_FROM_CART_ERROR:
    case GET_MY_CART_ERROR:
    case UPDATE_CART_QTY_FAIL:
    case CLEAR_MY_CART_FAIL:
      return { ...state, loading: true, error: action.payload };

    default:
      return state;
  }
};
