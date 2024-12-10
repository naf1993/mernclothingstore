import axios from 'axios';
import {
  USER_LOADING,
  LOGIN_WITH_EMAIL_LOADING,
  LOGIN_WITH_OAUTH_LOADING,LOGIN_WITH_OAUTH_FAIL,
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
  USER_REMOVE_FAVOURITE_SUCCESS,USER_SUCCESS,USER_GET_FAVOURITES_FAIL,USER_GET_FAVOURITES_REQUEST,USER_GET_FAVOURITES_SUCCESS
} from "../constants/userConstant";
import toast from 'react-hot-toast';
import Cookies from "js-cookie";

import { apiUrl } from "./apiUrl";

axios.defaults.withCredentials = true;

// actions/userActions.js



// Action to load user from cookies
// export const loadUser = () => async (dispatch) => {
//   dispatch({ type: USER_LOADING });

//   const token = Cookies.get('x-auth-cookie'); // Get the token from cookies


//   try {
//     const config = {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     };

//     const { data } = await axios.get(`${apiUrl}/api/users/me`, config);

//     dispatch({
//       type: USER_SUCCESS,
//       payload: { user: data.data.user },
//     });
//   } catch (error) {
//     dispatch({
//       type: USER_FAIL,
//       payload: error.response ? error.response.data.message : error.message,
//     });
//     throw new Error(error.response ? error.response.data.message : error.message)
//   }
// };


export const loadUser = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  try {
    const options = attachTokenToHeaders(getState);
    const { data } = await axios.get(`${apiUrl}/api/users/me`, options);

    dispatch({
      type: USER_SUCCESS,
      payload: { user: data.data.user },
    });
   
  } catch (error) {
    const errorMessage = error.response && error.response.data && error.response.data.message 
      ? error.response.data.message 
      : error.message;

    toast.error(`Error: ${errorMessage}`); // More descriptive error message
    dispatch({
      type: USER_FAIL,
      payload: { error: errorMessage }, // Consistent payload structure
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
        `${apiUrl}/api/users/login`,
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
        `${apiUrl}/api/users/register`,
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
     // Retrieve the token from the cookie
    const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`, // Attach the token from the cookie
      },
    };
    
    const { data }  = await axios.get(`${apiUrl}/api/users/me`, config);
  
    dispatch({
      type: LOGIN_WITH_OAUTH_SUCCESS,
      payload: { token: token, user: data.data.user },
    });
   
    console.log('after login oauth')
  } catch (err) {
    dispatch({
      type: LOGIN_WITH_OAUTH_FAIL,
      payload: { error: err.response.data.message },
    });
    throw new Error(err.response ? err.response.data.message : err.message)
  }
};

export const logOutUser = () => async (dispatch, getState) => {
  deleteAllCookies();
  const user = getState().user.user;
  console.log('this is user')

console.log(user)

  const provider = user.provider;
  console.log('this is provider')
  console.log(provider)
  
  if (provider !== "google") {
    try {
      await axios.get(`${apiUrl}/auth/logout/email`);
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    } catch (err) {
      console.log(err.response.data.message)
    }
  } else {
    try {
      await axios.get(`${apiUrl}/auth/logout/google`);
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
  const token = getState().user.token;
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

export const getFavourites = () => async (dispatch, getState) => {
  try {
    console.log('reached actions');
    dispatch({ type: USER_GET_FAVOURITES_REQUEST });

    const { user: { token, isAuthenticated } } = getState();
    if (!isAuthenticated || !token) {
      throw new Error('User is not logged in');
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${apiUrl}/api/users/getFavourites`, config);
    
    dispatch({ type: USER_GET_FAVOURITES_SUCCESS, payload: data.data.favourites });
    
  } catch (error) {
  
    dispatch({
      type: USER_GET_FAVOURITES_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const addToFavourites = (productId) => async (dispatch, getState) => {
  try {
    console.log('reached actions');
    dispatch({ type: USER_ADD_FAVOURITES_REQUEST });

    const { user: { token, isAuthenticated } } = getState();
    if (!isAuthenticated || !token) {
      throw new Error('User is not logged in');
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(`${apiUrl}/api/users/addtofavourites`, { productId }, config);
    console.log(data);
    dispatch({ type: USER_ADD_FAVOURITES_SUCCESS, payload: data.data.favourites });
    console.log('action success');
  } catch (error) {
    console.log('action failed', error.message);
    dispatch({
      type: USER_ADD_FAVOURITES_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// Remove from favorites action
export const removeFromFavourites = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_REMOVE_FAVOURITE_REQUEST });

    const { user: { token, isAuthenticated } } = getState();
    if (!isAuthenticated || !token) {
      throw new Error('User is not logged in');
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    console.log('product to be deleted from favs', productId);
    const { data } = await axios.delete(`${apiUrl}/api/users/removefromfavourites/${productId}`, config);
    console.log('Before removal:', getState().user.favourites);

    // Make sure this payload has the updated list of favourites
    dispatch({ type: USER_REMOVE_FAVOURITE_SUCCESS, payload: data.data.favourites });
    
    console.log('After removal (inside action):', data.data.favourites); // Log the new favorites from the API response
  } catch (error) {
    dispatch({
      type: USER_REMOVE_FAVOURITE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

