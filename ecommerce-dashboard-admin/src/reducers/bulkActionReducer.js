import { BULK_ACTION_FAIL,BULK_ACTION_SUCCESS,BULK_ACTION_REQUEST } from "actions/bulkActions";

const initialState = {
    loading: false,
    success: false,
    error: null,
  };

export const bulkActionReducer = (state=initialState,action)=>{
    switch (action.type) {
        case BULK_ACTION_REQUEST:
          return { loading: true, success: false, error: null };
        case BULK_ACTION_SUCCESS:
          return { loading: false, success: true, error: null };
        case BULK_ACTION_FAIL:
          return { loading: false, success: false, error: action.payload };
        default:
          return state;
      }
}