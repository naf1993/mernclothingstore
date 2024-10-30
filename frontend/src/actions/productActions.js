import {
  PRODUCT_CATEGORY_REQUEST,
  PRODUCT_CATEGORY_SUCCESS,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_CATEGORY_FAIL,
} from "../constants/productConstants";
import { PRODUCT_LIST_FAIL } from "../constants/productConstants";
import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_SUCCESS } from "../constants/productConstants";
import { PRODUCT_DETAIL_FAIL } from "../constants/productConstants";
import { PRODUCT_COLORS_SUCCESS,PRODUCT_COLORS_REQUEST,PRODUCT_COLORS_REJECT } from "../constants/productConstants";

import axios from "axios";

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_CATEGORY_REQUEST });
    const { data } = await axios.get("/api/categories");
    dispatch({ type: PRODUCT_CATEGORY_SUCCESS, payload: data.data.categories });
  } catch (error) {
    dispatch({
      type: PRODUCT_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getColors = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_COLORS_REQUEST });
    const { data } = await axios.get("/api/products/allcolors");
    dispatch({ type: PRODUCT_COLORS_SUCCESS, payload: data.data.uniqueColors });
  } catch (error) {
    dispatch({
      type: PRODUCT_COLORS_REJECT,
      payload: error.response.data.message,
    });
  }
};

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get("/api/products");

    const allProducts = data.data.products;
    console.log(allProducts)
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
    console.log("these is detailed product ", data);

    dispatch({
      type: PRODUCT_DETAIL_SUCCESS,
      payload: data.data.product,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: PRODUCT_DETAIL_FAIL,
      payload: error.response.statusText,
    });
  }
};
