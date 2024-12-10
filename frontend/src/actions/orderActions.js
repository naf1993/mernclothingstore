import toast from "react-hot-toast";
import axios from "axios";
import {
  COUPON_VALIDATE_FAIL,
  COUPON_VALIDATE_REQUEST,
  COUPON_VALIDATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAIL_FAIL,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDERS_MY_FAIL,
  ORDERS_MY_REQUEST,
  ORDERS_MY_SUCCESS,CHECK_IF_FIRST_ORDER_FAIL,CHECK_IF_FIRST_ORDER_REQUEST,CHECK_IF_FIRST_ORDER_SUCCESS
} from "../constants/orderConstants";

import { apiUrl } from "./apiUrl";

export const validateCoupon = (couponCode) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_VALIDATE_REQUEST });
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

    const { data } = await axios.post(`${apiUrl}/api/coupon/validateCoupon`,
      { couponCode },
      config
    );

    dispatch({ type: COUPON_VALIDATE_SUCCESS, payload: data.data.coupon });
  } catch (error) {
    dispatch({
      type: COUPON_VALIDATE_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const createNewOrder = (orderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
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

    const { data } = await axios.post(`${apiUrl}/api/orders`, orderData, config);
    console.log(data.data.order);
    toast.success("New Order Placed");

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.data.order });
  } catch (error) {
    dispatch({ type: ORDER_CREATE_FAIL, payload: error.response.data.message });
    throw new Error(error.response ? error.response.data.message : error.message)
  }
};

export const getUpdatedOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_UPDATE_REQUEST });
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

    const { data } =  await axios.get(`${apiUrl}/api/orders/updatedOrder?orderId=${orderId}`, config);
    
    dispatch({ type: ORDER_UPDATE_SUCCESS, payload: data.data.order });
  } catch (error) {
    dispatch({ type: ORDER_UPDATE_FAIL, payload: error.response.data.message });
    throw new Error(error.response ? error.response.data.message : error.message)
  }
};


export const getMyOrder = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_MY_REQUEST });
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

    const { data } = await axios.get(`${apiUrl}/api/orders/getMyOrders`, config);

    dispatch({ type: ORDERS_MY_SUCCESS, payload: data.data.orders });
  } catch (error) {
    dispatch({ type: ORDERS_MY_FAIL, payload: error.response.data.message });
  }
};

export const getMyOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAIL_REQUEST });
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

    const { data } = await axios.get(`${apiUrl}/api/orders/${id}`, config);

    dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data.data.order });
  } catch (error) {
    dispatch({ type: ORDER_DETAIL_FAIL, payload: error.response.data.message });
  }
};


export const checkIsFirstOrder = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CHECK_IF_FIRST_ORDER_REQUEST });
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

    const { data } =  await axios.get(`${apiUrl}/api/orders/checkIfFirstOrder`, config);
    console.log(data)
    
    dispatch({ type: CHECK_IF_FIRST_ORDER_SUCCESS, payload: data.data.isFirstOrder });
  } catch (error) {
    dispatch({ type: CHECK_IF_FIRST_ORDER_FAIL, payload: error.response.data.message });
    throw new Error(error.response ? error.response.data.message : error.message)
  }
};

