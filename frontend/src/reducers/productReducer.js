import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,PRODUCT_CATEGORY_FAIL,PRODUCT_CATEGORY_REQUEST,PRODUCT_CATEGORY_SUCCESS
} from "../constants/productConstants";


const initialState = {
    categories:[],
    products: [],
    product: { reviews: [] },
    loading: false,
    error: null,
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        // Product List Actions
        case PRODUCT_LIST_REQUEST:
            return { ...state, loading: true, products: [] };
        case PRODUCT_LIST_SUCCESS:
            return { ...state, loading: false, products: action.payload };
        case PRODUCT_LIST_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Product Detail Actions
        case PRODUCT_DETAIL_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_DETAIL_SUCCESS:
            return { ...state, loading: false, product: action.payload };
        case PRODUCT_DETAIL_FAIL:
            return { ...state, loading: false, error: action.payload };
        case PRODUCT_CATEGORY_REQUEST:
                return { ...state, loading: true };
        case PRODUCT_CATEGORY_SUCCESS:
                return { ...state, loading: false, categories: action.payload };
        case PRODUCT_CATEGORY_FAIL:
                return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
