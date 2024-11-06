import { ORDER_CREATE_SUCCESS } from "../constants/orderConstants";
import { ORDER_CREATE_FAIL } from "../constants/orderConstants";
import { ORDER_CREATE_REQUEST } from "../constants/orderConstants";
import {} from "../constants/orderConstants";

const initialState = {
  order: {},
  loading: false,
  error: null,
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_CREATE_SUCCESS:
      return { ...state, loading: false, order: action.payload };
     case ORDER_CREATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
