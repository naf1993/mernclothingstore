import { REVIEW_CREATE_FAIL,REVIEW_CREATE_SUCCESS,REVIEW_ELIGIBLE_FAIL,REVIEW_ELIGIBLE_REQUEST,REVIEW_ELIGIBLE_SUCCESS, REVIEW_CREATE_REQUEST } from "../constants/productConstants";

const initialState = {
    loading:false,
    error:null,
    success:null,
    eligible:false

}

export const reviewReducer = (state=initialState,action) => {
    switch(action.type){
        case REVIEW_CREATE_REQUEST:
        case REVIEW_ELIGIBLE_REQUEST:
            return {...state,loading:true}
        case REVIEW_ELIGIBLE_SUCCESS:
            return {...state,loading:false,eligible:action.payload}
        case REVIEW_CREATE_SUCCESS:
            return {...state,loading:false,success:true}
        case REVIEW_ELIGIBLE_FAIL:
        case REVIEW_CREATE_FAIL:
            return {...state,error:action.payload}
            default:
                return state;
    }

}