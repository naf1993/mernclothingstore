import axios from "axios";
import {
  CATEGORY_EDIT_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_EDIT_REQUEST,
  CATEGORY_EDIT_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_DELETE_REQUEST,
  SUBCATEGORY_ADD_FAIL,
  SUBCATEGORY_ADD_SUCCESS,
  SUBCATEGORY_ADD_FAIL,
  SUBCATEGORY_ADD_REQUEST,
  FETCH_CATEGORIES_FAIL,
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
} from "constants/categoryConstants";

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_CREATE_REQUEST });

    const { data } = await axios.post("/api/categories", categoryData);

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Edit Category
export const editCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_EDIT_REQUEST });

    const { data } = await axios.put(`/api/categories/${id}`, categoryData);

    dispatch({
      type: CATEGORY_EDIT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_EDIT_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Delete Category
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DELETE_REQUEST });

    await axios.delete(`/api/categories/${id}`);

    dispatch({
      type: CATEGORY_DELETE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};

// Add Subcategory
export const addSubcategory =
  (categoryId, subcategoryData) => async (dispatch) => {
    try {
      dispatch({ type: SUBCATEGORY_ADD_REQUEST });

      const { data } = await axios.post(
        `/api/categories/${categoryId}/subcategories`,
        subcategoryData
      );

      dispatch({
        type: SUBCATEGORY_ADD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: SUBCATEGORY_ADD_FAIL,
        payload: error.response?.data.message || error.message,
      });
    }
  };

// Fetch Categories
export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });

    const { data } = await axios.get("/api/categories");

    dispatch({
      type: FETCH_CATEGORIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_CATEGORIES_FAIL,
      payload: error.response?.data.message || error.message,
    });
  }
};
