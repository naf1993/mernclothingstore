import {
  USER_LOADING,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_OAUTH_LOADING,
  REGISTER_WITH_EMAIL_LOADING,
  USER_UPDATE_PROFILE_REQUEST,
  USER_ADD_FAVOURITES_REQUEST,
  USER_REMOVE_FAVOURITE_REQUEST,
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_OAUTH_SUCCESS,
  REGISTER_WITH_EMAIL_SUCCESS,
  USER_FAIL,
  LOGIN_WITH_EMAIL_FAIL,
  REGISTER_WITH_EMAIL_FAIL,
  USER_UPDATE_PROFILE_FAIL,
  USER_ADD_FAVOURITES_FAIL,
  USER_REMOVE_FAVOURITE_FAIL,
  USER_ADD_FAVOURITES_SUCCESS,
  LOGOUT_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_REMOVE_FAVOURITE_SUCCESS,
  USER_SUCCESS,
  USER_GET_FAVOURITES_REQUEST,
  USER_GET_FAVOURITES_SUCCESS,
  USER_GET_FAVOURITES_FAIL,
} from "../constants/userConstant";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  appLoaded: false,
  favourites: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
        appLoaded: false,
        error: null,
      };
    case LOGIN_WITH_EMAIL_LOADING:
    case LOGIN_WITH_OAUTH_LOADING:
    case REGISTER_WITH_EMAIL_LOADING:
    case USER_ADD_FAVOURITES_REQUEST:
    case USER_REMOVE_FAVOURITE_REQUEST:
    case USER_GET_FAVOURITES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case LOGIN_WITH_EMAIL_SUCCESS:
    case LOGIN_WITH_OAUTH_SUCCESS:
    case REGISTER_WITH_EMAIL_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
        favourites: action.payload.user?.favourites || [],
      };
    case USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        favourites: action.payload.user?.favourites || [],
        error: null,
        appLoaded: true,
      };
      case USER_ADD_FAVOURITES_SUCCESS:
        return {
          ...state,
          isLoading: false,
          favourites: [
            ...state.favourites.filter(fav => !action.payload.some(item => item._id === fav._id)), // Filter out existing favourites
            ...action.payload // Add new products
          ],
        };
      case USER_GET_FAVOURITES_SUCCESS:
        return {
          ...state,
          isLoading:false,
          favourites:action.payload
        }
    case USER_REMOVE_FAVOURITE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        favourites:  action.payload,
      };
    case USER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: action.payload.error,
        appLoaded: true,
      };
    case LOGIN_WITH_EMAIL_FAIL:
    case REGISTER_WITH_EMAIL_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };
    case USER_ADD_FAVOURITES_FAIL:
    case USER_REMOVE_FAVOURITE_FAIL:
    case USER_GET_FAVOURITES_FAIL:
      return { ...state, error: action.payload};
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};
