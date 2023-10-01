import * as actions from '../actions/productModalActions'

const initialState = {
    modal: false,
  };
export const modalReducer = (state = initialState,action)=>{
    switch(action.type){
        case actions.SHOW_PRODUCT_MODAL:
            return {
                ...state,
                modal: true,
              };
        case actions.HIDE_PRODUCT_MODAL:
            return {
                ...state,
                modal:false
            }

        default:
            return state
    }
}