import {
  LOGIN_WITH_EMAIL_SUCCESS,
  LOGIN_WITH_OAUTH_LOADING,
  LOGIN_WITH_OAUTH_SUCCESS,
  LOGIN_WITH_OAUTH_FAIL,
  LOGOUT_SUCCESS,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_EMAIL_FAIL,
  USER_LOADING,
  USER_SUCCESS,
  USER_FAIL,
  REGISTER_WITH_EMAIL_LOADING,
  REGISTER_WITH_EMAIL_SUCCESS,
  REGISTER_WITH_EMAIL_FAIL,
} from "../constants/authConstants";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  appLoaded: false,
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case USER_LOADING:
      return { 
        ...state, 
        isloading: true, 
        appLoaded: false, 
        error: null };
    case LOGIN_WITH_EMAIL_LOADING:
    case LOGIN_WITH_OAUTH_LOADING:
    case REGISTER_WITH_EMAIL_LOADING:
      return { 
        ...state, 
        isloading: true, 
        error: null };
    case LOGIN_WITH_EMAIL_SUCCESS:
    case LOGIN_WITH_OAUTH_SUCCESS:
    case REGISTER_WITH_EMAIL_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        token: payload.token,
        user: payload.user,
        error: null,
      };
    case USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: payload.user,
        error: null,
        appLoaded: true,
      };
    case USER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: payload.error,
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
        error: payload.error, //payload message ovde i razdvoj logout i fail
      };

    case LOGOUT_SUCCESS:
        localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, //payload message ovde i razdvoj logout i fail
      };

    default:
      return state;
  }
};
