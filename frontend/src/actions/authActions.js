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
  REGISTER_WITH_EMAIL_FAIL,REGISTER_WITH_EMAIL_SUCCESS,REGISTER_WITH_EMAIL_LOADING
} from "../constants/authConstants";
import Cookies from "js-cookie";
import axios from "axios";
export const loadUser = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  try {
    const options = attachTokenToHeaders(getState);
    const { data } = await axios.get("/api/users/me", options);

    dispatch({
      type: USER_SUCCESS,
      payload: { user: data.data.user },
    });
  } catch (err) {
    dispatch({
      type: USER_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const loginUserWithEmail =
  (email, password) => async (dispatch, getState) => {
    dispatch({ type: LOGIN_WITH_EMAIL_LOADING });
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/login",
        { email, password },
        config
      );
    dispatch({
        type: LOGIN_WITH_EMAIL_SUCCESS,
        payload: { token: data.token, user: data.data.user },
      });
      dispatch(loadUser());
    } catch (err) {
      dispatch({
        type: LOGIN_WITH_EMAIL_FAIL,
        payload: { error: err.response.data.message },
      });
    }
  };

  export const registerWithEmail = (name,email,password) => async(dispatch) => {
    dispatch({type:REGISTER_WITH_EMAIL_LOADING})
    try{
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/users/register",
        { name,email, password },
        config
      );
      dispatch({
        type:REGISTER_WITH_EMAIL_SUCCESS,
        payload:{token:data.token,user:data.data.user}
      })
      dispatch(loadUser())
      }catch(err){
        dispatch({
          type:REGISTER_WITH_EMAIL_FAIL,
          payload:{error:err.response.data.message}
        })

    }
  }

  

export const loginUserWithOauth = (token) => async (dispatch, getState) => {
  dispatch({ type: LOGIN_WITH_OAUTH_LOADING });
  try {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
   
    const { data }  = await axios.get("/api/users/me", config);
    dispatch({
      type: LOGIN_WITH_OAUTH_SUCCESS,
      payload: { token: token, user: data.data.user },
    });
  } catch (err) {
    dispatch({
      type: LOGIN_WITH_OAUTH_FAIL,
      payload: { error: err.response.data.message },
    });
  }
};

export const logOutUser = () => async (dispatch, getState) => {
  deleteAllCookies();
  const user = getState().auth.user;
  const provider = user.provider;
  if (provider !== "google") {
    try {
      await axios.get("/auth/logout/email");
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    } catch (err) {
      console.log(err.response.data.message)
    }
  } else {
    try {
      await axios.get("/auth/logout/google");
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    } catch (err) { console.log(err.response.data.message)}
  }
};

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
export const attachTokenToHeaders = (getState) => {
  const token = getState().auth.token;
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
