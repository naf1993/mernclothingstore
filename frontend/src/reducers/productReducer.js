import {
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DETAIL_REQUEST,
    PRODUCT_DETAIL_SUCCESS,
    PRODUCT_DETAIL_FAIL,PRODUCT_CATEGORY_FAIL,PRODUCT_CATEGORY_REQUEST,PRODUCT_CATEGORY_SUCCESS,PRODUCT_COLORS_REJECT,PRODUCT_COLORS_REQUEST,PRODUCT_COLORS_SUCCESS,
    RELATED_PRODUCTS_REQUEST,
    RELATED_PRODUCTS_SUCCESS,
    RELATED_PRODUCTS_FAIL,
    GET_SEARCH_PRODUCTS_REQUEST,
    GET_SEARCH_PRODUCTS_SUCCESS,
    GET_SEARCH_PRODUCTS_FAIL,
    CLEAR_SEARCHED_PRODUCTS
} from "../constants/productConstants";


const initialState = {
    categories:[],
    searchedProducts:[],
    products: [],
    relatedProducts:[],
    colors:[],
    product: { reviews: [] },
    loading: false,
    error: null,
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        // Product List Actions
        case PRODUCT_LIST_REQUEST:
        case GET_SEARCH_PRODUCTS_REQUEST:
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
        case PRODUCT_COLORS_REQUEST:
                return {...state,loading:true}
        case PRODUCT_COLORS_SUCCESS:
                return {...state,loading:false,colors:action.payload}
        case PRODUCT_COLORS_REJECT:
                return {...state,loading:false,error:action.payload}
        case RELATED_PRODUCTS_REQUEST:
                    return {...state,loading:true}
        case RELATED_PRODUCTS_SUCCESS:
                    return {...state,loading:false,relatedProducts:action.payload}
        case RELATED_PRODUCTS_FAIL:
                    return {...state,loading:false,error:action.payload}
        case GET_SEARCH_PRODUCTS_REQUEST:
                        return { ...state, loading: true, searchedProducts: [] };
        case GET_SEARCH_PRODUCTS_SUCCESS:
            return { ...state, loading: false, searchedProducts: action.payload };
            case CLEAR_SEARCHED_PRODUCTS:
                return { ...state, loading: false, searchedProducts:[] };
        case GET_SEARCH_PRODUCTS_FAIL:
            return {...state,loading:false,error:action.payload}
        default:
            return state;
    }
};
