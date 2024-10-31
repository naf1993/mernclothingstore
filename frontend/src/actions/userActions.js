import axios from "axios";
import {
  USER_ADD_FAVOURUTES_REQUEST,
  USER_ADD_FAVOURUTES_SUCCESS,
  USER_ADD_FAVOURUTES_FAIL,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../constants/userConstant";
import {
  USER_REMOVE_FAVOURITE_FAIL,
  USER_REMOVE_FAVOURITE_SUCCESS,
  USER_REMOVE_FAVOURITE_REQUEST,
} from "../constants/userConstant";
import {toast} from 'react-hot-toast'
// Update user action
export const updateUser = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put("/api/users/profile", userData, config);

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Add to favorites action
export const addToFavourites = (productId) => async (dispatch, getState) => {
  try {
    console.log('reached actions')
    const { auth: { token, isAuthenticated } } = getState();

    if (!isAuthenticated || !token) {
      throw new Error('User is not logged in'); // Handle not authenticated
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Use the token from state
      },
    };

    const { data } = await axios.post(
      `/api/users/addtofavourites`,
      { productId },
      config
    );
console.log(data)
    dispatch({ type: USER_ADD_FAVOURUTES_SUCCESS, payload: data.data.favourites });
    console.log('action success')
   
  } catch (error) {
    console.log('action failed',error.message)
    
    dispatch({
      type: USER_ADD_FAVOURUTES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
   
  }
};

export const removeFromFavourites =
  (productId) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_REMOVE_FAVOURITE_REQUEST });

      const { auth: { token, isAuthenticated } } = getState();

      if (!isAuthenticated || !token) {
        throw new Error('User is not logged in'); // Handle not authenticated
      }
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the token from state
        },
      };
      const { data } = await axios.delete(
        `/api/users/removefromfavourites`,
        { productId },
        config
      );

      dispatch({ type: USER_REMOVE_FAVOURITE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_REMOVE_FAVOURITE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
