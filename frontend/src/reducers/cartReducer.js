import { CART_ADD_ITEM_REQUEST,CART_ADD_ITEM_SUCCESS,CART_ADD_ITEM_FAILURE,CART_REMOVE_ITEM,CART_ITEM_RESET,CART_SAVE_PAYMENT_METHOD,CART_SAVE_SHIPPING_ADDRESS, } from "../constants/cartConstants";


const initialState = {
    cart:[{}]
}


export const addToCartReducer = (state=initialState,action)=>{
   
    switch(action.type){
        case CART_ADD_ITEM_REQUEST:
            return {loading:true}
        case CART_ADD_ITEM_SUCCESS:{
            return {loading:false,success:true,...state,cart:[...state.cart,action.newItem]}
        }
        case CART_ADD_ITEM_FAILURE:{
            return {loading:false,error:action.payload}
        }
        default:
            return state

    }
}