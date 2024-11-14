import { ORDER_CREATE_SUCCESS, ORDER_DETAIL_FAIL, ORDER_DETAIL_REQUEST, ORDER_DETAIL_SUCCESS } from "../constants/orderConstants";
import { ORDER_CREATE_FAIL } from "../constants/orderConstants";
import { ORDER_CREATE_REQUEST,ORDER_UPDATE_FAIL,ORDER_UPDATE_REQUEST,ORDER_UPDATE_SUCCESS } from "../constants/orderConstants";
import { COUPON_VALIDATE_FAIL,COUPON_VALIDATE_REQUEST,COUPON_VALIDATE_SUCCESS,ORDERS_MY_FAIL,ORDERS_MY_SUCCESS,ORDERS_MY_REQUEST } from "../constants/orderConstants";


const initialState = {
  orders:[],
  order: {},
  loading: false,
  success:null,
  error: null,
  coupon:{} //i get discount and code after validating coupon
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
    case ORDERS_MY_REQUEST:
    case COUPON_VALIDATE_REQUEST:
    case ORDER_DETAIL_REQUEST:
    case ORDER_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_CREATE_SUCCESS:
    case ORDER_DETAIL_SUCCESS:
    case ORDER_UPDATE_SUCCESS:
      return { ...state, loading: false,success:true, order: action.payload };
    case COUPON_VALIDATE_SUCCESS:
      return {...state,loading:false,coupon:action.payload}
    case ORDERS_MY_SUCCESS:
      return {...state,loading:false,orders:action.payload}
     case ORDER_CREATE_FAIL:
      case COUPON_VALIDATE_FAIL:
      case ORDERS_MY_FAIL:
      case ORDER_DETAIL_FAIL:
      case ORDER_UPDATE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
