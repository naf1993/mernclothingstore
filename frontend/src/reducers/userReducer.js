import {
  USER_ADD_FAVOURUTES_FAIL,
  USER_ADD_FAVOURUTES_REQUEST,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,USER_REMOVE_FAVOURITE_FAIL,USER_REMOVE_FAVOURITE_SUCCESS,USER_REMOVE_FAVOURITE_REQUEST,
  USER_ADD_FAVOURUTES_SUCCESS
} from "../constants/userConstant";

const initialState = {
    user:{},
    loading:false,
    error:null,
    favorites:[]
}
export const userReducer = (state=initialState,action)=>{
    switch(action.type){
        case USER_UPDATE_PROFILE_REQUEST:
            return { ...state, loading: true };
          case USER_UPDATE_PROFILE_SUCCESS:
            return { ...state, loading: false, userInfo: action.payload };
          case USER_UPDATE_PROFILE_FAIL:
            return { ...state, loading: false, error: action.payload };
      
          case USER_ADD_FAVOURUTES_REQUEST:
            return { ...state, loading: true };
          case USER_ADD_FAVOURUTES_SUCCESS:
            return { ...state, loading: false, favorites: [...state.favorites, action.payload] };
          case USER_ADD_FAVOURUTES_FAIL:
            return { ...state, loading: false, error: action.payload };
            case USER_REMOVE_FAVOURITE_REQUEST:
                return { ...state, loading: true };
              case USER_REMOVE_FAVOURITE_SUCCESS:
                return { 
                  ...state, 
                  loading: false, 
                  favorites: state.favorites.filter(fav => fav._id !== action.payload._id) 
                };
              case USER_REMOVE_FAVOURITE_FAIL:
                return { ...state, loading: false, error: action.payload };
          
            
                default:
                  return state;
        };

        
    }
