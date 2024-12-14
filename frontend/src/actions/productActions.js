import { PRODUCT_LIST_FAIL } from "../constants/productConstants";
import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_SUCCESS } from "../constants/productConstants";
import { PRODUCT_DETAIL_FAIL } from "../constants/productConstants";
import {
  PRODUCT_CATEGORY_REQUEST,PRODUCT_RECOMMENDED_FAIL,PRODUCT_RECOMMENDED_REQUEST,PRODUCT_RECOMMENDED_SUCCESS,
  PRODUCT_CATEGORY_SUCCESS,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_CATEGORY_FAIL,
  PRODUCT_COLORS_SUCCESS,
  PRODUCT_COLORS_REQUEST,
  PRODUCT_COLORS_REJECT,
  RELATED_PRODUCTS_FAIL,
  RELATED_PRODUCTS_REQUEST,
  GET_SUBCATEGORIES_FAIL,
  GET_SUBCATEGORIES_SUCCESS,
  GET_SUBCATEGORIES_REQUEST,
  RELATED_PRODUCTS_SUCCESS,
  GET_SEARCH_PRODUCTS_FAIL,
  GET_SEARCH_PRODUCTS_REQUEST,
  GET_SEARCH_PRODUCTS_SUCCESS,
  CLEAR_SEARCHED_PRODUCTS,
} from "../constants/productConstants";
import { toast } from "react-hot-toast";
import axios from "axios";

import { apiUrl } from "./apiUrl";

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_CATEGORY_REQUEST });

    const { data } = await axios.get(`${apiUrl}/api/categories`);
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
    const { data } = await axios.get(`${apiUrl}/api/products/allcolors`);
    dispatch({ type: PRODUCT_COLORS_SUCCESS, payload: data.data.uniqueColors });
  } catch (error) {
    dispatch({
      type: PRODUCT_COLORS_REJECT,
      payload: error.response.data.message,
    });
  }
};

export const getRelatedProducts =
  (productId, categoryId) => async (dispatch) => {
    try {
      dispatch({ type: RELATED_PRODUCTS_REQUEST });

      const { data } = await axios.get(
        `${apiUrl}/api/products/relatedproducts/${productId}/${categoryId}`
      );
      // console.log('related products',data?.data?.products)
      dispatch({
        type: RELATED_PRODUCTS_SUCCESS,
        payload: data?.data?.products || [],
      });
    } catch (error) {
      dispatch({
        type: RELATED_PRODUCTS_FAIL,
        payload:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listProducts = (categoryId, subCategoryId) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });

    // Build the query string dynamically based on the presence of categoryId and subCategoryId
    let endpoint = `${apiUrl}/api/products`;

    const params = [];
    if (categoryId) {
      params.push(`Category=${categoryId}`);
    }
    if (subCategoryId) {
      params.push(`SubCategory=${subCategoryId}`);
    }

    // If either categoryId or subCategoryId is present, append the query params
    if (params.length > 0) {
      endpoint += `?${params.join("&")}`;
    }

    // Fetch products from API
    const { data } = await axios.get(endpoint);

    const allProducts = data.data.products;

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: allProducts,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getRecommendedProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_RECOMMENDED_REQUEST });

    const { data } = await axios.get(`${apiUrl}/api/products/toprecommended`);
    console.log(data.products);

    dispatch({
      type: PRODUCT_RECOMMENDED_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_RECOMMENDED_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST });
    const { data } = await axios.get(`${apiUrl}/api/products/${id}`);

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

export const getSearchedProducts = (searchText) => async (dispatch) => {
  try {
    dispatch({ type: GET_SEARCH_PRODUCTS_REQUEST });
    const { data } = await axios.get(`${apiUrl}/api/products/search`, {
      params: { query: searchText },
    });

    dispatch({
      type: GET_SEARCH_PRODUCTS_SUCCESS,
      payload: data.data.products,
    });
  } catch (error) {
    dispatch({
      type: GET_SEARCH_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const clearSearchedProducts = () => {
  return {
    type: CLEAR_SEARCHED_PRODUCTS,
  };
};

export const getSubCategories = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SUBCATEGORIES_REQUEST });
    const { data } = await axios.get(`${apiUrl}/api/categories/${categoryId}`);

    dispatch({
      type: GET_SUBCATEGORIES_SUCCESS,
      payload: data.data.category.subcategories,
    });
  } catch (error) {
    dispatch({
      type: GET_SUBCATEGORIES_FAIL,
      payload: error.response.data.message,
    });
  }
};
