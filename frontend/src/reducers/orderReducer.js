import { ORDER_CREATE_SUCCESS } from "../constants/orderConstants";
import { ORDER_CREATE_FAIL } from "../constants/orderConstants";
import { ORDER_CREATE_REQUEST } from "../constants/orderConstants";
import { COUPON_VALIDATE_FAIL,COUPON_VALIDATE_REQUEST,COUPON_VALIDATE_SUCCESS } from "../constants/orderConstants";


const initialState = {
  order: {},
  loading: false,
  success:null,
  error: null,
  coupon:{} //i get discount and code after validating coupon
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
    case COUPON_VALIDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_CREATE_SUCCESS:
      return { ...state, loading: false,success:true, order: action.payload };
    case COUPON_VALIDATE_SUCCESS:
      return {...state,loading:false,coupon:action.payload}
     case ORDER_CREATE_FAIL:
      case COUPON_VALIDATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
