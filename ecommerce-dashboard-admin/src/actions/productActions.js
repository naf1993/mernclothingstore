import {
  PRODUCT_IMAGE_DELETE_FAIL,
  PRODUCT_IMAGE_DELETE_REQUEST,
  PRODUCT_IMAGE_DELETE_SUCCESS,
  PRODUCT_LIST_SUCCESS,
} from "../constants/productConstants";
import { PRODUCT_LIST_FAIL } from "../constants/productConstants";
import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_SUCCESS } from "../constants/productConstants";
import { PRODUCT_DETAIL_FAIL } from "../constants/productConstants";
import { PRODUCT_DELETE_FAIL } from "../constants/productConstants";
import { PRODUCT_DELETE_SUCCESS } from "../constants/productConstants";
import { PRODUCT_DELETE_REQUEST } from "../constants/productConstants";
import { PRODUCT_CREATE_FAIL } from "../constants/productConstants";
import { PRODUCT_CREATE_SUCCESS } from "../constants/productConstants";
import { PRODUCT_CREATE_REQUEST } from "../constants/productConstants";
import { PRODUCT_UPDATE_FAIL } from "../constants/productConstants";
import { PRODUCT_UPDATE_REQUEST } from "../constants/productConstants";
import { PRODUCT_UPDATE_SUCCESS } from "../constants/productConstants";

import axios from "axios";

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get("/api/products");

    const allProducts = data.data.products;
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: allProducts,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAIL_SUCCESS,
      payload: data.data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteProductById = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token} `,
      },
    };
    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const deleteImageProduct = (imageUrl) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_IMAGE_DELETE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token} `,
      },
    };
    await axios.delete(`/api/products/images`, {
      headers: config.headers,
      data: { imageUrl }, // Include the imageUrl in the data field
    });

    dispatch({
      type: PRODUCT_IMAGE_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_IMAGE_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createProduct = (productData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`, // Add authorization token
      },
    };
    console.log("this is data before submitting", productData);
    const { data } = await axios.post("/api/products", productData, config);

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProduct =
  (id, productData) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`, // Add authorization token
        },
      };
      console.log("this is data before submitting", productData);
      const { data } = await axios.patch(
        `/api/products/${id}`,
        productData,
        config
      );

      dispatch({
        type: PRODUCT_UPDATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
