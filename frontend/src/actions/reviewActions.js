import axios from "axios";
import {
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_SUCCESS,
  REVIEW_ELIGIBLE_FAIL,
  REVIEW_ELIGIBLE_REQUEST,
  REVIEW_ELIGIBLE_SUCCESS,
  REVIEW_CREATE_FAIL,
} from "../constants/productConstants";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const checkEligibleForReview =
  (productId) => async (dispatch, getState) => {
    try {
      dispatch({ type: REVIEW_ELIGIBLE_REQUEST });
      const {
        user: { token, isAuthenticated },
      } = getState();

      if (!isAuthenticated || !token) {
        throw new Error("User not logged in");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${apiUrl}/api/reviews/${productId}`, config);

      dispatch({ type: REVIEW_ELIGIBLE_SUCCESS, payload: data.data.eligible });
    } catch (error) {
      dispatch({
        type: REVIEW_ELIGIBLE_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const createNewReview =
  (productId, review, rating) => async (dispatch, getState) => {
    try {
      dispatch({ type: REVIEW_CREATE_REQUEST });
      const {
        user: { token, isAuthenticated },
      } = getState();

      if (!isAuthenticated || !token) {
        throw new Error("User not logged in");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${apiUrl}/api/reviews`,
        { productId, review, rating },
        config
      );

      dispatch({ type: REVIEW_CREATE_SUCCESS });
    } catch (error) {
      dispatch({
        type: REVIEW_CREATE_FAIL,
        payload: error.response ? error.response.data.message : error.message,
      });
      throw new Error(
        error.response ? error.response.data.message : error.message
      );
    }
  };
