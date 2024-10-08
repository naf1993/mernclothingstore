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
  CATEGORY_DELETE_SUCCESS,
} from "constants/categoryConstants";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};
export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, loading: true };
    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    case FETCH_CATEGORIES_FAIL:
      return { ...state, loading: false, error: action.payload };

    case CATEGORY_CREATE_REQUEST:
    case CATEGORY_EDIT_REQUEST:
    case CATEGORY_DELETE_REQUEST:
    case SUBCATEGORY_ADD_REQUEST:
      return { ...state, loading: true };
    case CATEGORY_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };
    case CATEGORY_EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case CATEGORY_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
      };
    case SUBCATEGORY_ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.categoryId
            ? { ...cat, subcategories: [...cat.subcategories, action.payload] }
            : cat
        ),
      };
    case CATEGORY_CREATE_FAIL:
    case SUBCATEGORY_ADD_FAIL:
    case CATEGORY_EDIT_FAIL:
    case CATEGORY_DELETE_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
