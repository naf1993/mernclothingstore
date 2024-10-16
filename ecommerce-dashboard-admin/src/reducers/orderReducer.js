import {
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_USER_REQUEST,
    ORDER_USER_SUCCESS,
    ORDER_USER_FAIL,
    ORDER_UPDATE_REQUEST,
    ORDER_UPDATE_SUCCESS,
    ORDER_UPDATE_FAIL,
    ORDER_DAILY_REQUEST,
    ORDER_DAILY_SUCCESS,
    ORDER_DAILY_FAIL,
    ORDER_SUMMARY_REQUEST,
    ORDER_SUMMARY_SUCCESS,
    ORDER_SUMMARY_FAIL,
    SALES_DATA_REQUEST,
    SALES_DATA_SUCCESS,
    SALES_DATA_FAIL,
} from '../constants/orderConstants';

const initialState = {
    items:[],
    userOrders:[],
    dailyOrders:[],
    orderSummary:{},
    loading:false,
    error:null
}

export const orderReducer = (state=initialState,action)=>{
    switch(action.type){
        case ORDER_LIST_REQUEST:
            case ORDER_USER_REQUEST:
            case ORDER_UPDATE_REQUEST:
            case ORDER_DAILY_REQUEST:
            case ORDER_SUMMARY_REQUEST:
            case SALES_DATA_REQUEST:
                return {...state,loading:true,error:null}
                case ORDER_LIST_SUCCESS:
                    return { ...state, loading: false, items: action.payload };
        
                case ORDER_USER_SUCCESS:
                    return { ...state, loading: false, userOrders: action.payload };
        
                case ORDER_UPDATE_SUCCESS:
                    return { ...state, loading: false, success: true };
        
                case ORDER_DAILY_SUCCESS:
                    return { ...state, loading: false, dailyOrders: action.payload };
        
                case ORDER_SUMMARY_SUCCESS:
                    return { ...state, loading: false, orderSummary: action.payload };
        
                case SALES_DATA_SUCCESS:
                    return { ...state, loading: false, salesData: action.payload };
        
                case ORDER_LIST_FAIL:
                case ORDER_USER_FAIL:
                case ORDER_UPDATE_FAIL:
                case ORDER_DAILY_FAIL:
                case ORDER_SUMMARY_FAIL:
                case SALES_DATA_FAIL:
                    return { ...state, loading: false, error: action.payload };
        
                default:
                    return state;
    }
}