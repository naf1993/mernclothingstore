import axios from "axios";
import {
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_USER_REQUEST,
  ORDER_USER_SUCCESS,
  ORDER_USER_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_DAILY_REQUEST,
  ORDER_DAILY_SUCCESS,
  ORDER_DAILY_FAIL,
  ORDER_SUMMARY_REQUEST,
  ORDER_SUMMARY_SUCCESS,
  ORDER_SUMMARY_FAIL,
  SALES_DATA_REQUEST,
  SALES_DATA_SUCCESS,
  SALES_DATA_FAIL,ORDER_SINGLE_FAIL,ORDER_SINGLE_SUCCESS,ORDER_SINGLE_REQUEST,ORDER_DELETE_FAIL,ORDER_DELETE_REQUEST,ORDER_DELETE_SUCCESS
} from "../constants/orderConstants.js";
import { getConfig } from "../utils/config.js";

export const getAllOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });
    const config = getConfig(getState);
    const { data } = await axios.get("/api/orders", config);
    console.log(data.data.orders);

    dispatch({ type: ORDER_LIST_SUCCESS, payload: data.data.orders });
  } catch (error) {
    dispatch({ type: ORDER_LIST_FAIL, payload: error.response.data.message });
  }
};
export const getSingleOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_SINGLE_REQUEST });
    const config = getConfig(getState);
    const { data } = await axios.get(`/api/orders/${id}`, config);
    console.log(data.data.order);
    dispatch({ type: ORDER_SINGLE_SUCCESS, payload: data.data.order });
  } catch (error) {
    dispatch({ type: ORDER_SINGLE_FAIL, payload: error.response.data.message });
  }
};
export const deleteOrder = (id)=>async(dispatch,getState)=>{
  try{
    dispatch({type:ORDER_DELETE_REQUEST})
    const config = getConfig(getState)
    await axios.delete(`/api/orders/${id}`,config)
    dispatch({type:ORDER_DELETE_SUCCESS})
  }catch(error){
    dispatch({type:ORDER_DELETE_FAIL,payload:error.response.data.message})
  }
}

export const getOrdersByUserId = (userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_USER_REQUEST });
    const config = getConfig(getState);
    const { data } = await axios.get(
      "/api/orders/user",
      { _id: userId },
      config
    );
    dispatch({ type: ORDER_USER_SUCCESS, payload: data.data.orders });
  } catch (error) {
    dispatch({ type: ORDER_USER_FAIL, payload: error.response.data.message });
  }
};
export const updateOrderStatus =
  (orderId, status) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_UPDATE_REQUEST });

      const config = getConfig(getState); // Use the reusable config function

      const { data } = await axios.patch(
        `/api/orders/${orderId}/updateOrder`,
        { status },
        config
      );

      dispatch({ type: ORDER_UPDATE_SUCCESS, payload: data.data.updatedOrder });
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_FAIL,
        payload: error.response.data.message,
      });
    }
  };
export const getDailyOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DAILY_REQUEST });

    const config = getConfig(getState); // Use the reusable config function

    const { data } = await axios.get("/api/orders/daily", config);

    dispatch({ type: ORDER_DAILY_SUCCESS, payload: data.data.dailyOrders });
  } catch (error) {
    dispatch({ type: ORDER_DAILY_FAIL, payload: error.response.data.message });
  }
};
export const getOrderSummary = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_SUMMARY_REQUEST });

    const config = getConfig(getState); // Use the reusable config function

    const { data } = await axios.get("/api/orders/summary", config);

    dispatch({ type: ORDER_SUMMARY_SUCCESS, payload: data.data });
  } catch (error) {
    dispatch({
      type: ORDER_SUMMARY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get sales data
export const getSalesData =
  (startDate, endDate) => async (dispatch, getState) => {
    try {
      dispatch({ type: SALES_DATA_REQUEST });

      const config = getConfig(getState); // Use the reusable config function

      const { data } = await axios.get(
        `/api/orders/sales?startDate=${startDate}&endDate=${endDate}`,
        config
      );

      dispatch({ type: SALES_DATA_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: SALES_DATA_FAIL, payload: error.response.data.message });
    }
  };
