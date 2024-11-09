import axios from "axios";
import {
  ADD_TO_CART_ERROR,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  REMOVE_FROM_CART_ERROR,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  GET_MY_CART_ERROR,
  GET_MY_CART_REQUEST,
  GET_MY_CART_SUCCESS,UPDATE_CART_QTY_FAIL,UPDATE_CART_QTY_REQUEST,UPDATE_CART_QTY_SUCCESS,
  CLEAR_MY_CART_REQUEST,
  CLEAR_MY_CART_SUCCESS,
  CLEAR_MY_CART_FAIL
} from "../constants/cartConstants";
import toast from "react-hot-toast";

const processCartData = (cartData) => {

 
  
  const cart = cartData[0]
  
  const products = cart?.products.map((item)=>({
    productId:item.productId._id,
    name:item.productId.name,
    image:item.productId.images[0],
    price:item.price,
    count:item.count,
    color:item.color,
    size:item.size,
    total:item.total

  }))
  const subTotal = cart?.products.reduce((acc, item) => acc + item.total, 0);
  return {products,subTotal}

  
};

export const addToCart =
  (productId, count, color, size) => async (dispatch, getState) => {
    try {
      dispatch({ type: ADD_TO_CART_REQUEST });

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
        "/api/cart",
        { productId, count, color, size },
        config
      );
      const { products, subTotal } = processCartData(data.data.cart);
      dispatch({ type: ADD_TO_CART_SUCCESS, payload: {products,subTotal} });
      toast.success("Product Added to Cart");
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_ERROR,
        payload: error.response ? error.response.data.message : error.message,
      });
      toast.error(
        "Cannot add product to cart: " + (error.message || "Unknown error")
      );
    }
  };

export const removeFromCart =
  (productId, color, size) => async (dispatch, getState) => {
    try {
      dispatch({ type: REMOVE_FROM_CART_REQUEST });

      const {
        user: { token, isAuthenticated },
      } = getState();
      if (!isAuthenticated || !token) {
        throw new Error("User is not logged in");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `/api/cart/deleteitem`,
        { productId, color, size },
        config
      );
      const { products, subTotal } = processCartData(data.data.cart);
      dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: {products,subTotal} });
      toast.success("Product removed from cart");
    } catch (error) {
      dispatch({
        type: REMOVE_FROM_CART_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      toast.error("Cannot remove product from cart");
    }
  };

export const getMyCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_MY_CART_REQUEST });

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

    const { data } = await axios.get("/api/cart", config);
    const { products, subTotal } = processCartData(data.data.cart);
    dispatch({ type: GET_MY_CART_SUCCESS, payload: {products,subTotal} });
  } catch (error) {
    dispatch({
      type: GET_MY_CART_ERROR,
      payload: error.response ? error.response.data.message : error.message,
    });
    toast.error("Cannot get user cart: " + (error.message || "Unknown error"));
  }
};

export const updateCartQuantity = (productId, color, size, action) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPDATE_CART_QTY_REQUEST });

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

    const { data } = await axios.patch("/api/cart/updateqty",{productId, color, size, action}, config);
    console.log(data)
    const { products, subTotal } = processCartData(data.data.cart);
    dispatch({ type: UPDATE_CART_QTY_SUCCESS, payload: {products,subTotal} });
  } catch (error) {
    dispatch({
      type: UPDATE_CART_QTY_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
    toast.error("Cannot get user cart: " + (error.message || "Unknown error"));
  }
};


export const clearMyCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CLEAR_MY_CART_REQUEST });

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

    await axios.delete("/api/cart", config);
    dispatch({ type: CLEAR_MY_CART_SUCCESS });
  } catch (error) {
    dispatch({
      type: CLEAR_MY_CART_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
    toast.error("Cannot get user cart: " + (error.message || "Unknown error"));
  }
};